// Draws the parchment-style paper background into a canvas appended to `parentDiv`.
// `paperWidth`/`paperHeight` are counts of middle tiles (not pixels).
function drawRegularPaper(parentDiv, paperWidth, paperHeight) {
    // Canvas setup
    const canvas = document.createElement('canvas');
    parentDiv.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // ==========================================================
    // Sprite tile sizes (in source pixels)
    // ==========================================================
    const scale = 1.5;

    const cornerW = 52;
    const cornerH = 44;

    const topW = 64;
    const topH = 44;

    const sideW = 52;
    const sideH = 64;

    const midW = 64;
    const midH = 64;

    // Canvas size (in canvas pixels)
    canvas.height = (2 * topH + paperHeight * midH) * scale;
    canvas.width = (2 * sideW + paperWidth * midW) * scale;

    // ==========================================================
    // Render
    // ==========================================================
    let sx = 0;
    let sy = 0;
    let dx = 0;
    let dy = 0;

    const img = new Image();
    // Relative URLs resolve against the document URL (index.html), not this JS file.
    img.src = './assets/UI Elements/UI Elements/Papers/RegularPaper.png';
    img.onerror = (e) => {
        console.error('Failed to load paper image:', img.src, e);
    };
    img.onload = () => {
        ctx.imageSmoothingEnabled = false;

        // ------------------------------
        // Top row
        // ------------------------------
        // Top-left corner
        ctx.drawImage(img, sx, sy, cornerW, cornerH, dx, dy, cornerW * scale, cornerH * scale);
        dx += Math.floor(cornerW * scale);

        // Top edge
        sx = 116;
        for (let i = 0; i < paperWidth; i++) {
            ctx.drawImage(img, sx, sy, topW, topH, dx, dy, topW * scale, topH * scale);
            dx += Math.floor(topW * scale);
        }

        // Top-right corner
        sx = 244;
        ctx.drawImage(img, sx, sy, cornerW, cornerH, dx, dy, cornerW * scale, cornerH * scale);

        // ------------------------------
        // Middle rows
        // ------------------------------
        dx = 0;
        dy += Math.floor(cornerH * scale);
        sy = 108;
        for (let i = 0; i < paperHeight; i++) {
            // Left side
            sx = 0;
            ctx.drawImage(img, sx, sy, sideW, sideH, dx, dy, sideW * scale, sideH * scale);
            dx += Math.floor(sideW * scale);

            // Middle fill tiles
            sx = 116;
            for (let j = 0; j < paperWidth; j++) {
                ctx.drawImage(img, sx, sy, midW, midH, dx, dy, midW * scale, midH * scale);
                dx += Math.floor(midW * scale);
            }

            // Right side
            sx = 244;
            ctx.drawImage(img, sx, sy, sideW, sideH, dx, dy, sideW * scale, sideH * scale);

            dx = 0;
            dy += Math.floor(midH * scale);
        }

        // ------------------------------
        // Bottom row
        // ------------------------------
        sx = 0;
        sy = 236;

        // Bottom-left corner
        ctx.drawImage(img, sx, sy, cornerW, cornerH, dx, dy, cornerW * scale, cornerH * scale);
        dx += Math.floor(cornerW * scale);

        // Bottom edge
        sx = 116;
        for (let i = 0; i < paperWidth; i++) {
            ctx.drawImage(img, sx, sy, topW, topH, dx, dy, topW * scale, topH * scale);
            dx += Math.floor(topW * scale);
        }

        // Bottom-right corner
        sx = 244;
        ctx.drawImage(img, sx, sy, cornerW, cornerH, dx, dy, cornerW * scale, cornerH * scale);
    };
}