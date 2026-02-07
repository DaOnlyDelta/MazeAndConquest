function drawSliderBorder(parent, width, scale) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    parent.appendChild(canvas);
    
    // Content
    const cornerW = 24;
    const cornerH = 64;
    
    const midW = 64;
    const midH = 64;
    
    let sx = 0;
    const sy = 0;

    let dx = 0;
    let dy = 0;

    canvas.height = 64 * scale;
    canvas.width = (2 * cornerW + width * midW) * scale;

    const img = new Image();
    img.src = './assets/UI Elements/UI Elements/Bars/BigBar_Base.png';
    img.onload = () => {
        ctx.imageSmoothingEnabled = false;
        
        ctx.drawImage(img, sx, sy, cornerW, cornerH, dx, dy, cornerW * scale, cornerH * scale);
        dx += Math.floor(cornerW * scale);
        sx = 88;
        
        // Draw 6 middle sections (extract from sprite at x:87, y:yOffset)
        for (let i = 0; i < width; i++) {
            ctx.drawImage(img, sx, sy, midW, midH, dx, dy, midW * scale, midH * scale);
            dx += Math.floor(midW * scale);
        }
        sx = 216;
        
        // Draw tip (extract from sprite at x:216, y:yOffset)
        ctx.drawImage(img, sx, sy, cornerW, cornerH, dx, dy, cornerW * scale, cornerH * scale);
    };
}