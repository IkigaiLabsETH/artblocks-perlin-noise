let size = 32;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  fill(255, 165, 0); // Orange color for summer
}

function draw() {
  background(0);
  textSize(size);
  textAlign(CENTER, CENTER);
  text("生", width / 2, height / 2);
  size = size + sin(frameCount * 0.05) * 2;
}
