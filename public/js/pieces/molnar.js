// Re-Code of "A la Recherche de Paul Klee" (1970) by Vera Molnár
// See https://www.surfacemag.com/articles/vera-molnar-in-thinking-machines-at-moma/
// Uses https://github.com/zenozeng/p5.js-svg to export SVG.
//
// Some patterns worth noting:
// * "probability ladder"
// * noLoop()/loop() on a toggle

var bDoSvg = false;
function setup() {
  if (bDoSvg) {
    createCanvas(768, 768, SVG); // 8"x8" at 96 DPI.
  } else {
    createCanvas(768, 768);
  }
  noLoop(); // Just execute once!
}

//--------------------------------------------
function draw() {
  background(255);
  if (bDoSvg) clear(); // put back in for SVG
  strokeWeight(0.5);
  stroke(0);

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
        // Split the cell horizontally

        var cellRand = random(0, 1);
        if (cellRand < 0.45) {
          molnarRect(xL, yT, cellW2, cellW); // L only
        } else if (cellRand < 0.9) {
          molnarRect(xC, yT, cellW2, cellW); // R only
        } else if (cellRand < 0.99999) {
          molnarRect(xC, yT, cellW2, cellW); // Both
          molnarRect(xL, yT, cellW2, cellW);
        } else if (cellRand < 1.0) {
          // Neither
        }
      } else if (patternRand < 0.5) {
        // Split the cell vertically

        var cellRand = random(0, 1);
        if (cellRand < 0.45) {
          molnarRect(xL, yT, cellW, cellW2); // T only
        } else if (cellRand < 0.9) {
          molnarRect(xL, yC, cellW, cellW2); // B only
        } else if (cellRand < 0.99999) {
          molnarRect(xL, yT, cellW, cellW2); // Both
          molnarRect(xL, yC, cellW, cellW2);
        } else if (cellRand < 1.0) {
          // Neither
        }
      } else if (patternRand < 0.9) {
        // Ortho ("L") pattern

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

//--------------------------------------------
function molnarRectBogus(x, y, w, h) {
  noStroke();
  fill(0, 0, 0, 40);
  rect(x, y, w, h);
}

//--------------------------------------------
function molnarRect(x, y, w, h) {
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

//--------------------------------------------
function molnarTri(x, y, w, h) {
  stroke(0);

  var bDrawLower = random(0, 1) < 0.5;
  var nDiagonals = round(10 * pow(random(0, 1), 0.6));

  var x1 = x;
  var x2 = x + w;
  if (random(1.0) < 0.5) {
    x1 = x + w;
    x2 = x;
  }

  if (bDrawLower) {
    for (var i = 1; i <= nDiagonals; i++) {
      var px = map(i, 0, nDiagonals, x1, x2);
      var py = y + h;
      var qx = x1;
      var qy = map(i, 0, nDiagonals, y + h, y);
      line(px, py, qx, qy);
    }
  } else {
    for (var i = 1; i <= nDiagonals; i++) {
      var px = map(i, 0, nDiagonals, x2, x1);
      var py = y;
      var qx = x2;
      var qy = map(i, 0, nDiagonals, y, y + h);
      line(px, py, qx, qy);
    }
  }
}

//--------------------------------------------
function keyPressed() {
  if (key == "s") {
    if (bDoSvg) {
      saveSVG("gl_molnar_klee_recode_" + round(millis()) + ".svg");
    }
  }
}
function mousePressed() {
  loop();
}
