
let xmod = 1
let ymod = 1.2

let s = 800
let PAD = 50

let boolGrid = []
let numPatches = nP = 3000
let patches = []

function setup() {
  createCanvas(s*xmod, s*ymod);
  makeGrid()
  console.log(boolGrid)
  makePatches()
  strokeCap(ROUND)
}

let spacingX = 35 * xmod
let spacingY = 35 * ymod

let xd = (s-PAD*2)/spacingX
let yd = (s-PAD*2)/spacingX

function makeGrid(){
  for(let x = 0; x < spacingX+1; x++){
    let row = []
    for(let y = 0; y < spacingY+1; y++){
      row.push(0)
    }
    boolGrid.push(row)
  }
}


function makePatches(){
  for(let n = 0; n < nP; n++){
    let randX = floor(random(spacingX))
    let randY = floor(random(spacingY))
    
    let w = floor(random(3,15))
    let h = floor(random(3,15))
    
    let p = new makePatch(
      randX, randY, w, h 
    )
    
    patches.push(p)
  }
}

function makePatch(x,y,wid,hei){
  this.x = x
  this.y = y
  
  this.wid = wid
  this.hei = hei
  
  this.style = random([1,2,3])
}

function draw() {
  background("#fffbe6");
  stroke(0);
  strokeWeight(5);
  
  for(let x = 0; x < spacingX+1; x++){
    for(let y = 0; y < spacingY+1; y++){
      point(PAD + x * xd, PAD + y * xd)
    }
  }
  
  for(let n = 0; n < nP; n++){
    let p = patches[n]
    
    for(let x = p.x; x < constrain(p.x+p.wid,0,spacingX); x+=1){
      for(let y = p.y; y < constrain(p.y+p.hei,0,spacingY); y+=1){
        
        let xm = PAD + x * xd
        let ym = PAD + y * xd
        if(boolGrid[x][y] == 0){
          if(p.style == 1){
            fill( "#fc3503")
            boolGrid[x][y] = 1
          }else if(p.style == 2){
            fill("#0077e1")
            boolGrid[x][y] = 2
          }else{
            fill("#f5d216")
            boolGrid[x][y] = 3
          }
          rect(xm,ym,xd,xd)
          
          
        }
      }
    }
  }
  
  noLoop()
}