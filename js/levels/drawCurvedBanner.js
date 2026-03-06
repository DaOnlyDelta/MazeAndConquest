function drawCurvedBanner(parentDiv, bannerWidth, bannerHeight) {
    // Canvas setup
    const canvas = document.createElement('canvas');
    parentDiv.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // ==========================================================
    // Sprite tile sizes (in source pixels)
    // ==========================================================
    const scale = 1.5;

    const ltCornerW = 100;
    const ltCornerH = 67;

    // Offset 164px
    const topW = 64;
    const topH = 67;

    // Offset 292px
    const rtCornerW = 84;
    const rtCornerH = 67;

    // Y Offset 131px
    const lSideW = 100;
    const lSideH = 64;

    const midW = 64;
    const midH = 64;

    const rSideW = 84;
    const rSideH = 64;

    // Y Offset 259
    const lbCornerW = 100;
    const lbCornerH = 110;

    const bottomW = 64;
    const bottomH = 110;

    const rbCornerW = 84;
    const rbCornerH = 110;

    // Canvas size (in canvas pixels)
    canvas.height = (topH + midH * bannerHeight + bottomH) * scale;
    canvas.width = (lSideW + midW * bannerWidth + rSideW) * scale;

    // Scale the paper with the canvas container (canvasHolder = 25 * 64 = 1600px natural width)
    parentDiv.style.width = (canvas.width / 1600 * 100) + '%';
    canvas.style.width = '100%';
    canvas.style.height = 'auto';

    // ==========================================================
    // Render
    // ==========================================================
    let sx = 0;
    let sy = 0;
    let dx = 0;
    let dy = 0;

    const img = new Image();
    // Relative URLs resolve against the document URL (index.html), not this JS file.
    img.src = './assets/UI Elements/UI Elements/Banners/Banner.png';
    img.onerror = (e) => {
        console.error('Failed to load paper image:', img.src, e);
    };
    img.onload = () => {
        ctx.imageSmoothingEnabled = false;

        // ------------------------------
        // Top row
        // ------------------------------
        // Top-left corner
        ctx.drawImage(img, sx, sy, ltCornerW, ltCornerH, dx, dy, ltCornerW * scale, ltCornerH * scale);
        dx += Math.floor(ltCornerW * scale);

        // Top edge
        sx = 164;
        for (let i = 0; i < bannerWidth; i++) {
            ctx.drawImage(img, sx, sy, topW, topH, dx, dy, topW * scale, topH * scale);
            dx += Math.floor(topW * scale);
        }

        // Top-right corner
        sx = 292;
        ctx.drawImage(img, sx, sy, rtCornerW, rtCornerH, dx, dy, rtCornerW * scale, rtCornerH * scale);

        // ------------------------------
        // Middle rows
        // ------------------------------
        dx = 0;
        dy += Math.floor(topH * scale);
        sy = 131;
        for (let i = 0; i < bannerHeight; i++) {
            // Left side
            sx = 0;
            ctx.drawImage(img, sx, sy, lSideW, lSideH, dx, dy, lSideW * scale, lSideH * scale);
            dx += Math.floor(lSideW * scale);

            // Middle fill tiles
            sx = 164;
            for (let j = 0; j < bannerWidth; j++) {
                ctx.drawImage(img, sx, sy, midW, midH, dx, dy, midW * scale, midH * scale);
                dx += Math.floor(midW * scale);
            }

            // Right side
            sx = 292;
            ctx.drawImage(img, sx, sy, rSideW, rSideH, dx, dy, rSideW * scale, rSideH * scale);

            dx = 0;
            dy += Math.floor(midH * scale);
        }

        // ------------------------------
        // Bottom row
        // ------------------------------
        sx = 0;
        sy = 259;

        // Bottom-left corner
        ctx.drawImage(img, sx, sy, lbCornerW, lbCornerH, dx, dy, lbCornerW * scale, lbCornerH * scale);
        dx += Math.floor(lbCornerW * scale);

        // Bottom edge
        sx = 164;
        for (let i = 0; i < bannerWidth; i++) {
            ctx.drawImage(img, sx, sy, bottomW, bottomH, dx, dy, bottomW * scale, bottomH * scale);
            dx += Math.floor(bottomW * scale);
        }

        // Bottom-right corner
        sx = 292;
        ctx.drawImage(img, sx, sy, rbCornerW, rbCornerH, dx, dy, rbCornerW * scale, rbCornerH * scale);
    };
}
