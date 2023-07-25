let alpha = 255;
let direction = -1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(32);
}

function draw() {
  background(0);
  fill(255, 255, 255, alpha); // White color for winter
  textAlign(CENTER, CENTER);
  text("生", width / 2, height / 2);
  
  alpha += direction;
  if (alpha <= 0 || alpha >= 255) {
    direction *= -1;
  }
}
