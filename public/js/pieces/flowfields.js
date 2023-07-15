const colors = ['#29A691', '#DB4F54', '#3B2B20', '#FCD265','#B8D9CE']
const choose = (arr) => arr[Math.floor(random(arr.length))]

scl = 1
noiseScale = 9999
space = [4,2]
thickness = [1,1]
maxSegments = 1

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES)
  strokeCap(PROJECT);
  noFill()
  noLoop()
}

function draw() {
  background('#EBE4D8');
  
  for (let y=-height;y<height*2;y+=random(space[0]*scl,space[1]*scl)){
    for (let x=-width;x<width*2;x+=random(space[0]*scl,space[1]*scl)){  
      let v = createVector(x,y)
      let lastV = v.copy()
      const segments = random(maxSegments)
      const sw = round(random(thickness[0]*scl,thickness[1]*scl))
      strokeWeight(sw)
      for (let seg=0;seg<segments;seg++){
        stroke(choose(colors))
        beginShape()
        curveVertex(v.x,v.y)
        for (let i=0;i<random(2,5);i++){
          const d = 360*noise(v.x/(noiseScale*scl),v.y/(noiseScale*scl))
          const dir = p5.Vector.fromAngle(d).setMag(3*scl)
          lastV = v.copy()
          v.x += dir.x
          v.y += dir.y
          if (v.x > width-50 || v.x < 50 || v.y > height-50 || v.y < 50) break
          curveVertex(v.x,v.y)
        }
        curveVertex(v.x,v.y)
        endShape()
        v = lastV.copy()
      }
  
    }
  }
  strokeWeight(50)
  rect(0,0,width,height)
}