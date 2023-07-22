palette = []
palette = ["#62b6de", "#2b67af", "#f589a3", "#007f5f", "#2b9348", "#55a630", "#80b918", "#aacc00", "#bfd200", "#d4d700", "#dddf00", "#eeef20", "#ffff3f", "#fffbe6", "#f5d216", "#0077e1", "#050505"]
  
//palette = ["#62b6de", "#2b67af", "#f589a3"]
//palette = ["#050505"]
lit = ['0', '1', '2', '3', '4'] // , '5', '6', '7',  '8', '9'

function setup() {
  createCanvas(600, 600);
  pixelDensity(2)
  //blendMode(HARD_LIGHT)
}

function draw() {
  background(
    palette.splice( int(random(palette.length)), 1 )[0]
  );

  
  R = 100
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
  noLoop()
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

