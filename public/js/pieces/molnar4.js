var colorPalettes;
var currentPalette;

colorPalettes = [
['#000000', '#d55a3a', '#2a5c8a', '#7e7d14', '#dbdac9'],
['#dbdac9', '#d55a3a', '#2a5c8a', '#b47b8c', '#7e7d14'],
['#dbdac9', '#d55a3a', '#2a5c8a'],
['#dbdac9', '#d55a3a', '#7e7d14'],
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
currentPalette = colorPalettes[0];  // start with first palette

function setup() {
  createCanvas(768, 768);
  noLoop();
}

function draw() {
  background(
    currentPalette.splice(int(random(currentPalette.length)), 1)[0]);
  
    createSandTexture();
    strokeWeight(0.420);
    var nCellCols = 17;
    var nCellRows = nCellCols;
    var cellW = width / nCellCols;
    var cellW2 = cellW / 2;
  
    for (var j = 0; j < nCellRows; j++) {
      for (var i = 0; i < nCellCols; i++) {
        var xL = i * cellW;
        var yT = j * cellW;
        var xC = xL + cellW / 2;
        var yC = yT + cellW / 2;
        var xR = xL + cellW;
        var yB = yT + cellW;
  
        var patternRand = random(0, 1);
        if (patternRand < 0.25) {
          var cellRand = random(0, 1);
          if (cellRand < 0.45) {
            molnarRect(xL, yT, cellW2, cellW); // L only
          } else if (cellRand < 0.9) {
            molnarRect(xC, yT, cellW2, cellW); // R only
          } else if (cellRand < 0.99999) {
            molnarRect(xC, yT, cellW2, cellW); // Both
            molnarRect(xL, yT, cellW2, cellW);
          } 
        } else if (patternRand < 0.5) {
          var cellRand = random(0, 1);
          if (cellRand < 0.45) {
            molnarRect(xL, yT, cellW, cellW2); // T only
          } else if (cellRand < 0.9) {
            molnarRect(xL, yC, cellW, cellW2); // B only
          } else if (cellRand < 0.99999) {
            molnarRect(xL, yT, cellW, cellW2); // Both
            molnarRect(xL, yC, cellW, cellW2);
          } 
        } else if (patternRand < 0.9) {
          if (random(0, 1) < 0.5) {
            molnarRect(xL, yT, cellW, cellW2); // T
          } else {
            molnarRect(xL, yC, cellW, cellW2); // B
          }
  
          if (random(0, 1) < 0.5) {
            molnarRect(xL, yT, cellW2, cellW); // L
          } else {
            molnarRect(xC, yT, cellW2, cellW); // R
          }
        } else {
          molnarTri(xL, yT, cellW, cellW);
          var r = random(0, 1);
          if (r < 0.1) {
            molnarRect(xL, yT, cellW, cellW2); // T
          } else if (r < 0.2) {
            molnarRect(xL, yC, cellW, cellW2); // B
          } else if (r < 0.3) {
            molnarRect(xL, yT, cellW2, cellW); // L
          } else if (r < 0.4) {
            molnarRect(xC, yT, cellW2, cellW); // R
          }
        }
      }
    }
  
    noLoop();
  }
  
  function createSandTexture() {
    background(245, 222, 179);  // wheat color for sand
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        if (random() < 5) {  // change this value to have more or less sand texture
          stroke(random(150, 200), random(100, 150), 0); // vary color to simulate sand
          point(i, j);
        }
      }
    }
  }
  
  function molnarRect(x, y, w, h) {
    stroke(currentPalette[floor(random(currentPalette.length))]);
  
    var x1 = x;
    var x2 = x + w;
    if (random(1.0) < 0.5) {
      x1 = x + w;
      x2 = x;
    }
  
    var nDiagonals = round(10 * pow(random(0, 1), 1));
    var bDrawLower = random(0, 1) < 0.96;
    if (bDrawLower) {
      for (var i = 1; i <= nDiagonals; i++) {
        var px = map(i, 0, nDiagonals, x1, x2);
        var py = y + h;
        var qx = x1;
        var qy = map(i, 0, nDiagonals, y + h, y);
        line(px, py, qx, qy);
      }
    }
    var bDrawUpper = random(0, 1) < 0.96;
    if (!bDrawLower || bDrawUpper) {
      for (var i = 1; i <= nDiagonals; i++) {
        var px = map(i, 0, nDiagonals, x2, x1);
        var py = y;
        var qx = x2;
        var qy = map(i, 0, nDiagonals, y, y + h);
        line(px, py, qx, qy);
      }
    }
  }
  
  function molnarTri(x, y, w, h) {
    stroke(currentPalette[floor(random(currentPalette.length))]);
  
    var h2 = h / 2;
    var nDiagonals = round(10 * pow(random(0, 1), 1));
    for (var i = 1; i <= nDiagonals; i++) {
      var px = map(i, 0, nDiagonals, x, x + w);
      var py = y + h;
      var qx = x;
      var qy = map(i, 0, nDiagonals, y + h, y + h2);
      line(px, py, qx, qy);
    }
  }