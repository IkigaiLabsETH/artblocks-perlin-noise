// Define the palettes with specific names, colors, and backgrounds
const palettes = [
    {
      name: 'frozen-rose',
      colors: ['#29368f', '#e9697b', '#1b164d', '#f7d996'],
      background: '#f2e8e4',
    },
    {
      name: 'winter-night',
      colors: ['#122438', '#dd672e', '#87c7ca', '#ebebeb'],
      background: '#ebebeb',
    },
    // Add more palettes if needed
  ];
  
  let margin = 48;
  let grainScale = 0.03;
  let flowFieldScale = 0.1;
  let flowFieldStrength = 1.5;
  let renderingSpeed = 30;
  let time = 0;
  
  let n;
  let wSize;
  let hSize;
  let palette;
  let boxes = [];
  let renderedCount = 0;
  
  function setup() {
    createCanvas(1000, 1000);
    noLoop();
  
    // Initialize variables
    n = floor(random(12, 17));
    wSize = (width - 2 * margin) / n;
    hSize = (height - 2 * margin) / n;
  
    // Choose a random palette from the palettes array
    palette = random(palettes);
  
    // Set rendering speed
    frameRate(renderingSpeed);
  
    // Initialize boxes
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let x = i * wSize + margin;
        let y = j * hSize + margin;
        let w = floor(random(1, n - i + 1)) * wSize;
        let h = floor(random(1, n - j + 1)) * hSize;
  
        let noiseX = noise(x * flowFieldScale, y * flowFieldScale);
        let noiseY = noise(x * flowFieldScale + 1000, y * flowFieldScale + 1000);
        let flowX = map(noiseX, 0, 1, -flowFieldStrength, flowFieldStrength);
        let flowY = map(noiseY, 0, 1, -flowFieldStrength, flowFieldStrength);
  
        let noiseXRect = noise(x * grainScale + flowX, y * grainScale + flowY) * 2 - 1;
        let noiseYRect = noise(x * grainScale + 1000 + flowX, y * grainScale + 1000 + flowY) * 2 - 1;
        let noiseW = noise(w * grainScale + flowX, h * grainScale + flowY) * 2 - 1;
        let noiseH = noise(w * grainScale + 1000 + flowX, h * grainScale + 1000 + flowY) * 2 - 1;
  
        let noiseX2 = noise(x * grainScale * 0.5, y * grainScale * 0.5);
        let noiseY2 = noise(x * grainScale * 0.5 + 1000, y * grainScale * 0.5 + 1000);
        noiseXRect += (noiseX2 * 2 - 1) * 5;
        noiseYRect += (noiseY2 * 2 - 1) * 5;
  
        let lightX = map(x + noiseXRect, 0, width, 0, 255);
        let lightY = map(y + noiseYRect, 0, height, 0, 255);
  
        let fillColor = random(palette.colors);
  
        boxes.push({
          x: x + noiseXRect,
          y: y + noiseYRect,
          w: w + noiseW,
          h: h + noiseH,
          lightX: lightX,
          lightY: lightY,
          fillColor: fillColor,
          isRendered: false,
        });
      }
    }
  
    // Start rendering
    renderedCount = 0;
    background(palette.background);
    loop();
  }
  
  function drawParticle(x, y, size, color) {
    let graininess = 1;
    fill(color);
    noStroke();
    for (let i = 0; i < size * graininess; i++) {
      let offsetX = random(-size, size);
      let offsetY = random(-size, size);
      let alpha = random(100, 255);
      let s = random(1, 3);
      ellipse(x + offsetX, y + offsetY, s, s);
    }
  }
  
  function draw() {
    if (renderedCount >= boxes.length) {
      noLoop();
      return;
    }
  
    let box = boxes[renderedCount];
    drawParticle(box.x, box.y, box.w, box.fillColor);
    box.isRendered = true;
    renderedCount++;
  }
  