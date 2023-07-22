let onoise;

function setup() {
  createCanvas(600, 600, WEBGL);
  const hw = width * 0.5;
  onoise = new OpenSimplexNoise();
  ortho(-hw, hw, hw, -hw, -1500, 1500);
}

let zoff = 0;

function draw() {
  background(0);
  ambientLight(100, 100, 150);
  pointLight(100, 0, 25, 0, 0, 500);
  specularMaterial(255);

  background(10,10,50);
  //specularMaterial(5,0,0);
  const r = 20;
  const d = r / sqrt(2);
  const cols = floor(width/r)+1;
  const rows = floor(height/r)+6;
  let xoff = 0;
  const inc = 0.2;
  //blendMode(ADD);
  //randomSeed(1);
  for (let i = 0; i < cols; i++) {
    let yoff = 0;
    for (let j = 0; j < rows; j++) {
      push();
      const x = -0.5 * (cols -0.5) * r + i * r + (j%2) * r * 0.5;
      const h = (d + r) * 0.5;
      const y = 0.5 * (rows - 1) * h - j * h;
      translate(x, y);
      rotateX(PI / 4);
      rotateY(PI / 4);
      let val = sin(zoff)*PI/2;
      rotateX(val * (i%2));
      rotateY(val * (j%2));
      noStroke();
      const index = i + j * cols;
      const c1 = color(45, 197, 244);
      const c2 = color(240, 99, 164);
      let amt = cos(zoff);
      amt = (amt + 1) * 0.5;
      let c = lerpColor(c1,c2,amt);
      fill(127+127*onoise.noise3D(xoff,yoff,zoff),255);
      let rr = constrain(r+onoise.noise3D(xoff,yoff,zoff)*r,0,d);
      box(rr);
      pop();
      yoff += inc;
    }
    xoff += inc;
  }
  zoff +=0.01;
  //noLoop();
}
