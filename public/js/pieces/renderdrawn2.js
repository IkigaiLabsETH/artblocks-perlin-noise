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

function createObjects(g, color) {
  const objs = [];
  g.loadPixels();

  let pixelIndex = 0;
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

    const c = color;
    objs.push(new MyPoint(x, y, c, {}));

    pixelIndex++;
  }

  return objs;
}

let objs = [];
let BGCOLOR;

let baseCount = -1;

const colorPalettes = ["#ED2252", "#0033CC", "#00CC33", "#FFBB33", "#FF3300"];

function setup() {
  createCanvas((W = 640), W);
  pixelDensity(1);

  BGCOLOR = color(255);

  loaded();
}

function loaded() {
  change();
  requestAnimationFrame(() => setTimeout(change, 1000 * 10));
}

function change() {
  baseCount++;

  const img = createGraphics(W, W);
  const colorPalette = color(colorPalettes[baseCount % colorPalettes.length]);

  baseImageFuncs[baseCount % baseImageFuncs.length](img, colorPalette);
  objs = createObjects(img, colorPalette);

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
  (g, color) => {
    g.background(BGCOLOR);
    g.noSmooth();

    let padding = 20;

    g.textAlign(CENTER, CENTER);

    const size = (width < height ? width : height) * 0.8;
    
    g.textSize(size);
    g.fill(color); // Use color from the palette
    g.text('生', width / 2, height / 2);

    g.noStroke();
    g.fill("black");
    g.textAlign(CENTER, BOTTOM);

    g.textFont("IKIGAI");
    g.textSize(20);
    g.text(["ikigailabs.xyz"].join("\n"), width / 2, height - padding);
  },
  // ... other baseImageFuncs functions
];
