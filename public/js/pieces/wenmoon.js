

function setup() {
    createCanvas((W = 640), W);
  }
  
  function draw() {
    background(0);
  
    drawBackground();
  
    drawMoon();
  
    drawCloud();
  
    drawForest();
  }
  
  function drawBackground() {
    push();
  
    const gradient = drawingContext.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0.0, "#4E6889");
    gradient.addColorStop(0.5, "#576C91F");
    gradient.addColorStop(1.0, "#8493A4");
    drawingContext.fillStyle = gradient;
  
    rect(0, 0, width, height);
  
    pop();
  }
  
  function drawMoon() {
    push();
  
    drawingContext.shadowColor = color("white");
    drawingContext.shadowBlur = W / 10;
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
  
    strokeWeight(W / 20);
    stroke(255, 5);
    fill(255);
    circle(W / 2, W / 2, W / 5);
  
    pop();
  }
  
  function drawCloud() {
    push();
  
    const effect = (sin(radians(frameCount * 0.1) + PI * 1.5) + 1) / 2;
    const step = W / 128;
    for (let y = 0; y < W + step; y += step) {
      for (let x = 0; x < W + step; x += step) {
        noStroke();
  
        const n = noise(millis() * 0.0001 + x * 0.01, y * 0.01, millis() * 0.0001);
        fill(n * 200 + 0x07, n * 200 + 0x17, n * 200 + 0x2f, effect * 200);
        rect(x, y, step, step);
      }
    }
  
    pop();
  }
  
  function drawForest() {
    push();
  
    const effect = sin(radians(frameCount * 0.25) + PI * 1.5);
    const step = W / 16;
    for (let x = 0; x < W + step*2; x += step) {
      stroke(0);
      fill(0);
  
      const n = noise(x * 0.01, millis() * 0.00001);
      curve(
        x,
        W + (W / 3),
        x,
        W + (W / 3),
        x + step * effect,
        W - (W / 3) * n,
        x + step * 10,
        W - (W / 3)
      );
      curve(
        x + (step/2),
        W + (W / 4),
        x+ (step/2),
        W + (W / 4),
        x + step * effect+ (step/2),
        W - (W / 4) * n,
        x + step * 10+ (step/2),
        W - (W / 4)
      );
    }
  
    pop();
  }
  