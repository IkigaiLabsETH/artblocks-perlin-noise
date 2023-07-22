// Define the four season color palettes
let springPalette = ["#4E5F71", "#7A9482", "#9EC0A7", "#C2C27F", "#C9A203"];
let summerPalette = ["#ff6b35", "#f7c59f", "#efefd0", "#00509d", "#74c7b8"];
let autumnPalette = ["#9c6644", "#c9a66b", "#c4bb7d", "#d1d1b3", "#609848"];
let winterPalette = ["#aecdc2", "#5e7367", "#3b4d61", "#253746", "#101f30"];

let gridSize = 6;
let gridPoints = [];
let trapezoids = [];

// Choose the current palette
let palette = springPalette;  // Change this line to use a different palette

function setup() {
  createCanvas(2000, 2000);
  pixelDensity(2);

  // Create grid points
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let x = width / gridSize * i + width / gridSize / 2;
      let y = height / gridSize * j + height / gridSize / 2;
      gridPoints.push(createVector(x, y));
    }
  }

  // Shuffle the array of points
  shuffle(gridPoints, true);

  // Group points into pairs, and sort pairs by average y value
  for (let i = 0; i < gridPoints.length; i += 2) {
    let pair = [gridPoints[i], gridPoints[i + 1]].sort((a, b) => a.y - b.y);
    trapezoids.push(pair);
  }
  trapezoids.sort((a, b) => (a[0].y + a[1].y) / 2 - (b[0].y + b[1].y) / 2);
}

function draw() {
  background(255);
  
  // Draw each trapezoid
  for (let i = 0; i < trapezoids.length; i++) {
    let trapezoid = trapezoids[i];
    fill(random(palette));
    noStroke();
    beginShape();
    vertex(trapezoid[0].x, trapezoid[0].y);
    vertex(trapezoid[1].x, trapezoid[1].y);
    vertex(trapezoid[1].x, height);
    vertex(trapezoid[0].x, height);
    endShape(CLOSE);
  }

  granulateChannels(25);
  noLoop();
}

function granulateChannels(amount) {
  loadPixels();
  const d = pixelDensity();
  const pixelsCount = 4 * (width * d) * (height * d);
  for (let i = 0; i < pixelsCount; i += 4) {
    let randMod = random(1, 1.75);
    pixels[i] = pixels[i] + random(-amount * randMod, amount);
    pixels[i + 1] = pixels[i + 1] + random(-amount * randMod, amount);
    pixels[i + 2] = pixels[i + 2] + random(-amount * randMod, amount);
  }
  updatePixels();
}
