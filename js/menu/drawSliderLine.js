// Draws the slider fill into a clipped container (".sliderHolder") inside `parent`.
// The holder is what we resize to visually represent the current value.
function drawSliderLine(parent, width, scale) {
    // Holder (clipped)
    const holder = document.createElement('div');
    holder.classList.add('sliderHolder');
    parent.appendChild(holder);

    // Canvas inside the holder
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    holder.appendChild(canvas);

    // Sprite slice sizes
    const midW = 64;
    const midH = 64;

    // Canvas size
    canvas.height = midH * scale;
    canvas.width = width * midW * scale;

    // Draw once the sprite loads
    const img = new Image();
    img.src = './assets/UI Elements/UI Elements/Bars/BigBar_Fill.png';
    img.onload = () => {
        ctx.imageSmoothingEnabled = false;

        let sx = 0;
        const sy = 0;
        let dx = 0;
        const dy = 0;

        for (let i = 0; i < width; i++) {
            ctx.drawImage(img, sx, sy, midW, midH, dx, dy, midW * scale, midH * scale);
            dx += Math.floor(midW * scale);
        }
    };
}