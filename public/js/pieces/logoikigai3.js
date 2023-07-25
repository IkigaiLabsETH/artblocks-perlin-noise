let leaves = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  fill(255, 69, 0); // Red color for autumn
  textSize(69);
}

function draw() {
  background(0);
  leaves.forEach(leaf => {
    leaf.y += leaf.speed;
    text("生", leaf.x, leaf.y);
  });
  
  if (random() < 0.01) {
    leaves.push({x: random(width), y: 0, speed: random(1, 5)});
  }
}
