var colorPalettes;
var currentPalette;
var angle = 0;
var xoff = 0;
var leaves = [];
var alphaVal = 0;
var direction = 1;
var season;

colorPalettes = [
  ['#e3dd34', '#78496b', '#f0527f', '#a7e0e2'],
  ['#ffce49', '#ede8dc', '#ff5736', '#ff99b4'],
  ['#5c5f46', '#ff7044', '#ffce39', '#66aeaa'],
  ['#553c60', '#ffb0a0', '#ff6749', '#fbe090'],
  ['#bbd444', '#fcd744', '#fa7b53', '#423c6f'],
  ['#0d4a4e', '#ff947b', '#ead3a2', '#5284ab'],
  ['#363d4a', '#7b8a56', '#ff9369', '#f4c172'],
  ['#ec6c26', '#613a53', '#e8ac52', '#639aa0'],
  ['#d3693e', '#803528', '#f1b156', '#90a798'],
  ['#f46e26', '#68485f', '#3d273a', '#535d55'],
  ['#ea720e', '#ca5130', '#e9c25a', '#52534f'],
  ['#ce565e', '#8e1752', '#f8a100', '#3ac1a6'],
  ['#f5736a', '#925951', '#feba4c', '#9d9b9d'],
];

let seasons = {
  spring: {color: colorPalettes[0], sketch: 'spring'},
  summer: {color: colorPalettes[1], sketch: 'summer'},
  autumn: {color: colorPalettes[2], sketch: 'autumn'},
  winter: {color: colorPalettes[3], sketch: 'winter'},
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  let keys = Object.keys(seasons);
  season = seasons[keys[(keys.length * Math.random()) << 0]];
  currentPalette = season.color;
  textSize(200);
  fill(...season.color);
}

function draw() {
    let bgColor = currentPalette.splice(int(random(currentPalette.length)), 1)[0];
    background(bgColor);
    granulateChannels(25);
  
    // Change text fill color based on background color and alpha value
    fill(255 - red(bgColor), 255 - green(bgColor), 255 - blue(bgColor), alphaVal);
  
    switch (season.sketch) {
      case 'spring':
        translate(width / 2, height / 2);
        let rad = angle * 0.1; // For the spiral effect
        text("生", rad * cos(angle), rad * sin(angle));
        angle += 0.05;
        break;
      case 'summer':
        textAlign(CENTER, CENTER);
        let scaleFactor = map(sin(frameCount * 0.05), -1, 1, 0.5, 1.5); // Breath effect
        scale(scaleFactor);
        text("生", width / 2 / scaleFactor, height / 2 / scaleFactor);
        break;
      case 'autumn':
        leaves.forEach(leaf => {
          leaf.y += leaf.speed;
          text("生", leaf.x, leaf.y);
        });
  
        if (random() < 0.01) {
          leaves.push({x: random(width), y: 0, speed: random(1, 5)});
        }
        break;
      case 'winter':
        textAlign(CENTER, CENTER);
        let shake = map(noise(frameCount * 0.01), 0, 1, -5, 5); // Shivering effect
        text("生", width / 2 + shake, height / 2 + shake);
        break;
    }
  
    alphaVal += direction;
    if (alphaVal > 255) {
      alphaVal = 255;
      direction = 0;
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
