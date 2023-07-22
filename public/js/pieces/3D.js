const MAX = 69;

const COLORS = [
  "##27447B",
  "#599098",
  "#E9C250",
  "#D06435",
  "#9AB9ED",
  "#E5C477",
  "#576C91",
  "#6A869C",
  "#898C73",
  "#E9B64B",
];

// --------------------
// Object
// --------------------

class MyAbstract {
  constructor(x, y, z, props) {
    this.srcpos = createVector(x, y, z);
    this.pos = this.srcpos.copy();
    this.props = props;

    this.t = 0;
    this.direction = random() < 0.5 ? 1 : -1;
    this.mode = random([0, 1, 2]);

    this.init();
  }

  init() {}

  get dead() {
    return false; // this.t > 1000
  }

  update() {
    this.t++;
  }

  display() {}
}

class MyObject extends MyAbstract {
  update() {
    this.t += random() * 10;
    switch (this.mode) {
      case 0:
        this.pos.x =
          this.srcpos.x + this.direction * tan(this.t++ * 0.001) * 100;
        break;
      case 1:
        this.pos.y =
          this.srcpos.y + this.direction * tan(this.t++ * 0.001) * 100;
        break;
      case 2:
        this.pos.z =
          this.srcpos.z + this.direction * tan(this.t++ * 0.001) * 100;
        break;
    }
  }

  display() {
    push();

    translate(this.pos.x, this.pos.y, this.pos.z);
    rotateX(
      this.direction * noise(this.srcpos.x * this.srcpos.y) * this.t * 0.01
    );

    // stroke(this.props.color);
    noStroke();
    fill(this.props.color);

    switch (this.mode) {
      case 0:
        cylinder(this.props.size / 2, this.props.size, 8, 1);
        break;
      case 1:
        torus(this.props.size / 3, this.props.size / 3, 3, 8);
        break;
      case 2:
        box(this.props.size);
        break;
    }

    pop();
  }
}

// --------------------
// main
// --------------------

let objs = [];
let lightPos;
let lightPosZ = 300;
let timer;

let layer;
let blur;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  initialize();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, WEBGL);
  initialize();
}

function initialize() {
  layer = createFramebuffer();
  blur = createShader(vert, frag);

  lightPos = createVector(0, 0, lightPosZ);
  // noCursor();

  camera(0, 0, height / 1.25 / tan(PI / 6), 0, 0, 0, 0, 1, 0);

  objs = [];

  const step = MAX;
  for (let y = -height / 2; y < height / 2 + step; y += step) {
    for (let x = -width / 2; x < width / 2 + step; x += step) {
      addObject(x, y);
    }
  }
}

function addObject(x = undefined, y = undefined) {
  // if (objs.length > MAX) return;

  if (x == undefined) {
    x = random(width);
    y = random(height);
  }

  objs.push(
    new MyObject(x, y, 0, {
      size: MAX,
      color: color(random(COLORS)),
    })
  );
}

function draw() {
  layer.begin();

  background(0);
  orbitControl(1, 1, 0.11);

  // --------------------
  // light

  ambientLight(0);

  let locX = mouseX - width / 2;
  let locY = mouseY - height / 2;
  lightPos = lightPos.lerp(createVector(locX, locY, lightPosZ), 0.1);
  pointLight(255, 255, 255, lightPos);

  specularMaterial(64);
  shininess(10);

  // --------------------
  // light
  for (const obj of objs) {
    obj.update();
  }

  for (const obj of objs) {
    obj.display();
  }

  objs = objs.filter((obj) => !obj.dead);

  layer.end();

  shader(blur);
  blur.setUniform("img", layer.color);
  blur.setUniform("depth", layer.depth);
  rect(0, 0, width, height);
}

let vert = `
precision highp float;
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;
void main() {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  positionVec4.y *= -1.0;
  gl_Position = positionVec4;
  vTexCoord = aTexCoord;
}`;

let frag = `
precision highp float;
varying vec2 vTexCoord;
uniform sampler2D img;
uniform sampler2D depth;
float getBlurriness(float d) {
  // depth=0.9 
  return abs(d - 0.9) * 40.;
}
float maxBlurDistance(float blurriness) {
  return blurriness * 0.01;
}
void main() {
  vec4 color = texture2D(img, vTexCoord);
  float samples = 1.;
  float centerDepth = texture2D(depth, vTexCoord).r;
  float blurriness = getBlurriness(centerDepth);
  for (int sample = 0; sample < 20; sample++) {

    float angle = float(sample);
    float distance = float(sample)/20.
      * maxBlurDistance(blurriness);
    vec2 offset = vec2(cos(angle), sin(angle)) * distance;

    float sampleDepth = texture2D(depth, vTexCoord + offset).r;

    float sampleBlurDistance =
      maxBlurDistance(getBlurriness(sampleDepth));

    if (
      sampleDepth >= centerDepth ||
      sampleBlurDistance >= distance
    ) {
      color += texture2D(img, vTexCoord + offset);
      samples++;
    }
  }
  color /= samples;
  gl_FragColor = color;
}`;
