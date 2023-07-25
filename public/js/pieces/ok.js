let angle = 0;
let w = 24;
let ma;
let maxD;
let seasonColorPalettes;
let currentPalette;

function setup() {
  createCanvas(3000, 2000, WEBGL);
  ma = atan(cos(QUARTER_PI));
  maxD = dist(0, 0, 200, 200);
  noLoop (0);
  
  seasonColorPalettes = [
    ['#FFB7B2', '#FF7171', '#D70022', '#820000'], // Winter colors
    ['#FFB347', '#FF8000', '#CC5500', '#7F2B00'], // Spring colors
    ['#FF6961', '#FF5C5C', '#D94600', '#802B00'], // Summer colors
    ['#FDFD96', '#FDFD00', '#BFBF00', '#7F7F00']  // Fall colors
  ];
  currentPalette = getSeasonColorPalette();
  textFont('Helvetica');
  textSize(18);
}

function draw() {
  background(50, 50, 50); // Near black background
  ortho(-400, 400, 400, -400, 0, 1000);
  rotateX(-QUARTER_PI);
  rotateY(ma);

  for (let z = 0; z < height; z += w) {
    for (let x = 0; x < width; x += w) {
      push();
      let d = dist(x, z, width / 2, height / 2);
      let offset = map(d, 0, maxD, -PI, PI);
      let a = angle + offset;
      let h = floor(map(sin(a), -1, 1, 100, 300));
      translate(x - width / 2, 0, z - height / 2);
      
      // Cycle through color palette based on the height of the box
      fill(currentPalette[h % currentPalette.length]);
      box(w - 2, h, w - 2);
      fill(255); // Make the text color white
      text('生', x - width / 2, h / 2, z - height / 2);  // Add the "生" character at the box location
      pop();
    }
  }

  angle -= 0.07;
  currentPalette = getSeasonColorPalette(); // Update the color palette
}

function getSeasonColorPalette() {
  // Here we simply cycle through the palettes every 15 seconds for simplicity
  // In a real implementation, you would want to determine the current season based on the actual date
  const index = floor((millis() / 5000) % 4);
  return seasonColorPalettes[index];
}

function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
}
