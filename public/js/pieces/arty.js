// checking if line exists - less overlap

let rgtAng = 1.57;
let turn,
  ang,
  angDir,
  wid,
  hgt,
  rgt,
  lft,
  lineWeight,
  table,
  edgeBuff,
  lineLength,
  minlineWeight,
  maxlineWeight,
  lineWeightInc,
  frame,
  n3,
  scalePerc,
  windowRatio,
  imageRatio,
  newWid,
  newHgt,
  colNum,
  noiseAng,
  mainCanvas,
  seed,
  colStart,
  count,
  drawNumb,
  circleX,
  circleY,
  circleSize,
  lineOdds,
  skip,
  step,
  angVary;
let extraErase;
let taper = false;
let check = [];

function preload() {
  table = loadTable("colors.csv", "csv", "header");
}

function setup() {
  start = Date.now();
  seed = int(fxrand() * 9999999);
  restart();
}

function restart() {
  randomSeed(seed);
  noiseSeed(seed);
  noLoop();
  taper = false;
  circleX = 0;
  circleY = 0;
  circleSize = 0;
  check = [];
  startType = random(3);
  startAng = random(PI * 2);
  startAng2 = startAng + PI;
  if (startAng2 > PI * 2) {
    startAng2 -= PI * 2;
  }
  ang = startAng;
  angDir = 1;
  count = 0;
  turn = 0.2;
  extraErase = random(1.3);
  wid = 6000; //6000
  hgt = 4500; //4500
  imageRatio = wid / hgt;
  createCanvas(wid, hgt);
  palette = floor(random(31));
  cnv1 = createGraphics(wid, hgt);
  cnv1.rect(0, 0, wid, hgt);
  grainBuffer = createGraphics(wid, hgt, WEBGL);
  grainShader = grainBuffer.createShader(vert, frag);
  cnv2 = createGraphics(wid, hgt);
  cnv2.background(0); //leave 0 for framing
  cnv1.colorMode(HSB, 360, 120, 100, 255);
  getColor(floor(random(2)));
  cnv1.background(h, s, b);
  //strokeCap(SQUARE);
  lineLength = hgt * 0.013; //0.018
  lineOdds = random(3, 8); // when a new line starts - also determines length of lines - low is long line
  edgeBuff = hgt * 0.08;
  minlineWeight = hgt * 0.0005; // 0.001
  maxlineWeight = hgt * 0.005; // 0.009
  lineWeightInc = hgt * 0.0005; //0.0015
  frame = hgt * 0.03; //0.07
  angVary = random(0.1, 0.3);
  maxAlpha = random(1.5); //1-1.5 high alpha
  bgLine = random(50); //outline color
  addBgLine = random(3.5); //0-1 outline; 1-1.5 worms; 1.5-3.5 no outline
  paperTextureOn = random(2); // <1 on; >1 off
  //print(angVary);
  windowResized();
  step = 0;
}

function bigBlobs(numb, alph) {
  //big transparent circles based on noise
  cnv1.noStroke();
  //numb = 20;
  for (j = 0; j < numb; j++) {
    x = random(wid);
    y = random(hgt);
    getColor(floor(random(7)));
    cnv1.fill(h, s, b, alph);
    cnv1.push();
    cnv1.translate(x, y);
    cnv1.rotate(random(PI * 2));
    let r = (s2 = hgt * random(0.1, 0.3)); //0.005, 0.018
    cnv1.beginShape();
    for (i = 0; i < PI * 2; i += 0.3) {
      x = cos(i) * r;
      y = sin(i) * r;
      r += random(-r / 10, r / 10);
      if (i > PI * 1.5) {
        r = r + (s2 - r) / 3;
      } else if (i > PI * 1.75) {
        r = r + (s2 - r) / 7;
      }
      cnv1.curveVertex(x, y);
    }
    cnv1.endShape(CLOSE);
    cnv1.pop();
  }
}

function blankSpots1() {
  cnv2.rectMode(CENTER);
  cnv2.background(255);
  //extraErase = 0;
  if (extraErase < 1) {
    cnv2.background(0);
    cnv2.noStroke();
    eraseType = random(4.5);
    if (eraseType < 1.2) {
      // concentric circles
      // x = random(wid);
      // y = random(hgt);
      // cnv2.noFill();
      // cnv2.stroke(255);
      // circNumb = floor(random(3, 5));
      // circSize = hgt / (circNumb * 2);
      // circSpace = (hgt / circNumb) * 2;
      // cnv2.strokeWeight(circSize);
      // for (i = 0; i < circNumb + 2; i++) {
      //   cnv2.circle(x, y, i * circSpace);
      // }

      // black & white noise field
      rez = 0.00025;
      skip = wid * 0.01;
      cnv2.noStroke();
      for (x = 0; x < wid; x += skip) {
        for (y = 0; y < hgt; y += skip) {
          n = round(noise(x * rez, y * rez) * 10);
          if (n / 2 == round(n / 2)) {
            cnv2.fill(0);
          } else {
            cnv2.fill(255);
          }
          cnv2.circle(x, y, skip * 1.5);
        }
      }
    } else if (eraseType < 2) {
      // big stripes
      cnv2.fill(255);
      cnv2.noStroke();
      cnv2.push();
      cnv2.translate(wid / 2, hgt / 2);
      cnv2.rotate(random(PI * 2));
      rectNumb = floor(random(4, 7));
      rectSize = hgt / (rectNumb * 2);
      rectSpace = hgt / rectNumb;
      for (i = 0; i < rectNumb * 1.5; i++) {
        cnv2.rect(-hgt / 1.5 + i * rectSpace, -hgt * 0.5, rectSize, hgt * 2.5);
      }
      cnv2.pop();
    } else if (eraseType < 3) {
      // random biggish circles
      cnv2.fill(255);
      for (i = 0; i < 25; i++) {
        cnv2.ellipse(
          random(wid),
          random(hgt),
          wid * random(0.1, 0.3),
          wid * random(0.1, 0.3)
        );
      }
    } else if (eraseType < 3.5) {
      // center ellipse
      cnv2.fill(255);
      cnv2.ellipse(wid / 2, hgt / 2, wid - frame * 2, hgt - frame * 2);
    } else if (eraseType < 4.5) {
      //thirds circles
      x = wid * 0.33 * floor(random(1, 3));
      y = hgt * 0.33 * floor(random(1, 3));
      cnv2.circle(x, y, hgt * random(0.5, 0.8));
      if (x > wid * 0.5) {
        x2 = wid * 0.25;
      } else {
        x2 = wid * 0.75;
      }
      if (y > hgt * 0.5) {
        y2 = hgt * 0.25;
      } else {
        y2 = hgt * 0.75;
      }
      cnv2.circle(x2, y2, hgt * random(0.2, 0.4));
    } else {
      // //cross
      // x = wid * 0.33 * floor(random(1, 3));
      // y = hgt * 0.33 * floor(random(1, 3));
      // //cnv2.rectMode(CENTER);
      // cnv2.push();
      // cnv2.translate(x, y);
      // ang = random(PI * 2);
      // cnv2.rotate(ang);
      // cnv2.rect(0, 0, wid * 2, hgt * random(0.2, 0.4));
      // cnv2.pop();
      // cnv2.push();
      // cnv2.translate(wid - x, hgt - y);
      // cnv2.rotate(ang + PI * 0.5);
      // cnv2.rect(0, 0, wid * 2, hgt * random(0.2, 0.4));
      // cnv2.pop();
      //cnv2.rectMode(CORNER);
    }
    drawNumb *= 0.7; //reduce # of drawings needed since there will be gaps
  }
  // add frame
  cnv2.noFill();
  cnv2.stroke(0);
  cnv2.strokeWeight(frame * 2.0);
  cnv2.rect(wid / 2, hgt / 2, wid, hgt);
}

function makeDots(numb, sizeInc, alph) {
  if (addBgLine > 1.5) {
    cnv1.noStroke();
  } else {
    cnv1.stroke(bgLine);
    cnv1.strokeWeight(wid*0.0015);
  }
  for (j = 0; j < numb; j++) {
    getColor(floor(random(2, 7)));
    cnv1.fill(h, s, b + 0, alph);
    newXY();
    makeOneDot(sizeInc, alph);
  }
}

function makeOneDot(sizeInc, alph) {
  cnv1.push();
  cnv1.translate(x, y);
  cnv1.rotate(random(PI * 2));
  let r = (s2 = hgt * sizeInc * random(0.003, 0.011));
  cnv1.beginShape();
  for (k = 0; k < PI * 2; k += 0.3) {
    r += r * random(-0.25, 0.25);
    if (k > PI * 1.5) {
      r = r + (s2 - r) / 3;
    } else if (k > PI * 1.75) {
      r = r + (s2 - r) / 7;
    }
    x2 = cos(k) * r;
    y2 = sin(k) * r;
    cnv1.curveVertex(x2, y2);
  }
  cnv1.endShape(CLOSE);
  cnv1.pop();
}

function newXY() {
  cnt = 0;
  while (cnt < 40) {
    x = round(random(frame, wid - frame));
    y = round(random(frame, hgt - frame));
    check = cnv2.get(x, y);
    if (check[0] != 0 || random(7) < 1) {
      break;
    }
    cnt++;
  }
}

function makeLines(numb, lwMult, brtRed, alph) {
  cnv4 = createGraphics(wid, hgt);
  cnv4.colorMode(HSB, 360, 120, 100, 255);
  cnv5 = createGraphics(wid, hgt);
  cnv5.colorMode(HSB, 360, 120, 100, 255);
  colStart = 2;
  colNum = colStart;
  getColor(colNum);
  newLine();
  for (i = 0; i < numb; i++) {
    ang = ang + random(-angVary, angVary);
    if (random(100) < 3) {
      angDir *= -1; //reverse turning direction
    }
    x = lineLength * sin(ang) + x;
    y = lineLength * cos(ang) + y;
    edges();
    if (random(100) < lineOdds) {
      //newLine();
      taper = true;
    } else {
      if (taper == false) {
        lineWeight = lineWeight += random(-lineWeightInc, lineWeightInc);
      } else {
        //taper = true
        lineWeight -= lineWeightInc * 1.2;
        if (lineWeight <= minlineWeight) {
          newLine();
          continue;
        }
      }
      lineWeight = constrain(lineWeight, minlineWeight, maxlineWeight);
      cnv4.strokeWeight(lineWeight * lwMult);
      cnv4.stroke(
        h + random(-3, 3),
        s + random(-3, 3),
        b + random(-3, 3) - brtRed,
        255
      );
      if (random(30) < 29.0) {
        if (addBgLine < 1) {
          //line outline
          cnv5.strokeWeight(lineWeight * lwMult * 1.2);
          cnv5.stroke(0, 0, bgLine, 255);
          cnv5.line(prevX, prevY, x, y);
        } else if (addBgLine < 1.5) {
          //worms
          cnv4.strokeWeight(lineWeight * lwMult * 1.2);
          cnv4.stroke(0, 0, bgLine, 255);
          cnv4.line(prevX, prevY, x, y);
        }
        cnv4.strokeWeight(lineWeight * lwMult);
        cnv4.stroke(
          h + random(-3, 3),
          s + random(-3, 3),
          b + random(-3, 3) - brtRed,
          255
        );
        cnv4.line(prevX, prevY, x, y);
      } else {
        cnv1.noStroke();
        cnv1.fill(h, s, b, alph + 10);
        makeOneDot(0.7, alph + 10);
      }
      prevX = x;
      prevY = y;
    }
  }
  cnv1.tint(255, alph);
  cnv1.image(cnv5, 0, 0);
  cnv1.image(cnv4, 0, 0);
  cnv1.noTint();
}

function newLine() {
  taper = false;
  if (startType < 1) {
    // start ang one direction
    if (random(2) < 1) {
      ang = startAng;
    } else {
      ang = startAng2;
    }
  } else if (startType < 2) {
    // start ang cross
    startAng2 = random(4);
    if (startAng2 < 1) {
      ang = startAng + PI * 0.5;
    } else if (startAng2 < 2) {
      ang = startAng2 + PI * 0.5;
    } else if (startAng2 < 3) {
      ang = startAng;
    } else {
      ang = startAng2;
    }
  } else {
    //random start ang
    ang = random(PI * 2);
  }
  if (random(10) < 3) {
    colNum++; //pick a new color in sequence
    if (colNum > 6) {
      colNum = colStart; //2 to 4
    }
    getColor(colNum);
  }
  cnv4.stroke(h, s, b + 0);
  newXY();
  prevX = x;
  prevY = y;
  lineWeight = random(minlineWeight * 1.1, maxlineWeight * 0.4);
}

function edges() {
  front = cnv2.get(edgeBuff * sin(ang) + x, edgeBuff * cos(ang) + y);
  rgt = cnv2.get(
    round(edgeBuff * sin(ang + rgtAng) + x),
    round(edgeBuff * cos(ang + rgtAng) + y)
  );
  lft = cnv2.get(
    round(edgeBuff * sin(ang - rgtAng) + x),
    round(edgeBuff * cos(ang - rgtAng) + y)
  );
  here = cnv2.get(x, y);
  if (
    front[0] == 0 &&
    rgt[0] == 0 &&
    lft[0] == 0 &&
    random(20) < 19
    //|| (here[0] == 0 && random(3) < 1)
  ) {
    newLine();
  } else if (front[0] == 0 && random(20) < 19) {
    ang += turn;
  }
  if (random(150) < 1) {
    turn *= -1;
  }
}

function getColor(col1) {
  //specific color for lines
  h = int(table.get(palette, col1 * 3)) + random(-8, 8);
  s = int(table.get(palette, col1 * 3 + 1)) + random(-10, 10);
  b = int(table.get(palette, col1 * 3 + 2)) + random(-10, 10);
}

function paperTexture(textureNum, swMult, alph) {
  //based on color present
  cnv1.noFill();
  cnv1.colorMode(RGB);
  colVary = 5; //40
  cnv1.strokeWeight(minlineWeight * swMult);
  curveStep = hgt * 0.05;
  //getColor(floor(random(2,7)));
  for (i = 0; i < textureNum; i++) {
    x = random(wid);
    y = random(hgt);
    col = cnv1.get(x, y);
    cnv1.stroke(
      col[0] + random(-colVary, colVary),
      col[1] + random(-colVary, colVary),
      col[2] + random(-colVary, colVary),
      alph
    );
    // if (random(10)<1){
    // getColor(floor(random(2,7)));}
    // cnv1.stroke(h,s,b,alph);
    cnv1.push();
    cnv1.translate(x, y);
    cnv1.rotate(random(PI * 2));
    cnv1.curve(
      hgt * random(0.035, 0.14),
      0,
      0,
      hgt * random(-0.03, 0.03),
      0, //hgt * random(-0.03, 0.03),
      hgt * random(0.035, 0.07),
      curveStep, //random(0.035, 0.07),
      hgt * random(0.035, 0.14)
    );
    cnv1.pop();
  }
  //cnv1.colorMode(HSB, 360, 120, 100, 255);
}

function draw() {
  if (step == 0) {
    bigBlobs(30, 150); //number, alpha
    cnv1.background(0, 0, 0, 180);
    //cnv1.filter(BLUR,2);
    blankSpots1();
  }
  if (maxAlpha < 1) {
    //all lower alphas
    if (step == 1) {
      makeLines(2500, 10, 35, 120); //number, line wid, brightness reduction, alpha
    }
    if (step == 2) {
      makeDots(200, 1, 125); //number, size, alpha
    }
    if (step == 3) {
      cnv2.stroke(0);
      makeLines(4500, 3, 25, 200); //number, line wid, brightness reduction, alpha
    }
    if (step == 3) {
      makeDots(350, 0.4, 180);
    }
    if (step == 4) {
      bigBlobs(25, 10); //number, alpha
      applyGrain();
    }
    if (step == 5) {
      makeLines(6000, 1, 15, 235); //number, line wid, brightness reduction, alpha
    }
  } else {
    //maxAlpha > 1 - all high alpha
    if (step == 1) {
      makeLines(2500, 10, 35, 255); //number, line wid, brightness reduction, alpha
    }
    if (step == 2) {
      makeDots(200, 1, 255); //number, size, alpha
    }
    if (step == 3) {
      cnv2.stroke(0);
      makeLines(4500, 3, 25, 255); //number, line wid, brightness reduction, alpha
    }
    if (step == 3) {
      makeDots(350, 0.4, 255);
    }
    if (step == 4) {
      bigBlobs(25, 10); //number, alpha
      applyGrain();
    }
    if (step == 5) {
      makeLines(6000, 1, 15, 255); //number, line wid, brightness reduction, alpha
    }
  }
  if (step == 6) {
    makeDots(400, 0.3, 255);
  }
  if (step == 7 && paperTextureOn < 1) {
    paperTexture(7000, 2, 150); //number, size, alpha
    paperTexture(9000, 1, 170);
  }
  if (step == 8) {
    fxpreview();
    secs = round((Date.now() - start) / 10) / 100;
    print("seconds: " + secs);
    noLoop();
  }

  push();
  scale(scalePerc);
  image(cnv1, 0, 0);
  pop();

  if (step == 1 || step == 3 || step == 5) {
  } else {
    for (tt = 0; tt < 100000000; tt++) {}
  }
  step++;
}

function windowResized() {
  loop();
  checkRatio();
  resizeCanvas(newWid, newHgt);
}

function checkRatio() {
  windowRatio = windowWidth / windowHeight;
  if (windowRatio > imageRatio) {
    scalePerc = windowHeight / hgt;
    newWid = (windowHeight / hgt) * wid;
    newHgt = windowHeight;
  } else {
    scalePerc = windowWidth / wid;
    newWid = windowWidth;
    newHgt = (windowWidth / wid) * hgt;
  }
}

function keyTyped() {
  if (key === "s") {
    cnv1.save(seed + "-" + palette + ".png");
  }
}
