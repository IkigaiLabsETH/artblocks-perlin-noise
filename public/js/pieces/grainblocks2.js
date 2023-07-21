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
    {
        name: 'cako1',
        colors: ['#000000', '#d55a3a', '#2a5c8a', '#7e7d14', '#dbdac9'],
        stroke: '#000000',
        background: '#f4e9d5',
      },
      {
        name: 'cako2',
        colors: ['#dbdac9', '#d55a3a', '#2a5c8a', '#b47b8c', '#7e7d14'],
        stroke: '#000000',
        background: '#000000',
      },
      {
        name: 'cako2_sub1',
        colors: ['#dbdac9', '#d55a3a', '#2a5c8a'],
        stroke: '#000000',
        background: '#000000',
      },
      {
        name: 'cako2_sub2',
        colors: ['#dbdac9', '#d55a3a', '#7e7d14'],
        stroke: '#000000',
        background: '#000000',
      },
      {
        name: 'cc239',
        colors: ['#e3dd34', '#78496b', '#f0527f', '#a7e0e2'],
        background: '#e0eff0'
      },
      {
        name: 'cc234',
        colors: ['#ffce49', '#ede8dc', '#ff5736', '#ff99b4'],
        background: '#f7f4ed'
      },
      {
        name: 'cc232',
        colors: ['#5c5f46', '#ff7044', '#ffce39', '#66aeaa'],
        background: '#e9ecde'
      },
      {
        name: 'cc238',
        colors: ['#553c60', '#ffb0a0', '#ff6749', '#fbe090'],
        background: '#f5e9de'
      },
      {
        name: 'cc242',
        colors: ['#bbd444', '#fcd744', '#fa7b53', '#423c6f'],
        background: '#faf4e4'
      },
      {
        name: 'cc245',
        colors: ['#0d4a4e', '#ff947b', '#ead3a2', '#5284ab'],
        background: '#f6f4ed'
      },
      {
        name: 'cc273',
        colors: ['#363d4a', '#7b8a56', '#ff9369', '#f4c172'],
        background: '#f0efe2'
      },
      {
        name: 'rag-mysore',
        colors: ['#ec6c26', '#613a53', '#e8ac52', '#639aa0'],
        background: '#d5cda1'
      },
      {
        name: 'rag-gol',
        colors: ['#d3693e', '#803528', '#f1b156', '#90a798'],
        background: '#f0e0a4'
      },
      {
        name: 'rag-belur',
        colors: ['#f46e26', '#68485f', '#3d273a', '#535d55'],
        background: '#dcd4a6'
      },
      {
        name: 'rag-bangalore',
        colors: ['#ea720e', '#ca5130', '#e9c25a', '#52534f'],
        background: '#f9ecd3'
      },
      {
        name: 'rag-taj',
        colors: ['#ce565e', '#8e1752', '#f8a100', '#3ac1a6'],
        background: '#efdea2'
      },
      {
        name: 'rag-virupaksha',
        colors: ['#f5736a', '#925951', '#feba4c', '#9d9b9d'],
        background: '#eedfa2'
      },
      {
        name: 'dt01',
        colors: ['#172a89', '#f7f7f3'],
        stroke: '#172a89',
        background: '#f3abb0',
      },
      {
        name: 'dt02',
        colors: ['#302956', '#f3c507'],
        stroke: '#302956',
        background: '#eee3d3',
      },
      {
        name: 'dt02b',
        colors: ['#eee3d3'],
        stroke: '#302956',
        background: '#f3c507',
      },
      {
        name: 'dt03',
        colors: ['#000000', '#a7a7a7'],
        stroke: '#000000',
        background: '#0a5e78',
      },
      {
        name: 'dt04',
        colors: ['#50978e', '#f7f0df'],
        stroke: '#000000',
        background: '#f7f0df',
      },
      {
        name: 'dt05',
        colors: ['#ee5d65', '#f0e5cb'],
        stroke: '#080708',
        background: '#f0e5cb',
      },
      {
        name: 'dt06',
        colors: ['#271f47', '#e7ceb5'],
        stroke: '#271f47',
        background: '#cc2b1c',
      },
      {
        name: 'dt07',
        colors: ['#6a98a5', '#d24c18'],
        stroke: '#efebda',
        background: '#efebda',
      },
      {
        name: 'dt08',
        colors: ['#5d9d88', '#ebb43b'],
        stroke: '#efebda',
        background: '#efebda',
      },
      {
        name: 'dt09',
        colors: ['#052e57', '#de8d80'],
        stroke: '#efebda',
        background: '#efebda',
      },
      {
        name: 'dt10',
        colors: ['#e5dfcf', '#151513'],
        stroke: '#151513',
        background: '#e9b500',
      },
      {
        name: 'dt11',
        colors: ['#ece9e2'],
        stroke: '#221e1f',
        background: '#75c4bf',
      },
      {
        name: 'dt12',
        colors: ['#f5f2d3'],
        stroke: '#073c5c',
        background: '#c0d0c3',
      },
      {
        name: 'dt13',
        colors: ['#f5f2d3', '#f5f2d3', '#fbd6b8'],
        stroke: '#ec5525',
        background: '#ec5525',
      }
  ];
  
  let margin = 0;
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
    background(255); // White background
    loop();
  }
  
  function drawParticle(x, y, size, color) {
    let graininess = 420;
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
  