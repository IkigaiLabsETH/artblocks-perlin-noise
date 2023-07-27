// Defining the color palettes
const colorPalettes = [
    ['#E6B0AA', '#A9CCE3', '#ABEBC6', '#F9E79F', '#5D6D7E'],
    ['#1B4F72', '#641E16', '#154360', '#0B5345', '#186A3B'],
    ['#17202A', '#424949', '#196F3D', '#F1C40F', '#6C3483'],
    ['#78281F', '#2E86C1', '#28B463', '#F4D03F', '#7D3C98'],
    ['#A93226', '#3498DB', '#1E8449', '#F5B041', '#884EA0'],
  ];
  
  let seasons = {
    spring: {color: colorPalettes[0], sketch: 'spring'},
    summer: {color: colorPalettes[1], sketch: 'summer'},
    autumn: {color: colorPalettes[2], sketch: 'autumn'},
    winter: {color: colorPalettes[3], sketch: 'winter'},
  };
  
  // Other global variables...
  
  function setup() {
    createCanvas(windowWidth, windowHeight);
    let keys = Object.keys(seasons);
    season = seasons[keys[(keys.length * Math.random()) << 0]];
    currentPalette = season.color;
    background(0);
    textSize(200);
    fill(...season.color);
    noLoop();
  }
  
  function draw() {
    let bgColor = currentPalette.splice(int(random(currentPalette.length)), 1)[0];
    background(bgColor);
    granulateChannels(25);

    textSize(map(noise(frameCount * 0.01), 0, 1, 10, 200));
    fill(random(255), random(255), random(255));
    rotate(random(TWO_PI));
  
    // Change text fill color based on background color
    fill(255 - red(bgColor), 255 - green(bgColor), 255 - blue(bgColor));
  
    
    switch (season.sketch) {
      case 'spring':
        translate(width / 2, height / 2);
        rotate(angle);
        text("生", 0, 0);
        angle += noise(xoff) * 0.1;
        xoff += 0.01;
        break;
      case 'summer':
        textAlign(CENTER, CENTER);
        text("生", width / 2, height / 2);
        size = size + sin(frameCount * 0.05) * 2;
        break;
      case 'autumn':
        leaves.forEach(leaf => {
          leaf.y += leaf.speed;
          push();
          translate(leaf.x, leaf.y);
          rotate(radians(leaf.y));
          text("生", 0, 0);
          pop();
        });
  
        if (random() < 0.01) {
          leaves.push({x: random(width), y: 0, speed: random(1, 5)});
        }
        break;
      case 'winter':
        textAlign(CENTER, CENTER);
        scale(map(sin(frameCount * 0.01), -1, 1, 0.5, 1.5));
        text("生", width / 2, height / 2);
        break;
    }
  }
  
  function granulateChannels(amount) {
    loadPixels();
    const d = pixelDensity();
    const pixelsCount = 4 * (width * d) * (height * d);
    for (let i = 0; i < pixelsCount; i += 4) {
      let randMod = random(1, 1.75)
      pixels[i] = pixels[i] + random(-amount * randMod, amount);
      pixels[i + 1] = pixels[i + 1] + random(-amount * randMod, amount);
      pixels[i + 2] = pixels[i + 2] + random(-amount * randMod, amount);
    }
    updatePixels();
  }
  
  
  