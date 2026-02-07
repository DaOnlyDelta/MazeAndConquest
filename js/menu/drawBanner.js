function drawBanner(parent, width, scale, color) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    parent.appendChild(canvas);
    
    // Content
    const cornerW = 98;
    const cornerH = 104;
    
    const midW = 63;
    const midH = 92;
    
    let sx = 0;
    // color = {0 = blue, 1 = red, 2 = yellow, 3 = purple....}
    const sy = 128 * color; // 128 * n to change color

    let dx = 0;
    let dy = 0;

    canvas.height = 104 * scale;
    canvas.width = (2 * cornerW + width * midW) * scale;

    const img = new Image();
    img.src = './assets/UI Elements/UI Elements/Ribbons/BigRibbons.png';
    img.onload = () => {
        ctx.imageSmoothingEnabled = false;
        
        ctx.drawImage(img, sx, sy, cornerW, cornerH, dx, dy, cornerW * scale, cornerH * scale);
        dx += Math.floor(cornerW * scale);
        sx = 163;
        
        // Draw 6 middle sections (extract from sprite at x:200, y:yOffset)
        for (let i = 0; i < width; i++) {
            ctx.drawImage(img, sx, sy, midW, midH, dx, dy, midW * scale, midH * scale);
            dx += Math.floor(midW * scale);
        }
        sx = 291;
        
        // Draw tip (extract from sprite at x:320, y:yOffset)
        ctx.drawImage(img, sx, sy, cornerW, cornerH, dx, dy, cornerW * scale, cornerH * scale);
    };
}