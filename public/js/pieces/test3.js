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
let increment = 0.01;

const scl = 0.001;  // Scale of the noise field, smaller value means smoother field

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    noLoop();
}

function draw() {
    background(0);
    granulateChannels(50);
    // draw text chaotically
    for (let i = 0; i < 420; i++) {
        push();
        // Create a flow field with Perlin noise
        let x = map(noise(xoff), 0, 1, 0, width);
        let y = map(noise(yoff), 0, 1, 0, height);
        translate(x, y);
        
        let v = p5.Vector.fromAngle(noise(x * scl, y * scl) * TWO_PI * 4);
        rotate(v.heading());
        
        textSize(random(1, 10));
        let color = colorPalettes[paletteIndex][floor(random(colorPalettes[paletteIndex].length))];
        fill(color);
        text("生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生生", 0, 0);
        pop();
        xoff += increment;
        yoff += increment;
    }

    // Change the color palette every 500 frames
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
