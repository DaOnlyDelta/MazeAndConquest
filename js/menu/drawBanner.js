// Draws a ribbon/banner into a canvas appended to `parent`.
// - `width`: number of middle segments
// - `scale`: pixel scale multiplier (keeps pixel-art crisp)
// - `color`: row index in the sprite (0=blue, 1=red, 2=yellow, 3=purple, ...)
function drawBanner(parent, width, scale, color) {
    // Canvas setup
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    parent.appendChild(canvas);

    // Sprite slice sizes (in source pixels)
    const cornerW = 98;
    const cornerH = 104;
    const midW = 63;
    const midH = 92;

    // Destination canvas size (in canvas pixels)
    canvas.height = cornerH * scale;
    canvas.width = (2 * cornerW + width * midW) * scale;

    // Sprite offsets
    let sx = 0;
    const sy = 128 * color;
    let dx = 0;
    const dy = 0;

    // Draw once the sprite loads
    const img = new Image();
    img.src = './assets/UI Elements/UI Elements/Ribbons/BigRibbons.png';
    img.onload = () => {
        ctx.imageSmoothingEnabled = false;

        // Left corner
        ctx.drawImage(img, sx, sy, cornerW, cornerH, dx, dy, cornerW * scale, cornerH * scale);
        dx += Math.floor(cornerW * scale);

        // Middle segments
        sx = 163;
        for (let i = 0; i < width; i++) {
            ctx.drawImage(img, sx, sy, midW, midH, dx, dy, midW * scale, midH * scale);
            dx += Math.floor(midW * scale);
        }

        // Right corner
        sx = 291;
        ctx.drawImage(img, sx, sy, cornerW, cornerH, dx, dy, cornerW * scale, cornerH * scale);
    };
}