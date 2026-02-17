// Draws the parchment-style paper background into a canvas appended to `parentDiv`.
// `paperWidth`/`paperHeight` are counts of middle tiles (not pixels).
function drawTable(parentDiv, paperWidth, paperHeight) {
    // Canvas setup
    const canvas = document.createElement('canvas');
    parentDiv.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // ==========================================================
    // Sprite tile sizes (in source pixels)
    // ==========================================================
    const scale = 1.5;

    const cornerW = 83;
    const cornerH = 84;

    const topW = 63;
    const topH = 84;

    const sideW = 83;
    const sideH = 63;

    const midW = 63;
    const midH = 63;

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
    img.src = './assets/UI Elements/UI Elements/Wood Table/WoodTable.png';
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
        sx = 148;
        for (let i = 0; i < paperWidth; i++) {
            ctx.drawImage(img, sx, sy, topW, topH, dx, dy, topW * scale, topH * scale);
            dx += Math.floor(topW * scale);
        }

        // Top-right corner
        sx = 276;
        ctx.drawImage(img, sx, sy, cornerW, cornerH, dx, dy, cornerW * scale, cornerH * scale);

        // ------------------------------
        // Middle rows
        // ------------------------------
        dx = 0;
        dy += Math.floor(cornerH * scale);
        sy = 149;
        for (let i = 0; i < paperHeight; i++) {
            // Left side
            sx = 0;
            ctx.drawImage(img, sx, sy, sideW, sideH, dx, dy, sideW * scale, sideH * scale);
            dx += Math.floor(sideW * scale);

            // Middle fill tiles
            sx = 148;
            for (let j = 0; j < paperWidth; j++) {
                ctx.drawImage(img, sx, sy, midW, midH, dx, dy, midW * scale, midH * scale);
                dx += Math.floor(midW * scale);
            }

            // Right side
            sx = 276;
            ctx.drawImage(img, sx, sy, sideW, sideH, dx, dy, sideW * scale, sideH * scale);

            dx = 0;
            dy += Math.floor(midH * scale);
        }

        // ------------------------------
        // Bottom row
        // ------------------------------
        sx = 0;
        sy = 277;

        // Bottom-left corner
        ctx.drawImage(img, sx, sy, cornerW, cornerH, dx, dy, cornerW * scale, cornerH * scale);
        dx += Math.floor(cornerW * scale);

        // Bottom edge
        sx = 148;
        for (let i = 0; i < paperWidth; i++) {
            ctx.drawImage(img, sx, sy, topW, topH, dx, dy, topW * scale, topH * scale);
            dx += Math.floor(topW * scale);
        }

        // Bottom-right corner
        sx = 276;
        ctx.drawImage(img, sx, sy, cornerW, cornerH, dx, dy, cornerW * scale, cornerH * scale);
    };
}