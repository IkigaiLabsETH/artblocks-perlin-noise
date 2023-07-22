import "dotenv/config.js";
import { createCanvas } from "canvas";
import { writeFile } from "fs/promises";
import express from "express";
import { Configuration, OpenAIApi } from "openai";
import bodyParser from "body-parser";
import http from "http";
import * as path from "path";
import os from "os";

// for testing
// import axios from "axios";

export const getLocalHosts = () => {
  var interfaces = os.networkInterfaces();
  var addresses = new Set();
  for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
      var address = interfaces[k][k2];
      if (address.family === "IPv4" && !address.internal) {
        addresses.add(address.address);
      }
    }
  }

  return [...addresses];
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

await serve();

// optionally, send an immediate test
// await test();

async function drawCode(code) {
  const width = 512;
  const height = 512;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  const src = `(() => {
return ({ context, width, height }) => {
${code
  .trim()
  .split("\n")
  .map((n) => `  ${n}`)
  .join("\n")}
};
})();`;
  try {
    console.log("Eval:\n" + src);
    const result = eval(src);
    if (typeof result === "function") {
      result({ context, width, height });
    } else {
      throw new Error(`expected render() to be a function`);
    }
  } catch (err) {
    console.error(err);
  }
  const buf = canvas.toBuffer("image/png");
  await writeFile(path.resolve(process.cwd(), "canvas.js"), src);
  await writeFile(path.resolve(process.cwd(), "canvas.png"), buf);
}

async function test() {
  return axios.post("http://192.168.0.32:8080/draw", {
    text: "fill a blue rect",
  });
}

async function serve() {
  const app = express();

  const messages = [];

  const signature = `function render ({ context, width, height }) {`;
  const defaultSrc = `/* inner body, HTML5 Canvas drawing code goes here */`;
  let scriptSrc = defaultSrc;
  await drawCode(scriptSrc);

  app.use(bodyParser.json());
  app.use("/reset", async (req, res) => {
    messages.length = 0;
    res.end(null);
  });
  app.post("/draw", async (req, res) => {
    console.log("Prompt:", req.body.text);

    if (messages.length == 0) {
      messages.push({
        role: "system",
        content: `Please modify the inner body of the render() function based on the user prompt, using only HTML5 Canvas API. For each new request, only return the modified inner body of the render() function:
${signature}
  ${scriptSrc}
}`,
      });
    }
    messages.push({
      role: "user",
      content: req.body.text,
    });

    const schema = {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "the JavaScript drawing code",
        },
      },
      required: ["code"],
    };
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-0613",
        // model: "gpt-4-0613",
        messages,
        max_tokens: 256,
        functions: [{ name: `set_js_code`, parameters: schema }],
        function_call: { name: `set_js_code` },
        temperature: 0.6,
      });
      const message = completion.data.choices[0].message;
      if (
        message.function_call &&
        message.function_call.name === "set_js_code"
      ) {
        const args = message.function_call.arguments;
        try {
          console.log("Trying to parse JSON:", args);
          let data;
          let newCode;
          try {
            data = eval(`(() => { return ${args}; })()`);
            newCode = data.code;
          } catch (err) {
            console.error("Could not eval() data:", err.message);
            console.log("args:", JSON.stringify(args));
          }
          if (!newCode) {
            newCode = JSON.parse(args).code;
          }
          scriptSrc = newCode;
          await drawCode(newCode);
          messages.push({
            role: "assistant",
            content: `Ok, I've modified the inner body of the code, and it now looks like this:\n${scriptSrc}`,
          });
        } catch (err) {
          console.error(err);
          scriptSrc = defaultSrc;
        }
        console.log("New script src:", scriptSrc);
      }
      console.log(`Conversation:`, messages);
      res.status(200).json("hello world");
    } catch (err) {
      console.error(err.message);
      res.status(400).json({ error: err.message });
    }
  });
  app.use(express.static("src/"));

  const port = 8080;

  var internalIp = getLocalHosts()[0];
  var altNames = ["localhost", "127.0.0.1"];
  if (internalIp && altNames.indexOf(internalIp) === -1) {
    altNames.unshift(internalIp);
  }
  http
    .createServer(app)
    .listen(8080, () =>
      console.log(`HTTP:\nhttp://localhost:8080/\nhttp://${internalIp}:8080/\n`)
    );
}