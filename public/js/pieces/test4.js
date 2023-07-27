// Defining the color palettes
const colorPalettes = [
    ['#E6B0AA', '#A9CCE3', '#ABEBC6', '#F9E79F', '#5D6D7E'],
    ['#1B4F72', '#641E16', '#154360', '#0B5345', '#186A3B'],
    ['#17202A', '#424949', '#196F3D', '#F1C40F', '#6C3483'],
    ['#78281F', '#2E86C1', '#28B463', '#F4D03F', '#7D3C98'],
    ['#A93226', '#3498DB', '#1E8449', '#F5B041', '#884EA0'],
];

let paletteIndex = 0;
let xoff = 0;
let yoff = 0;
let soff = 0; // size offset
let increment = 0.01;

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.size = random(1, 20);
  }
  
  update() {
    this.pos.add(this.vel);
    this.size = noise(this.pos.x * scl, this.pos.y * scl) * 20;
    if(this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if(this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
  }
  
  display() {
    let char = characters.charAt(floor(random(characters.length)));
    textSize(this.size);
    let color = colorPalettes[paletteIndex][floor(random(colorPalettes[paletteIndex].length))];
    fill(color);
    text(char.repeat(floor(random(20, 100))), this.pos.x, this.pos.y);
  }
}


const scl = 0.01;  // Scale of the noise field, smaller value means smoother field
const characters = "生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生"; // Vary the character that's being drawn

let objs = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  noLoop();
  for (let i = 0; i < 500; i++) { // create 100 objects
    objs.push(new Particle());
  }
}

function draw() {
  for (const o of objs) {
    o.update();
    o.display();
  }
  updatePixels();
    background(0);
    granulateChannels(80);
    // draw text chaotically
    for (let i = 0; i < random(99, 1000); i++) { // Vary the number of characters being drawn per frame
        push();
        // Create a flow field with Perlin noise
        let x = map(noise(xoff), 0, 1, 0, width);
        let y = map(noise(yoff), 0, 1, 0, height);
        translate(x, y);
        
        let v = p5.Vector.fromAngle(noise(x * scl, y * scl) * TWO_PI * 4);
        rotate(v.heading());
        
        textSize(map(noise(soff), 0, 1, 1, 20)); // Use different Perlin noise offsets for size
        let color = colorPalettes[paletteIndex][floor(random(colorPalettes[paletteIndex].length))];
        fill(color);
        let char = characters.charAt(floor(random(characters.length)));
        text(char.repeat(floor(random(20, 100))), 0, 0); // Vary the character that's being drawn
        pop();
        xoff += increment;
        yoff += increment;
        soff += increment;
    }

    // Change the color palette every 50 frames
    if(frameCount % 50 == 0){
        paletteIndex = (paletteIndex + 1) % colorPalettes.length;
    }
}

function granulateChannels(amount) {
    loadPixels();
    const d = pixelDensity();
    const pixelsCount = 4 * (width * d) * (height * d);
    for (let i = 0; i < pixelsCount; i += 4) {
        let randMod = random(1, 1.69)
        pixels[i] = pixels[i] + random(-amount * randMod, amount);
        pixels[i + 1] = pixels[i + 1] + random(-amount * randMod, amount);
        pixels[i + 2] = pixels[i + 2] + random(-amount * randMod, amount);
    }
    updatePixels();
}
