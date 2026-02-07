function drawSliderLine(parent, width, scale) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const holder = document.createElement('div');
    holder.classList.add('sliderHolder');
    parent.appendChild(holder);
    holder.appendChild(canvas);
    
    // Content
    
    const midW = 64;
    const midH = 64;
    
    let sx = 0;
    const sy = 0;

    let dx = 0;
    let dy = 0;

    canvas.height = 64 * scale;
    canvas.width = (width * midW) * scale;

    const img = new Image();
    img.src = './assets/UI Elements/UI Elements/Bars/BigBar_Fill.png';
    img.onload = () => {
        ctx.imageSmoothingEnabled = false;
        for (let i = 0; i < width; i++) {
            ctx.drawImage(img, sx, sy, midW, midH, dx, dy, midW * scale, midH * scale);
            dx += Math.floor(midW * scale);
        }
    };
}