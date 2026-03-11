/**
 * drawColor.js
 * Draws a single color swatch from the BigRibbons sprite sheet.
 * Used in the customize screen for color selection slots.
 */
function drawColor(parent, scale, color) {
    // Canvas setup
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    parent.appendChild(canvas);

    // Sprite slice sizes (in source pixels)
    const midW = 63;
    const midH = 58;

    // Destination canvas size (in canvas pixels)
    canvas.height = midH * scale;
    canvas.width = midW * scale;

    // Sprite offsets
    const sy = 15 + 128 * color;

    // Draw once the sprite loads
    const img = new Image();
    img.src = './assets/UI Elements/UI Elements/Ribbons/BigRibbons.png';
    img.onload = () => {
        ctx.imageSmoothingEnabled = false;

        // Middle segment
        ctx.drawImage(img, 163, sy, midW, midH, 0, 0, midW * scale, midH * scale);
    };
}
