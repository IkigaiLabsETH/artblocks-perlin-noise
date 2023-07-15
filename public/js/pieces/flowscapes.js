let sketch = function(p) {
  let THE_SEED;
  let number_of_particles = 3500;
  let number_of_particle_sets = 12;
  let particle_sets = [];
  let tick = 0;

  let palettes = [
    [
      p.color(49, 59, 72),
      p.color(141, 139, 136),
      p.color(155, 150, 146),
      p.color(35, 21, 38),
      p.color(38, 47, 91),
      p.color(60, 82, 157),
      p.color(91, 115, 201)
    ],
    // Add more color palettes here
  ];

  let palette;

  p.setup = function() {
    p.createCanvas(1200, 1200);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);
    p.background('#738BE0');

    palette = palettes[p.floor(p.random(palettes.length))];

    for (let j = 0; j < number_of_particle_sets; j++) {
      let ps = [];
      let col = palette[p.floor(p.random(palette.length))];
      for (let i = 0; i < number_of_particles; i++) {
        ps.push(new Particle(p.randomGaussian(p.width / 2, 150), p.randomGaussian(p.height / 2, 150), p.random(p.TAU), col));
      }
      particle_sets.push(ps);
    }
  };

  p.draw = function() {
    particle_sets.forEach((particles, index) => {
      particles.forEach((particle) => {
        particle.update(index);
        particle.display(index);
      });
    });
  };

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpeg');
  };

  class Particle {
    constructor(x, y, phi, col) {
      this.pos = p.createVector(x, y);
      this.altitude = 0;
      this.val = 0;
      this.angle = phi;
      this.col = col;
    }

    update(index) {
      this.pos.x += p.cos(this.angle);
      this.pos.y += p.sin(this.angle);

      let nx = 1.1 * p.map(this.pos.y, 0, p.height, 4, 0.2) * p.map(this.pos.x, 0, p.width, -1, 1);
      let ny = 3.1 * p.map(this.pos.y, 0, p.height, 4, 0.2) * p.map(this.pos.y, 0, p.height, -1, 1);

      this.altitude = p.noise(nx + 423.2, ny - 231.1);
      this.val = (this.altitude + 0.035 * (index - number_of_particle_sets / 2)) % 1;
      this.angle += 3 * p.map(this.val, 0, 1, -1, 1);
    }

    display(index) {
      if (this.val > 0.485 && this.val < 0.515) {
        p.stroke(this.col);
        p.push();
        p.translate(this.pos.x, this.pos.y + 100 - this.altitude * 100 * p.map(this.pos.y, 0, p.height, 0.2, 4));
        p.rotate(this.angle);
        p.point(0, 0);
        p.pop();
      }
    }
  }
};

new p5(sketch);
