let THE_SEED;
let border = 200;
let number_of_particles = 3000;
let number_of_particle_sets = 48; // Increased the number of particle sets for more variety
let particle_sets = [];

let palette;

function setup() {
  createCanvas(2000, 2000);
  THE_SEED = floor(random(9999999));
  randomSeed(THE_SEED);

  noFill();
  background('#e7e7db');
  stroke(20, 10);
  smooth();

  // Define a creative palette with vibrant colors
  palette = [color(255, 0, 0, 40), color(0, 255, 0, 40), color(0, 0, 255, 40)];

  for (var j = 0; j < number_of_particle_sets; j++) {
    let ps = [];
    for (var i = 0; i < number_of_particles; i++) {
      ps.push(
        new Particle(
          randomGaussian(width / 2, 110),
          randomGaussian(height / 2, 110),
          random(TWO_PI),
          j // Pass the index of the particle set to the Particle constructor
        )
      );
    }
    particle_sets.push(ps);
  }
}

function draw() {
  particle_sets.forEach(function(particles) {
    particles.forEach(function(particle) {
      particle.update();
      particle.display();
    });
  });
}

function keyPressed() {
  if (keyCode === 80) saveCanvas('sketch_' + THE_SEED, 'jpeg');
}

class Particle {
  constructor(x, y, phi, index) {
    this.pos = createVector(x, y);
    this.angle = phi;
    this.val = 0;
    this.particleSetIndex = index; // Store the index of the particle set
  }

  update() {
    this.pos.x += this.particleSetIndex/10.0 * cos(this.angle);
    this.pos.y += this.particleSetIndex/10.0 * sin(this.angle);
    
    let nx = 1.8 * map(this.pos.x, 0, width, -1, 1);
    let ny = 1.8 * map(this.pos.y, 0, height, -1, 1);

    let n = createVector(nx, ny);

    let nval = (noise(n.x + 42, n.y - 23) + 0.045 * (this.particleSetIndex - number_of_particle_sets / 2)) % 1;

    this.angle += 3 * map(nval, 0, 1, -1, 1);
    this.val = nval;
  }

  display() {
    if (this.val > 0.48 && this.val < 0.52) {
      // Use a random color from the palette for each particle set
      stroke(palette[this.particleSetIndex % palette.length]);
      strokeWeight(map(this.val, 0, 1, 0.05, 0.7)); // Reduced stroke weight
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.angle);
      ellipse(0, 0, this.val * 2, this.val * 2); // Reduced ellipse size
      pop();
    }
  }
}

new p5();
