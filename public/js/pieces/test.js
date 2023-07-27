// Defining the color palettes
const colorPalettes = [
    ['#E6B0AA', '#A9CCE3', '#ABEBC6', '#F9E79F', '#5D6D7E'],
    ['#1B4F72', '#641E16', '#154360', '#0B5345', '#186A3B'],
    ['#17202A', '#424949', '#196F3D', '#F1C40F', '#6C3483'],
    ['#78281F', '#2E86C1', '#28B463', '#F4D03F', '#7D3C98'],
    ['#A93226', '#3498DB', '#1E8449', '#F5B041', '#884EA0'],
  ];
  
  // Generate a tokenData object
  let tokenData = {
    "hash": "0xe1b04f6d6576ad4d3fa11114bf84adeb0244e7b3e2572df1201ff4c6366d2e8a",
    "tokenId": "13000095"
  }
  
  // Generate a seed based on the token data
  function genSeed(tokenData) {
    return parseInt(tokenData.hash.slice(0, 16), 16);
  }
  
  // Generate a pseudorandom number based on a seed
  function rnd(seed) {
    seed ^= seed << 13;
    seed ^= seed >> 17;
    seed ^= seed << 5;
    return ((seed < 0 ? 1 + ~seed : seed) % 1000) / 1000;
  }
  
  // Create a grid of points, and then distort the grid using a sine wave
  function generatePoints(tokenData) {
    let seed = genSeed(tokenData);
    let points = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        let x = i * 0.1;
        let y = j * 0.1;
        // Apply a sine wave distortion
        y += Math.sin(x * Math.PI * 2 * 5 + seed) * 0.1;
        points.push({ x, y });
      }
    }
    return points;
  }
  
  // Generate a color palette for the artwork based on the token data
  function generatePalette(tokenData) {
    let seed = genSeed(tokenData);
    let paletteIndex = Math.floor(rnd(seed) * colorPalettes.length);
    return colorPalettes[paletteIndex];
  }
  
  // Create the artwork based on the points and color palette
  function createArtwork(points, palette) {
    // Start by setting the background color
    background(palette[0]);
  
    // Draw each point as a circle, using a color from the palette
    for (let i = 0; i < points.length; i++) {
      let point = points[i];
      let colorIndex = i % (palette.length - 1) + 1;
      fill(palette[colorIndex]);
      ellipse(point.x * width, point.y * height, 10, 10);
    }
  }
  
  function setup() {
    createCanvas(500, 500);
    noLoop();
  }
  
  function draw() {
    let points = generatePoints(tokenData);
    let palette = generatePalette(tokenData);
    createArtwork(points, palette);
  }
  