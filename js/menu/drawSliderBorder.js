// Draws the slider border/bar base into a canvas appended to `parent`.
// `width` is the number of middle segments.
function drawSliderBorder(parent, width, scale) {
    // Canvas setup
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    parent.appendChild(canvas);

    // Sprite slice sizes
    const cornerW = 24;
    const cornerH = 64;
    const midW = 64;
    const midH = 64;

    // Canvas size
    canvas.height = cornerH * scale;
    canvas.width = (2 * cornerW + width * midW) * scale;

    // Draw once the sprite loads
    const img = new Image();
    img.src = './assets/UI Elements/UI Elements/Bars/BigBar_Base.png';
    img.onload = () => {
        ctx.imageSmoothingEnabled = false;

        let sx = 0;
        const sy = 0;
        let dx = 0;
        const dy = 0;

        // Left cap
        ctx.drawImage(img, sx, sy, cornerW, cornerH, dx, dy, cornerW * scale, cornerH * scale);
        dx += Math.floor(cornerW * scale);

        // Middle segments
        sx = 88;
        for (let i = 0; i < width; i++) {
            ctx.drawImage(img, sx, sy, midW, midH, dx, dy, midW * scale, midH * scale);
            dx += Math.floor(midW * scale);
        }

        // Right cap
        sx = 216;
        ctx.drawImage(img, sx, sy, cornerW, cornerH, dx, dy, cornerW * scale, cornerH * scale);
    };
}