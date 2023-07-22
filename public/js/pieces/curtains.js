let COOLORS = ["#a7c6da", "#eefcce", "#9eb25d", "#f1db4b", "#edff71", "#484538"];

const speedx1 = 0.01;
const speedx2 = 0.002;
const speedy1 = 1.2;
const speedy2 = 1;

let curtain = [];
let nojzx, nojzy;

function setup() {
  createCanvas(800, 800);
  for (let i = 0; i < 7; i++) {
    curtain[i] = new Wave(-random(0, 80), i * random(75, 90), i % COOLORS.length);
  }
}

function draw() {
  background(255);
  translate(0, height);
  scale(-1, 1);
  rotate(PI);
  for (let i = 0; i < 7; i++) {
    curtain[i].move();
    curtain[i].display();
  }
}

class Wave {
  constructor(posx, posy, c) {
    this.posx = posx;
    this.posy = posy;
    this.col = c;
    this.edge = [];
    this.orig_edge = [];
    this.b = 0;
    this.ty1 = 0.0 + posx;
    this.tx2 = 20.0 + posy;
    this.ty2 = 100.0 + posx;
    this.tx1 = 0.0 + posy;

    this.edge.push(createVector(-65 + posx, 30 + posy));
    for (let i = 0; i <= 8 * TWO_PI; i += QUARTER_PI) {
      if (this.b % 2 == 1) {
        this.edge.push(createVector(i * 30 - cos(i) * 65 + posx, cos(i) * 15 + posy + i * 8));
      }
      this.b++;
    }

    this.edge.push(createVector(2 * width + posx, 2 * height));
    this.edge.push(createVector(2 * width + posx, 2 * height));
    this.edge.push(createVector(0 + posx, 2 * height));
    this.edge.push(createVector(0 + posx, 2 * height));
    this.edge.push(createVector(-65 + posx, 30 + posy));

    for (let e = 0; e < this.edge.length; e++) {
      this.orig_edge[e] = this.edge[e].copy();
    }
  }

  display() {
    for (let c = 3; c < this.edge.length - 2; c += 4) {
      noStroke();
      for (let d = 0; d < 10; d++) {
        let x = curvePoint(this.edge[c - 1].x, this.edge[c].x, this.edge[c + 1].x, this.edge[c + 2].x, d / 10);
        let y = curvePoint(this.edge[c - 1].y, this.edge[c].y, this.edge[c + 1].y, this.edge[c + 2].y, d / 10);
        fill(0);
        if (this.edge[c + 1].x - this.edge[c].x < 0) {
          rect(x, y, (this.edge[c + 1].x - this.edge[c].x) / 3, height);
        }
      }
      stroke(0);
      line(this.edge[c].x + 0.5, this.edge[c].y, this.edge[c].x + 0.5, 2 * height);
    }
    fill(COOLORS[this.col]);
    beginShape();
    for (let c = 0; c < this.edge.length; c++) {
      curveVertex(this.edge[c].x, this.edge[c].y);
    }
    endShape(CLOSE);

    for (let c = 4; c < this.edge.length; c += 4) {
      line(this.edge[c].x, this.edge[c].y, this.edge[c].x, 2 * height);
    }
  }

  move() {
    this.ty1 = 0.0;
    this.ty2 = 100.0;
    for (let c = 1; c < this.edge.length - 2; c += 2) {
      nojzx = map(noise(this.tx1, this.ty1), 0, 1, -50, 50);
      nojzy = map(noise(this.tx2, this.ty2), 0, 1, -30, 30);

      this.edge[c - 1].x = this.orig_edge[c - 1].x + nojzx;
      this.edge[c].x = this.orig_edge[c].x + nojzx;
      this.edge[c - 1].y = this.orig_edge[c - 1].y + nojzy;
      this.edge[c].y = this.orig_edge[c].y + nojzy;
      this.ty1 += speedy1;
      this.ty2 += speedy2;
    }
    this.tx1 += speedx1;
    this.tx2 += speedx2;
  }
}
