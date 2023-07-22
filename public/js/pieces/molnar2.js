var colorPalettes;
var currentPalette;

colorPalettes = [
  ["#62b6de", "#2b67af", "#f589a3", "#007f5f", "#2b9348", "#55a630", "#80b918", "#aacc00", "#bfd200", "#d4d700", "#dddf00", "#eeef20", "#ffff3f", "#fffbe6", "#f5d216", "#0077e1", "#050505"]
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
    strokeWeight(0.5);
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
        if (random() < 0.05) {  // change this value to have more or less sand texture
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