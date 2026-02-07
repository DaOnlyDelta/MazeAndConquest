function drawPaper(parentDiv, paperWidth, paperHeight) {
    const canvas = document.createElement('canvas');
    parentDiv.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    /*
    ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    
    sx, sy, sWidth, sHeight = which rectangle you cut out of the source image (measured in source-image pixels)
    dx, dy, dWidth, dHeight = where/how big you draw it on the canvas (canvas pixels)
    */
   
   let sx = 0, sy = 0;
   let dx = 0, dy = 0;
   const scale = 1.5;
   
   // Corners:
   const sWidthC = 54, sHeightC = 43;
   
   // Top Sides:
   const sWidthT = 64, sHeightT = 43;
   
   // Sides
   const sWidthS = 54, sHeightS = 64;
   
   // Middle:
   const sWidthM = 64, sHeightM = 64;
   
   // Calculate the width by the paperWidth 546 700
    canvas.height = (2 * sHeightT + paperHeight * sHeightM) * scale;
    canvas.width = (2 * sWidthS + paperWidth * sHeightM) * scale;

    /* 
    in the img:
    left top corner:
        sx = 118;
        sy = 0;
    
    top side:
        sx = 0;
        sy = 107;
    
    top right corner:
        sx = 246;
        sy = 0;
    
    left side:
        sx = 0;
        sy = 107;
    
    middle:
        sx = 118
        sy = 107
    */

    const img = new Image();
    // Relative URLs resolve against the document URL (index.html), not this JS file.
    // On GitHub Pages the site is served from /<repo>/, so using '../assets' breaks.
    img.src = './assets/UI Elements/UI Elements/Papers/SpecialPaper.png';
    img.onerror = (e) => {
        console.error('Failed to load paper image:', img.src, e);
    };
    img.onload = () => {
        ctx.imageSmoothingEnabled = false;

        // Draw left top corner
        ctx.drawImage(img, sx, sy, sWidthC, sHeightC, dx, dy, sWidthC * scale, sHeightC * scale);
        dx += Math.floor(sWidthC * scale);

        // Draw upper line
        sx = 118;
        for (let i = 0; i < paperWidth; i++) {
            ctx.drawImage(img, sx, sy, sWidthT, sHeightT, dx, dy, sWidthT * scale, sHeightT * scale);
            dx += Math.floor(sWidthT * scale);
        }

        // Draw right top corner
        sx = 246;
        ctx.drawImage(img, sx, sy, sWidthC, sHeightC, dx, dy, sWidthC * scale, sHeightC * scale);

        // Draw left to right top to bottom
        dx = 0;
        dy += Math.floor(sHeightC * scale);
        sy = 107;
        for (let i = 0; i < paperHeight; i++) {

            // Left side
            sx = 0;
            ctx.drawImage(img, sx, sy, sWidthS, sHeightS, dx, dy, sWidthS * scale, sHeightS * scale);
            dx += Math.floor(sWidthS * scale);
            sx = 118;

            // Middle
            for (let j = 0; j < paperWidth; j++) {
                ctx.drawImage(img, sx, sy, sWidthM, sHeightM, dx, dy, sWidthM * scale, sHeightM * scale);
                dx += Math.floor(sWidthM * scale);
            }

            // Right side
            sx = 246;
            ctx.drawImage(img, sx, sy, sWidthS, sHeightS, dx, dy, sWidthS * scale, sHeightS * scale);
            dx = 0;
            dy += Math.floor(sHeightM * scale);
        }

        sx = 0;
        sy = 235;

        // Draw left top corner
        ctx.drawImage(img, sx, sy, sWidthC, sHeightC, dx, dy, sWidthC * scale, sHeightC * scale);
        dx += Math.floor(sWidthC * scale);

        // Draw upper line
        sx = 118;
        for (let i = 0; i < paperWidth; i++) {
            ctx.drawImage(img, sx, sy, sWidthT, sHeightT, dx, dy, sWidthT * scale, sHeightT * scale);
            dx += Math.floor(sWidthT * scale);
        }

        // Draw right top corner
        sx = 246;
        ctx.drawImage(img, sx, sy, sWidthC, sHeightC, dx, dy, sWidthC * scale, sHeightC * scale);
    };
};