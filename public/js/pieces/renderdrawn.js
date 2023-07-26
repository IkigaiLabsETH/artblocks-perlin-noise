p5.disableFriendlyErrors = true;

class MyPoint {
  constructor(x, y, c, props) {
    this.color = c;
    this.props = props;

    this.pos = createVector(x, y);
    this.cpos = createVector(random(width), random(height));
  }

  update() {
    this.cpos = p5.Vector.lerp(this.cpos, this.pos, 0.05);
    if (this.pos.dist(this.cpos) < 0.1) {
      this.cpos = this.pos.copy();
    }
  }

  display() {
    set(this.cpos.x, this.cpos.y, this.color);
  }
}

function createObjects(g) {
  const objs = [];
  g.loadPixels();
  const d = g.pixelDensity();
  
  let pixelIndex = 0; // Used for coordinate computation
  let y = 0;
  let x;

  for (let i = 0; i < g.pixels.length; i += 4) {
    x = pixelIndex % g.width;
    if (x === 0 && i !== 0) y++;
    
    if (
      g.pixels[i] === red(BGCOLOR) &&
      g.pixels[i + 1] === green(BGCOLOR) &&
      g.pixels[i + 2] === blue(BGCOLOR) &&
      g.pixels[i + 3] === alpha(BGCOLOR)
    ) {
      continue;
    } else if (g.pixels[i + 3] === 0) {
      continue;
    }

    const c = color(g.pixels[i], g.pixels[i + 1], g.pixels[i + 2], g.pixels[i + 3]);
    objs.push(new MyPoint(x, y, c, {}));
    
    pixelIndex++;
  }

  return objs;
}

let objs = [];
let BGCOLOR;

let baseCount = -1;

let imgCat;
function preload() {
  imgCat = loadImage("ikigai.png");
}

function setup() {
  createCanvas((W = 640), W);
  pixelDensity(1);

  BGCOLOR = color(255);

  loaded();
}

function loaded() {
  change();
  // Use requestAnimationFrame for smoother animations
  requestAnimationFrame(() => setTimeout(change, 1000 * 10));
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

  loadPixels();

  for (const o of objs) {
    o.update();
    o.display();
  }

  updatePixels();
}

const baseImageFuncs = [
  (g) => {
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
    g.textSize(20);
    g.text(["shibomb.xyz"].join("\n"), width / 2, height - padding);
  },
  (g) => {
    g.background(BGCOLOR);

    let padding = 40;

    g.noStroke();
    g.fill(0);

    g.textFont("Geologica");
    g.textSize(62);

    g.textAlign(LEFT, TOP);
    g.text(
      ["PROCESSING", "COMMUNITY DAY", "TOKYO 2023"].join("\n"),
      padding,
      padding
    );

    g.textAlign(RIGHT, BOTTOM);
    g.text(
      ["6/27-7/4", "SHIBUYA HIKARIE", "8/ CUBE 1,2,3"].join("\n"),
      width - padding,
      height - padding
    );
  },
  (g) => {
    g.background(BGCOLOR);

    g.drawingContext.shadowColor = color(128, 128, 128);
    g.drawingContext.shadowBlur = 0;
    g.drawingContext.shadowOffsetX = 4;
    g.drawingContext.shadowOffsetY = 4;

    let padding = 40;

    g.noStroke();
    g.fill("#ED2252");

    g.textFont("Geologica");
    g.textSize(128);

    g.textAlign(LEFT, TOP);
    g.text(["p5.js", "i18n-ja"].join("\n"), padding, padding);

    g.strokeWeight(4);
    g.stroke(0);
    g.fill(BGCOLOR);

    g.textSize(62);
    g.textAlign(RIGHT, BOTTOM);
    g.text(
      ["Let's contribute", "for BEGINNER", "and FUTURE!!"].join("\n"),
      width - padding,
      height - padding
    );
  },
];
