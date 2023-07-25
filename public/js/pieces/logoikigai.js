let angle = 0;
let xoff = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  textSize(200);
  fill(0, 255, 0); // Green color for spring
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  rotate(angle);
  text("生", 0, 0);
  angle += noise(xoff) * 0.01;
  xoff += 0.01;
}
