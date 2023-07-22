p5.disableFriendlyErrors = true;

class MyPoint {
  constructor(x, y, c, props) {
    this.color = c;
    this.props = props;

    this.pos = createVector(x, y);

    // this.cpos = this.pos.copy()
    this.cpos = createVector(random(width), random(height));
  }

  update() {
    // this.cpos.x = this.pos.x + random(-1, 1);
    // this.cpos.y = this.pos.y + random(-1, 1);
    this.cpos = p5.Vector.lerp(this.cpos, this.pos, 0.05);
    if (this.pos.dist(this.cpos) < 0.1) {
      this.cpos = this.pos.copy();
    }
  }

  display() {
    // strokeWeight(1)
    // stroke(this.color);
    // noFill();
    // point(this.cx, this.cy);
    set(this.cpos.x, this.cpos.y, this.color);
  }
}

function createObjects(g) {
  const objs = [];

  g.loadPixels();
  const d = g.pixelDensity();

  console.log("#createObjects g.pixels.length=" + g.pixels.length + ", d=" + d);

  for (let i = 0; i < g.pixels.length; i += 4) {
    if (
      g.pixels[i] == red(BGCOLOR) &&
      g.pixels[i + 1] == green(BGCOLOR) &&
      g.pixels[i + 2] == blue(BGCOLOR) &&
      g.pixels[i + 3] == alpha(BGCOLOR)
    ) {
      // console.log(i + ":skip by white");
      continue;
    } else if (g.pixels[i + 3] == 0) {
      // console.log(i + ":skip by g.pixels[i + 3] == 0");
      continue;
    }

    const x = (i / 4 / d) % g.width;
    const y = Math.floor(i / 4 / d / g.width) / d;

    // console.log(i + ":g.pixels[i + 3] =" + g.pixels[i + 3]);

    const c = color(
      g.pixels[i],
      g.pixels[i + 1],
      g.pixels[i + 2],
      g.pixels[i + 3]
    );

    objs.push(new MyPoint(x, y, c, {}));
  }

  console.log("objs.length=" + objs.length);
  return objs;
}

// -------------------------------------------------
// main
// -------------------------------------------------
let objs = [];
let BGCOLOR;

let baseCount = -1;

let imgCat;
function preload() {
  imgCat = loadImage(".png");
}

function setup() {
  createCanvas((W = 640), W);
  // W = windowWidth < windowHeight ? windowWidth : windowHeight
  // createCanvas(W, W);
  pixelDensity(1);

  BGCOLOR = color(255);

  // wait for font loading
  // setTimeout(loaded, 3000);
  loaded();
}

function loaded() {
  change();
  setInterval(change, 1000 * 10);
}

function change() {
  baseCount++;

  const img = createGraphics(W, W);

  baseImageFuncs[baseCount % baseImageFuncs.length](img);
  objs = createObjects(img);
  
  img.remove();
}

function draw() {
  background(BGCOLOR);

  // ----

  loadPixels();

  // let i = 0;
  for (const o of objs) {
    // i++;
    // if (i % 2 == 1) continue
    o.update();
    o.display();
  }

  updatePixels();
}

// -------------------------------------------------
// base image functions
// -------------------------------------------------
const baseImageFuncs = [
  (g) => {
    // g.clear();
    g.background(BGCOLOR);
    g.noSmooth();

    let padding = 20;

    g.imageMode(CENTER);

    const size = (width < height ? width : height) * 0.8;
    g.image(imgCat, width / 2, height / 2, size, size);

    g.noStroke();
    g.fill("black");
    g.textAlign(CENTER, BOTTOM);

    g.textFont("Geologica");
    g.textSize(42);
    g.text(["ikigailabs.xyz"].join("\n"), width / 2, height - padding);
  },
  (g) => {
    // g.clear();
    g.background(BGCOLOR);

    let padding = 40;

    // g.strokeWeight(0);
    // g.stroke(0);
    g.noStroke();
    g.fill(0);

    g.textFont("Geologica");
    g.textSize(62);

  },
  (g) => {
    // g.clear();
    g.background(BGCOLOR);

    g.drawingContext.shadowColor = color(128, 128, 128);
    g.drawingContext.shadowBlur = 0;
    g.drawingContext.shadowOffsetX = 4;
    g.drawingContext.shadowOffsetY = 4;

    let padding = 40;

    // g.strokeWeight(0);
    // g.stroke(0);
    g.noStroke();
    g.fill("#ED2252");

    g.textFont("Geologica");
    g.textSize(128);


    g.strokeWeight(4);
    g.stroke(0);
    g.fill(BGCOLOR);

  },
];
