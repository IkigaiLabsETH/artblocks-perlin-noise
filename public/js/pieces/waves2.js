let palettes = [
    ["#1A090D", "#431C5D", "#900C3F", "#FF5733"], // Fidenza Style
    ["#1B998B", "#ED217C", "#2D3047", "#FFFD82"], // Different palette
    ["#08415C", "#CC2936", "#F26B5B", "#F4D35E"], // Yet another palette
    // add as many palettes as you like...
  ];
  
  let paletteIndex = 0;
  
  function setup() {
    createCanvas(1000, 1000); 
    background(220); 
  
    horizonLinePosition = 0.42;
    horizonLineThickness = 10; 
    horizonLineOpacity = 15;
    waveCount = 17; 
  
    // Choose colors from palette
    skyColorTop = color(palettes[paletteIndex][0]);
    skyColorBottom = color(palettes[paletteIndex][1]);
    oceanColorTop = color(palettes[paletteIndex][2]);
    oceanColorBottom = color(palettes[paletteIndex][3]);
  
    drawSky();
    drawOcean();
    drawWaves(waveCount);
    drawRipples()
    drawHorizon();  
    addWhiteHaze()
  }


  function mouseClicked() {
    // Go to the next palette on mouse click
    paletteIndex = (paletteIndex + 1) % palettes.length;
    
    // Redraw with new palette
    skyColorTop = color(palettes[paletteIndex][0]);
    skyColorBottom = color(palettes[paletteIndex][1]);
    oceanColorTop = color(palettes[paletteIndex][2]);
    oceanColorBottom = color(palettes[paletteIndex][3]);
    
    drawSky();
    drawOcean();
    drawWaves(waveCount);
    drawRipples()
    drawHorizon();  
    addWhiteHaze()
  }
  
  
  function drawSky() {
    drawGradient(skyColorTop, skyColorBottom, 0, height * horizonLinePosition);
  }
  
  function drawOcean() {
    drawGradient(oceanColorTop, oceanColorBottom, height * horizonLinePosition, height);
  }
  
  function drawWaves(waveCount) {
    for (let i = 0; i < waveCount; i++) {
      let waveY = height * horizonLinePosition + (i / waveCount) * (height * (1 - horizonLinePosition));
      let waveOpacity = map(i, 0, waveCount - 1, 100, 255);
      let waveThickness = map(i, 0, waveCount - 1, 1, 20);
      
      let waveColor = color(red(oceanColorTop), green(oceanColorTop), blue(oceanColorTop), waveOpacity);
      stroke(waveColor);
      strokeWeight(waveThickness);
      line(0, waveY, width, waveY);
    }
  }
  
  function drawHorizon() {
    let horizonY = height * horizonLinePosition;
    let gradientStartY = horizonY - (horizonLineThickness / 2);
    let gradientEndY = horizonY + (horizonLineThickness / 2);
    
    // Gradient from transparent to white
    let gradient1StartColor = color(255, 255, 255, 0);
    let gradient1EndColor = color(255, 255, 255, horizonLineOpacity);
    drawGradient(gradient1StartColor, gradient1EndColor, gradientStartY, gradientEndY);
    
    // Gradient from white to transparent
    let gradient2StartColor = color(255, 255, 255, horizonLineOpacity);
    let gradient2EndColor = color(255, 255, 255, 0);
    drawGradient(gradient2StartColor, gradient2EndColor, gradientStartY, gradientEndY);
  }
  
  function drawRipples() {
    let rippleColor = color(255, 1); // Color of the ripples
    let maxRippleDensity = 6; // Maximum ripple density
    let rippleAmplitude = 1; // Adjust the amplitude (height) of the ripples
    let rippleSpeed = 0.05; // Adjust the speed of the ripples
  
    noFill();
    stroke(rippleColor);
  
    for (let y = height * horizonLinePosition; y < height; y++) {
      let distanceFromCenter = abs(y - height / 2);
      let normalizedDistance = distanceFromCenter / (height / 2); // Normalize distance to range from 0 to 1
      let rippleDensity = maxRippleDensity * (1 - normalizedDistance); // Adjust ripple density based on distance
      let rippleDensityOffset = maxRippleDensity - rippleDensity; // Offset for denser ripples at the edges
  
      beginShape();
      for (let x = 0; x <= width; x += rippleDensity + rippleDensityOffset) {
        let rippleOffset = map(y, height * horizonLinePosition, height, 0, 1000);
        let rippleHeight = sin((x + rippleOffset) * rippleSpeed) * rippleAmplitude;
        curveVertex(x, y + rippleHeight);
      }
      endShape();
    }
  }
  
  
  function drawGradient(startColor, endColor, startY, endY) {
    for (let y = startY; y < endY; y++) {
      let lerpedColor = lerpColor(startColor, endColor, (y - startY) / (endY - startY));
      stroke(lerpedColor);
      line(0, y, width, y);
    }
  }
  
  function addWhiteHaze() {
    let hazeOpacity = 1;
    let gradientRadius = width*2;
  
    grad = drawingContext.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, gradientRadius);
    grad.addColorStop(0, 'rgba(0,0,0, 0)');
    grad.addColorStop(1, 'rgba(0,0,0, ' + hazeOpacity + ')');
    drawingContext.fillStyle = grad;
    drawingContext.fillRect(0, 0, width, height);
    drawingContext.fillRect(0, 0, width, height);
  }
  
  

function addWhiteHaze() {
    let hazeOpacity = 0.1; // Reduced haze opacity to fit with the new color scheme
    let gradientRadius = width*2;
  
    grad = drawingContext.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, gradientRadius);
    grad.addColorStop(0, 'rgba(255,255,255, 0)');
    grad.addColorStop(1, 'rgba(255,255,255, ' + hazeOpacity + ')'); // Changed from black haze to white haze
    drawingContext.fillStyle = grad;
    drawingContext.fillRect(0, 0, width, height);
    drawingContext.fillRect(0, 0, width, height);
  }
  