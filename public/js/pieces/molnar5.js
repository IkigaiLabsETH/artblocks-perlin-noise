let palette = ["#62b6de", "#2b67af", "#f589a3", "#007f5f", "#2b9348", "#55a630", "#80b918", "#aacc00", "#bfd200", "#d4d700", "#dddf00", "#eeef20", "#ffff3f", "#fffbe6", "#f5d216", "#0077e1", "#050505"];
let lit = ['0', '1', '2', '3', '4']; 
let R = 100;

function setup() {
  createCanvas(600, 600);
  pixelDensity(2);
}

function drawBackground() {
  background(
    palette.splice( int(random(palette.length)), 1 )[0]
  );

  translate(0, 180)
  for(let n = 0; n < 50; n++){
    let col = random(palette)
    stroke(col + random(lit) + random(lit))
    for(let a = 0; a < TAU*3; a+=0.005){
      
      let d = dist(a,0,TAU*3/2,0)
      let rat = map(d, 0, TAU*3/2, 1, 0)
      
      let displace = map(a, 0, TAU, -R/2, R/2) + map(n,0,50,0,20) * rat

      let x = 200 + (R + R/3 * sin(a/2) + R/5 * cos(a/2)) * cos(a)
      let y = 200 + (R/2 + R/10 * cos(a/2)) * sin(a)

      let noi = noise(x * 0.01, y * 0.01)
  
      
      strokeWeight(3 * noi)

      point(x + displace + random(-1.5,1.5), y - displace + random(-1.5,1.5))
    }
  }
  
  translate(30, 0)
  for(let n = 0; n < 5; n++){
    let col = "#050505"
    col = "#fffbe6"
    stroke(col + random(lit) + random(lit))
    for(let a = 0; a < TAU*3; a+=0.005){
      
      let d = dist(a,0,TAU*3/2,0)
      let rat = map(d, 0, TAU*3/2, 1, 0)
      
      let displace = map(a, 0, TAU, -R/2, R/2) + map(n,0,5,0,3) * rat

      let x = 200 + (R + R/3 * sin(a/2) + R/5 * cos(a/2)) * cos(a)
      let y = 200 + (R/2 + R/10 * cos(a/2)) * sin(a)

      let noi = noise(x * 0.01, y * 0.01)
  
      
      strokeWeight(3 * noi * rat)

      point(x + displace + random(-1.5,1.5), y - displace + random(-1.5,1.5))
    }
  }

  granulateChannels(25)
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

var bDoSvg = false;
function setup() {
  if (bDoSvg) {
    createCanvas(768, 768, SVG);
  } else {
    createCanvas(768, 768);
  }
  noLoop();
}

function draw() {
  drawBackground();
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