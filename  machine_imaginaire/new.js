// Define global variables for flow field, particles, and GUI controls
let flowField;
let particles = [];
let gui;

function setup() {
  createCanvas(3000, 3000);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);

  // Initialize flow field and particles
  flowField = new FlowField(69); // Smaller value = finer grid
  for (let i = 0; i < 1000; i++) { // Adjust for denser or sparser particle distribution
    particles.push(new Particle());
  }

  // Setup GUI for real-time interaction (pseudocode, assumes p5.gui or similar is available)
  setupGUI();
}

function draw() {
  // Optionally, uncomment to fade previous frames for motion blur effect
  // fill(0, 0, 0, 5);
  // rect(0, 0, width, height);

  flowField.update(); // Update the flow field each frame for dynamic movement
  particles.forEach(particle => {
    particle.follow(flowField); // Particles follow the flow field
    particle.update(); // Update particle position based on velocity
    particle.edges(); // Wrap particles at edges
    particle.display(); // Draw particle
  });
}

function setupGUI() {
  // Placeholder for GUI setup, allows real-time parameter adjustment
  // gui = createGui('Parameters');
  // gui.addGlobals('Parameter1', 'Parameter2'); // Example global parameters
}

// FlowField class generates and updates the flow vectors across the canvas
class FlowField {
  constructor(resolution) {
    this.resolution = resolution;
    this.cols = floor(width / this.resolution);
    this.rows = floor(height / this.resolution);
    this.field = new Array(this.cols * this.rows);
    this.zoff = 0; // For 3D noise evolution
  }

  // Update flow field vectors
  update() {
    let yoff = 0;
    for (let y = 0; y < this.rows; y++) {
      let xoff = 0;
      for (let x = 0; x < this.cols; x++) {
        let index = x + y * this.cols;
        let angle = noise(xoff, yoff, this.zoff) * TWO_PI * 4; // Adjust noise scale for variation
        let v = p5.Vector.fromAngle(angle);
        v.setMag(1); // Set magnitude of vectors for consistent force
        this.field[index] = v;
        xoff += 0.1; // Adjust noise offsets for smoother or sharper vector transitions
      }
      yoff += 0.1;
    }
    this.zoff += 0.01; // Adjust for faster or slower evolution of flow field
  }

  // Method to draw flow field vectors (for debugging)
  display() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let index = x + y * this.cols;
        let v = this.field[index];
        push();
        translate(x * this.resolution, y * this.resolution);
        rotate(v.heading());
        stroke(0, 50);
        line(0, 0, this.resolution - 2, 0);
        pop();
      }
    }
  }
}

// Particle class for individual particles following the flow field
class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4; // Control speed of particles
    this.h = random(360); // Initial hue for color evolution
  }

  // Apply force based on flow field vectors
  applyForce(force) {
    this.acc.add(force);
  }

  // Update particle's position and velocity
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.h += 0.6; // Slow color evolution; wrap hue around color wheel
    if (this.h > 360) this.h = 0;
  }

  // Display the particle with evolving color
  display() {
    stroke(this.h, 80, 100, 50); // Adjust stroke for different visual effects
    strokeWeight(2);
    point(this.pos.x, this.pos.y);
  }

  // Handle particles crossing the canvas boundaries
  edges() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  // Particles follow flow field
  follow(flowField) {
    let x = floor(this.pos.x / flowField.resolution);
    let y = floor(this.pos.y / flowField.resolution);
    let index = x + y * flowField.cols;
    let force = flowField.field[index];
    this.applyForce(force);
  }
}

// Optional: Add interactivity with mouse or keyboard events
function mousePressed() {
  // Example: Reset particles to mouse position
  particles.forEach(particle => {
    particle.pos = createVector(mouseX, mouseY);
  });
}
