// Define the palettes with specific names, colors, and backgrounds
const palettes = [
    {
      name: 'frozen-rose',
      colors: ['#29368f', '#e9697b', '#1b164d', '#f7d996'],
      background: '#f2e8e4',
    },
    {
      name: 'winter-night',
      colors: ['#122438', '#dd672e', '#87c7ca', '#ebebeb'],
      background: '#ebebeb',
    },
    // Add more palettes if needed
  ];
  
  let sketch = function(p) {
    let width = 1000;
    let height = 1000;
    let offset = -100;
    let circular_shape = true;
  
    let flow_cell_size = 3;
    let number_of_layers = 1;
  
    let vertical_partitions = 1;
    let horizontal_partitions = 1;
  
    let vertical_shift = 200;
    let horizontal_shift = 400;
  
    let noise_size = 10;
    let noise_radius = 0.42;
  
    let flow_width = (width + offset * 2) / flow_cell_size;
    let flow_height = (height + offset * 2) / flow_cell_size;
  
    let flow_grid = [];
  
    let noise_offset_x, noise_offset_y;
    let usedColors = [];
  
    p.setup = function() {
      p.createCanvas(width, height);
      p.smooth();
      p.noLoop();
  
      p.stroke(255, 40);
      p.strokeWeight(1);
    };
    p.draw = function() {
      p.background('#222');
      p.translate(-offset, -offset);
  
      for (var i = 0; i < number_of_layers; i++) {
        noise_offset_x = p.random(10);
        noise_offset_y = p.random(10);
        init_flow();
        display_flow(i);
      }
  
      // Display unique colors used in the palette
      let x = 20;
      let y = height - 50;
      for (let i = 0; i < usedColors.length; i++) {
        p.fill(usedColors[i]);
        p.rect(x, y, 30, 30);
        x += 40;
      }
    };
  
    function init_flow() {
      flow_grid = [];
      for (let i = 0; i < flow_height; i++) {
        let row = [];
        for (let j = 0; j < flow_width; j++) {
          row.push(
            calculate_flow(
              (j + vertical_shift * p.floor((vertical_partitions * j) / flow_height)) *
                noise_size,
              (i + horizontal_shift * p.floor((horizontal_partitions * i) / flow_width)) *
                noise_size,
              noise_radius
            )
          );
        }
        flow_grid.push(row);
      }
    }
  
    function calculate_flow(x, y, r) {
      let mean_arrow = p.createVector(0, 0);
      let radial_samples = 3;
      for (var i = 0; i < radial_samples; i++) {
        let angle = p.random(p.PI);
        let pos1 = p.createVector(x + p.cos(angle) * r, y + p.sin(angle) * r);
        let pos2 = p.createVector(x + p.cos(angle + p.PI) * r, y + p.sin(angle + p.PI) * r);
  
        let val1 = p.noise(noise_offset_x + pos1.x, noise_offset_y + pos1.y);
        let val2 = p.noise(noise_offset_x + pos2.x, noise_offset_y + pos2.y);
  
        let hilo = p5.Vector.sub(pos1, pos2)
          .normalize()
          .mult(val1 - val2);
  
        mean_arrow.add(hilo);
      }
      mean_arrow.div(radial_samples);
      mean_arrow.rotate(p.PI / 2);
      return mean_arrow;
    }
  
    function display_flow(col) {
      let palette = p.random(palettes);
      usedColors = usedColors.concat(palette.colors.map(c => p.color(c))); // Convert color strings to p5.Color
  
      for (let i = 0; i < flow_grid.length; i++) {
        for (let j = 0; j < flow_grid[i].length; j++) {
          if (
            !circular_shape ||
            inside_radius(
              i - flow_grid.length / 2,
              j - flow_grid[i].length / 2,
              400 / flow_cell_size
            )
          ) {
            let x1 = j * flow_cell_size;
            let y1 = i * flow_cell_size;
            let x2 = j * flow_cell_size + flow_grid[i][j].x * flow_cell_size * 2500;
            let y2 = i * flow_cell_size + flow_grid[i][j].y * flow_cell_size * 2500;
  
            let shapeType = p.random(['line', 'ellipse', 'rect']);
            let color = p.random(palette.colors);
            let size = p.random(5, 15);
  
            p.stroke(color);
            p.fill(color);
  
            if (shapeType === 'line') {
              p.line(x1, y1, x2, y2);
            } else if (shapeType === 'ellipse') {
              p.ellipse(x1, y1, size, size);
            } else if (shapeType === 'rect') {
              p.rect(x1, y1, size, size);
            }
          }
        }
      }
    }
  
    function inside_radius(x, y, r) {
      return p.sqrt(p.pow(x, 2) + p.pow(y, 2)) < r;
    }
  
    p.keyPressed = function() {
      if (p.keyCode === 80) {
        p.saveCanvas('noise_grid', 'jpeg');
      }
    };
  };
  new p5(sketch);
  