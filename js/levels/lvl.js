(function() {
    const canvas = document.getElementById('levelCanvas');
    const ctx = canvas.getContext('2d');
    const tilesX = 25;
    const tilesY = 20;
    const tileS = 64;
    const displayS = 64;

    // Set canvas dimensions to exactly fit 25x20 tiles
    canvas.width = tilesX * displayS;
    canvas.height = tilesY * displayS;

    // Helper function to draw tiles in a row, auto-incrementing x unless overridden
    function drawTileRow(img, y, tileConfigs) {
        let x = 0;
        tileConfigs.forEach((config) => {
            if (config.x !== undefined) x = config.x; // Override x if specified
            const sx = config.sx !== undefined ? config.sx : 0;
            const sy = config.sy !== undefined ? config.sy : 0;
            ctx.drawImage(img, sx * tileS, sy * tileS, tileS, tileS, x * displayS, y * displayS, displayS, displayS);
            x++; // Auto-increment x for next tile
        });
    }

    // Load both images and draw when both are ready
    let imagesLoaded = 0;
    const waterImg = new Image();
    const g5 = new Image();
    const g3 = new Image();
    const g2 = new Image();
    const g1 = new Image();
    const foamImg = new Image();
    const shadow = new Image();
    const rocks = [new Image(), new Image(), new Image(), new Image()]; // Rock types 1-4
    const bushes = [new Image(), new Image(), new Image(), new Image()]; // Bush types 1-4
    const staticRocks = [new Image(), new Image(), new Image(), new Image()]; // Static rock types 1-4
    const buildings = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()]; // Building types 1-8

    // Animation state for water foam
    let foamAnimationFrame = 0;
    const FOAM_ANIMATION_SPEED = 10; // Higher = slower animation. Adjust this to control speed
    let foamFrameCounter = 0;
    const foamFrameWidth = 192;
    const foamFrameHeight = 192;
    const foamTotalFrames = 16;

    // Animation state for rocks
    let rockAnimationFrame = 0;
    const ROCK_ANIMATION_SPEED = 10; // Higher = slower animation
    let rockFrameCounter = 0;
    const rockFrameWidth = 64; // Each rock frame is 64x64
    const rockFrameHeight = 64;
    const rockTotalFrames = 16; // 1024 / 64 = 16 frames

    // Animation state for bushes
    let bushAnimationFrame = 0;
    const BUSH_ANIMATION_SPEED = 15;
    let bushFrameCounter = 0;
    const bushFrameWidth = 128; // Each bush frame is 128x128
    const bushFrameHeight = 128;
    const bushTotalFrames = 8; // 1024 / 128 = 8 frames

    // Draw animated water foam on a specific row
    function drawWaterFoam(img, y, xPositions) {
        xPositions.forEach((x, index) => {
            // Stagger animation: each foam tile starts at a different frame
            const frameOffset = (index * 3) % foamTotalFrames;
            const currentFrame = (foamAnimationFrame + frameOffset) % foamTotalFrames;
            
            // Source coordinates: frames are 192x192, arranged horizontally
            const sx = currentFrame * foamFrameWidth;
            const sy = 0;
            
            // Destination: display at full 192x192 size (will overlap surrounding tiles)
            const dx = x * displayS;
            const dy = y * displayS;
            
            ctx.drawImage(img, sx, sy, foamFrameWidth, foamFrameHeight, dx, dy, foamFrameWidth, foamFrameHeight);
        });
    }

    // Draw static shadow tiles (192x192)
    function drawShadow(img, y, xPositions) {
        xPositions.forEach((x) => {
            const dx = x * displayS;
            const dy = y * displayS;
            
            ctx.drawImage(img, 0, 0, foamFrameWidth, foamFrameHeight, dx, dy, foamFrameWidth, foamFrameHeight);
        });
    }

    // Draw animated rock decorations (64x64, 16 frames, 1024x64 sprite)
    function drawRockInWater(i, x, y) {
        const img = rocks[i];
        const currentFrame = rockAnimationFrame % rockTotalFrames;
        
        // Source coordinates: frames arranged horizontally in 1024x64 sprite
        const sx = currentFrame * rockFrameWidth;
        const sy = 0;
        
        // Destination on canvas
        const dx = x * displayS;
        const dy = y * displayS;
        
        ctx.drawImage(img, sx, sy, rockFrameWidth, rockFrameHeight, dx, dy, displayS, displayS);
    }

    function drawStaticRock(i, x, y, flip = false) {
        const img = staticRocks[i];
        const dx = x * displayS;
        const dy = y * displayS;
        
        if (flip) {
            ctx.save();
            ctx.translate(dx + displayS / 2, dy + displayS / 2);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0, rockFrameWidth, rockFrameHeight, -displayS / 2, -displayS / 2, displayS, displayS);
            ctx.restore();
        } else {
            ctx.drawImage(img, 0, 0, rockFrameWidth, rockFrameHeight, dx, dy, displayS, displayS);
        }
    }

    // Draw animated bush decorations (128x128, 8 frames, 1024x128 sprite)
    function drawBush(i, x, y) {
        const img = bushes[i];
        const currentFrame = bushAnimationFrame % bushTotalFrames;
        
        // Source coordinates: frames arranged horizontally in 1024x128 sprite
        const sx = currentFrame * bushFrameWidth;
        const sy = 0;
        
        // Destination on canvas: draw at full 128x128 size (2x2 tiles)
        const dx = x * displayS;
        const dy = y * displayS;
        
        ctx.drawImage(img, sx, sy, bushFrameWidth, bushFrameHeight, dx, dy, bushFrameWidth, bushFrameHeight);
    }

    function drawBuilding(i, x, y, flip = false) {
        const img = buildings[i];
        const dx = x * displayS;
        const dy = y * displayS;
        
        if (flip) {
            ctx.save();
            ctx.translate(dx + displayS / 2, dy + displayS / 2);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0, img.width, img.height, -displayS / 2, -displayS / 2, img.width, img.height);
            ctx.restore();
        } else {
            ctx.drawImage(img, 0, 0, img.width, img.height, dx, dy - (img.height - displayS), img.width, img.height);
        }
    }

    function drawScene() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // BG color
        for (let row = 0; row < tilesY; row++) {
            for (let col = 0; col < tilesX; col++) {
                ctx.drawImage(waterImg, 0, 0, tileS, tileS, col * displayS, row * displayS, displayS, displayS);
            }
        }

        // Water foam
        {
            drawWaterFoam(foamImg, 17, [ 1, 2, 3, 8, 9, 10, 18, 19, 20, 21 ]);
            drawWaterFoam(foamImg, 16, [ 9, 10, 14, 15, 16, 17, 22 ]);
            drawWaterFoam(foamImg, 15, [ 0, 1, 2, 3, 4, 12, 13 ]);
            drawWaterFoam(foamImg, 14, [ 0, 5, 6, 12 ]);
            drawWaterFoam(foamImg, 13, [ 0, 5, 7, 11, 21 ]);
            drawWaterFoam(foamImg, 12, [ 0, 5, 11, 12, 22 ]);
            drawWaterFoam(foamImg, 11, [ 6, 7, 8, 12, 22 ]);
            drawWaterFoam(foamImg, 10, [ 3, 9, 10, 11, 22 ]);
            drawWaterFoam(foamImg, 9, [ 1, 2 ]);
            drawWaterFoam(foamImg, 8, [ 0 ]);
            drawWaterFoam(foamImg, 7, [ 0, 20 ]);
            drawWaterFoam(foamImg, 6, [ 0, 21, 22 ]);
            drawWaterFoam(foamImg, 5, [ 22 ]);
            drawWaterFoam(foamImg, 4, [ 22 ]);
            drawWaterFoam(foamImg, 4, [ 10, 11, 12, 13, 22 ]);
            drawWaterFoam(foamImg, 3, [ 14, 22 ]);
            drawWaterFoam(foamImg, 2, [ 13, 14, 15, 16, 17, 18, 19, 20, 21 ]);
        }
        
        // Draw rock decorations on the water
        {
            drawRockInWater(1, 13.8, 4);
            drawRockInWater(0, 0.5, 10);
            drawRockInWater(1, 0.7, 10.3);
            drawRockInWater(2, 10, 12);
            drawRockInWater(2, 23.8, 13.8);
            drawRockInWater(3, 23.5, 14.2);
            drawRockInWater(0, 5.8, 16.8);
            drawRockInWater(1, 13.9, 17.1);
            drawRockInWater(0, 17.7, 18);
            drawRockInWater(2, 18, 18.3);
            drawRockInWater(3, 0.8, 18.7);
        }

        // Flat ground
        {
            // Y=18: bottom row
            drawTileRow(g3, 18, [
                { x: 2, sx: 0, sy: 3 },
                { sx: 1, sy: 3 },
                { sx: 2, sy: 3 },
                { x: 9, sx: 0, sy: 3 },
                { sx: 1, sy: 2 },
                { sx: 2, sy: 2 },
                { x: 19, sx: 0, sy: 2 },
                { sx: 1, sy: 2 },
                { sx: 1, sy: 2 },
                { sx: 2, sy: 2 }
            ]);

            // Y=17
            drawTileRow(g3, 17, [
                { x: 10, sx: 0, sy: 0 },
                { sx: 2, sy: 0 },
                { x: 19, sx: 0, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 2, sy: 2 }
            ]);

            // Y=16
            drawTileRow(g3, 16, [
                { x: 1, sx: 0, sy: 2 },
                { sx: 1, sy: 2 },
                { sx: 1, sy: 2 },
                { sx: 1, sy: 2 },
                { sx: 2, sy: 2 },
                { x: 13, sx: 0, sy: 2 },
                { sx: 1, sy: 2 },
                { sx: 1, sy: 2 },
                { sx: 1, sy: 2 },
                { sx: 1, sy: 2 },
                { sx: 1, sy: 2 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 0 },
                { sx: 2, sy: 0 }
            ]);

            // Y=15
            drawTileRow(g3, 15, [
                { x: 1, sx: 0, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 2 },
                { sx: 2, sy: 3 },
                { x: 13, sx: 0, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 }
            ]);

            // Y=14
            drawTileRow(g3, 14, [
                { x: 1, sx: 0, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 2, sy: 1 },
                { x: 8, sx: 3, sy: 3 },
                { x: 12, sx: 0, sy: 2 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 }
            ]);

            // Y=13
            drawTileRow(g3, 13, [
                { x: 1, sx: 0, sy: 0 },
                { sx: 1, sy: 0 },
                { sx: 1, sy: 0 },
                { sx: 1, sy: 0 },
                { sx: 1, sy: 1 },
                { sx: 2, sy: 1 },
                { x: 12, sx: 0, sy: 0 },
                { sx: 1, sy: 0 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 }
            ]);

            // Y=12
            drawTileRow(g3, 12, [
                { x: 5, sx: 0, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 2 },
                { sx: 1, sy: 2 },
                { sx: 2, sy: 2 },
                { x: 14, sx: 0, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 }
            ]);

            // Y=11
            drawTileRow(g3, 11, [
                { x: 5, sx: 0, sy: 0 },
                { sx: 1, sy: 0 },
                { sx: 1, sy: 0 },
                { sx: 1, sy: 0 },
                { sx: 2, sy: 0 },
                { x: 14, sx: 0, sy: 0 },
                { sx: 1, sy: 0 },
                { sx: 1, sy: 0 }
            ]);
        }

        // Flat ground shadow
        {
            // Y=18: bottom row
            drawShadow(shadow, 16, [ 18, 19, 20 ]);
            drawShadow(shadow, 15, [ 20 ]);
            drawShadow(shadow, 13, [ 1, 2, 3, 4, 18 ]);
            drawShadow(shadow, 12, [ 1, 4, 13, 16, 17 ]);
            drawShadow(shadow, 11, [ 4, 13, 15 ]);
            drawShadow(shadow, 10, [ 5, 6, 7, 8, 14, 15 ]);
        }

        // Flat ground 2 (forest)
        {
            // Y=9
            drawTileRow(g5, 9, [
                { x: 13, sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 2, sy: 1 }
            ]);

            // Y=8
            drawTileRow(g5, 8, [
                { x: 13, sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 2, sy: 1 }
            ]);

            // Y=7
            drawTileRow(g5, 7, [
                { x: 13, sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 2 },
                { sx: 2, sy: 2 }
            ]);

            // Y=6
            drawTileRow(g5, 6, [
                { x: 11, sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 2, sy: 1 }
            ]);

            // Y=5
            drawTileRow(g5, 5, [
                { x: 11, sx: 0, sy: 0 },
                { sx: 1, sy: 0 },
                { sx: 1, sy: 0 },
                { sx: 1, sy: 0 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 2, sy: 1 }
            ]);

            // Y=4
            drawTileRow(g5, 4, [
                { x: 15, sx: 0, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 2, sy: 0 }
            ]);

            // Y=3
            drawTileRow(g5, 3, [
                { x: 14, sx: 0, sy: 3 },
                { sx: 1, sy: 0 },
                { sx: 1, sy: 0 },
                { sx: 1, sy: 0 },
                { sx: 1, sy: 0 },
                { sx: 1, sy: 0 },
                { sx: 1, sy: 0 },
                { sx: 1, sy: 0 },
                { sx: 2, sy: 0 }
            ]);
        }

        // Flat ground 2 shadow
        {
            drawShadow(shadow, 7, [ 13 ]);
            drawShadow(shadow, 6, [ 13, 14 ]);
        }

        // Elevated ground (cliffs and slopes), sx += 5 for rocks
        {
            // Y=17
            drawTileRow(g1, 17, [
                { x: 15, sx: 5, sy: 5 },
                { sx: 6, sy: 5 },
                { sx: 6, sy: 5 },
                { sx: 6, sy: 5 },
                { sx: 6, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 7, sy: 4 }
            ]);
            
            // Order is flipped here because of the slope in the right bottom corner
            // Y=15
            drawTileRow(g1, 15, [
                { x: 17, sx: 0, sy: 4 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 7, sy: 1 }
            ]);
            
            // Y=16
            drawTileRow(g1, 16, [
                { x: 15, sx: 5, sy: 3 },
                { sx: 6, sy: 3 },
                { x: 17, sx: 0, sy: 5 },
                { x: 17, sx: 6, sy: 3 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 7, sy: 2 }
            ]);
            
            // Y=14
            drawTileRow(g1, 14, [
                { x: 2, sx: 5, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 3, sy: 5 },
                { x: 19, sx: 5, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 7, sy: 1 },
                { sx: 7, sy: 5 }
            ]);

            // Y=13
            drawTileRow(g1, 13, [
                { x: 2, sx: 5, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { x: 5, sx: 7, sy: 4 },
                { x: 5, sx: 3, sy: 4 },
                { x: 14, sx: 8, sy: 4 },
                { x: 17, sx: 5, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 5, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 7, sy: 2 },
                { sx: 7, sy: 5 }
            ]);

            // Y=12
            drawTileRow(g1, 12, [
                { x: 2, sx: 5, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 7, sy: 2 },
                { x: 13, sx: 5, sy: 5 },
                { sx: 8, sy: 2 },
                { x: 16, sx: 0, sy: 5 },
                { sx: 5, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 7, sy: 2 }
            ]);

            // Y=11
            drawTileRow(g1, 11, [
                { x: 4, sx: 5, sy: 5 },
                { sx: 8, sy: 1 },
                { sx: 6, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 6, sy: 5 },
                { sx: 6, sy: 5 },
                { sx: 6, sy: 5 },
                { sx: 5, sy: 2 },
                { sx: 7, sy: 1 },
                { sx: 6, sy: 4 },
                { x: 16, sx: 6, sy: 4 },
                { x: 16, sx: 0, sy: 4 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 7, sy: 1 }
            ]);

            // Y=10
            drawTileRow(g1, 10, [
                { x: 2, sx: 5, sy: 5 },
                { sx: 6, sy: 5 },
                { sx: 5, sy: 2 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 7, sy: 0 }
            ]);

            // Y=9
            drawTileRow(g1, 9, [
                { x: 1, sx: 5, sy: 5 },
                { sx: 5, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 7, sy: 0 }
             ]);

            // Y=8
            drawTileRow(g1, 8, [
                { x: 1, sx: 5, sy: 2 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 7, sy: 1 },
                { sx: 3, sy: 5 }
            ]);

            // Y=7
            drawTileRow(g1, 7, [
                { x: 1, sx: 5, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { x: 8, sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { x: 14, sx: 6, sy: 4 },
                { x: 14, sx: 3, sy: 4 },
                { sx: 7, sy: 4 }
            ]);

            // Y=6
            drawTileRow(g1, 6, [
                { x: 1, sx: 5, sy: 0 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { x: 11, sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 3 },
                { sx: 7, sy: 3 }
            ]);

            // Y=5
            drawTileRow(g1, 5, [
                { x: 2, sx: 5, sy: 0 },
                { sx: 6, sy: 0 }
            ]);
        }

        // Flat ground buildings
        {
            drawBuilding(4, 16.4, 14.3);
            drawBuilding(7, 10, 18);
        }

        // Flat ground rocks
        {
            drawStaticRock(1, 1, 6.5);
            drawStaticRock(2, 3.1, 8.5);
            drawStaticRock(2, 14.75, 11.5);
            drawStaticRock(0, 8.3, 11.7);
            drawStaticRock(3, 8.8, 11.5,);
            drawStaticRock(3, 4.3, 14.5, true);
            drawStaticRock(3, 19.2, 17.5, true);
            drawStaticRock(0, 19.02, 17.8);
        }

        // Flat ground 2 rocks
        {
            drawStaticRock(1, 15.1, 7.4, true);
        }

        // Flat ground bushes
        {
            drawBush(3, 0.5, 12.7);
            drawBush(1, 13.9, 13);
            drawBush(0, 13.4, 13.3);
            drawBush(1, 17.1, 13.7);
            drawBush(3, 15.4, 13.8);
            drawBush(0, 1.1, 14.1);
            drawBush(2, 1.65, 14.5);
            drawBush(1, 0.65, 14.5);
            drawBush(0, 22.2, 16.4);
            drawBush(1, 21.7, 16.7);
            drawBush(1, 3.1, 17.25);
            drawBush(0, 2.5, 17.5);
            drawBush(3, 3.5, 17.5);
        }

        // Elevated ground shadow
        {
            drawShadow(shadow, 8, [ 3, 4, 5, 6, 7, 8 ]);
            drawShadow(shadow, 7, [ 1, 2, 7 ]);
            drawShadow(shadow, 6, [ 2, 8, 9, 10 ]);
            drawShadow(shadow, 5, [ 2, 10 ]);
            drawShadow(shadow, 4, [ 2 ]);
        }

        // Elevated ground bushes
        {
            drawBush(1, 4.6, 9.3);
            drawBush(3, 20.2, 11.5);
        }

        // Elevated ground 2
        {
            // Y=9
            drawTileRow(g2, 9, [
                { x: 4, sx: 5, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 3, sy: 5 }
            ]);

            // Y=8
            drawTileRow(g2, 8, [
                { x: 2, sx: 5, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 5, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 3, sy: 4 }
             ]);

            // Y=7
            drawTileRow(g2, 7, [
                { x: 2, sx: 5, sy: 3 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 7, sy: 1 },
                { sx: 6, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 7, sy: 4 }
             ]);

             // Y=6
             drawTileRow(g2, 6, [
                { x: 3, sx: 5, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 7, sy: 2 }
             ]);

             // Y=5
            drawTileRow(g2, 5, [
                { x: 3, sx: 5, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 7, sy: 0 }
            ]);

            // Y=4
            drawTileRow(g2, 4, [
                { x: 3, sx: 5, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 7, sy: 0 }
            ]);
        }
    }

    // Callback to check if all images are loaded
    function checkImagesLoaded() {
        imagesLoaded++;
        if (imagesLoaded !== 27) return; // Wait for all 27 images (7 base + 4 rock types + 4 bush types + 4 static rock types + 8 buildings)
        
        // All images loaded, start unified animation loop
        animate();
    }

    // Unified animation loop for all decorations
    function animate() {
        // Update foam animation
        foamFrameCounter++;
        if (foamFrameCounter >= FOAM_ANIMATION_SPEED) {
            foamFrameCounter = 0;
            foamAnimationFrame = (foamAnimationFrame + 1) % foamTotalFrames;
        }

        // Update rock animation
        rockFrameCounter++;
        if (rockFrameCounter >= ROCK_ANIMATION_SPEED) {
            rockFrameCounter = 0;
            rockAnimationFrame = (rockAnimationFrame + 1) % rockTotalFrames;
        }

        // Update bush animation
        bushFrameCounter++;
        if (bushFrameCounter >= BUSH_ANIMATION_SPEED) {
            bushFrameCounter = 0;
            bushAnimationFrame = (bushAnimationFrame + 1) % bushTotalFrames;
        }

        // Draw once per frame with all animations updated
        drawScene();
        requestAnimationFrame(animate);
    }

    waterImg.src = './assets/Terrain/Tileset/Water Background color.png';
    waterImg.onload = checkImagesLoaded;

    g5.src = './assets/Terrain/Tileset/Tilemap_color5.png';
    g5.onload = checkImagesLoaded;

    g3.src = './assets/Terrain/Tileset/Tilemap_color3.png';
    g3.onload = checkImagesLoaded;

    g2.src = './assets/Terrain/Tileset/Tilemap_color2.png';
    g2.onload = checkImagesLoaded;

    g1.src = './assets/Terrain/Tileset/Tilemap_color1.png';
    g1.onload = checkImagesLoaded;

    foamImg.src = './assets/Terrain/Tileset/Water Foam.png';
    foamImg.onload = checkImagesLoaded;

    shadow.src = './assets/Terrain/Tileset/Shadow.png';
    shadow.onload = checkImagesLoaded;

    // Load rock sprites (types 1-4)
    rocks[0].src = './assets/Terrain/Decorations/Rocks in the Water/Water Rocks_01.png';
    rocks[0].onload = checkImagesLoaded;

    rocks[1].src = './assets/Terrain/Decorations/Rocks in the Water/Water Rocks_02.png';
    rocks[1].onload = checkImagesLoaded;

    rocks[2].src = './assets/Terrain/Decorations/Rocks in the Water/Water Rocks_03.png';
    rocks[2].onload = checkImagesLoaded;

    rocks[3].src = './assets/Terrain/Decorations/Rocks in the Water/Water Rocks_04.png';
    rocks[3].onload = checkImagesLoaded;

    // Load bush sprites (types 1-4)
    bushes[0].src = './assets/Terrain/Decorations/Bushes/Bushe1.png';
    bushes[0].onload = checkImagesLoaded;

    bushes[1].src = './assets/Terrain/Decorations/Bushes/Bushe2.png';
    bushes[1].onload = checkImagesLoaded;

    bushes[2].src = './assets/Terrain/Decorations/Bushes/Bushe3.png';
    bushes[2].onload = checkImagesLoaded;

    bushes[3].src = './assets/Terrain/Decorations/Bushes/Bushe4.png';
    bushes[3].onload = checkImagesLoaded;

    // Load staticRock sprites (types 1-4)
    staticRocks[0].src = './assets/Terrain/Decorations/Rocks/Rock1.png';
    staticRocks[0].onload = checkImagesLoaded;

    staticRocks[1].src = './assets/Terrain/Decorations/Rocks/Rock2.png';
    staticRocks[1].onload = checkImagesLoaded;

    staticRocks[2].src = './assets/Terrain/Decorations/Rocks/Rock3.png';
    staticRocks[2].onload = checkImagesLoaded;

    staticRocks[3].src = './assets/Terrain/Decorations/Rocks/Rock4.png';
    staticRocks[3].onload = checkImagesLoaded;

    // Load building sprites (type 1-8)
    buildings[0].src = './assets/Buildings/Blue Buildings/Archery.png';
    buildings[0].onload = checkImagesLoaded;

    buildings[1].src = './assets/Buildings/Blue Buildings/Barracks.png';
    buildings[1].onload = checkImagesLoaded;

    buildings[2].src = './assets/Buildings/Blue Buildings/Castle.png';
    buildings[2].onload = checkImagesLoaded;

    buildings[3].src = './assets/Buildings/Blue Buildings/House1.png';
    buildings[3].onload = checkImagesLoaded;

    buildings[4].src = './assets/Buildings/Blue Buildings/House2.png';
    buildings[4].onload = checkImagesLoaded;

    buildings[5].src = './assets/Buildings/Blue Buildings/House3.png';
    buildings[5].onload = checkImagesLoaded;

    buildings[6].src = './assets/Buildings/Blue Buildings/Monastery.png';
    buildings[6].onload = checkImagesLoaded;

    buildings[7].src = './assets/Buildings/Blue Buildings/Tower.png';
    buildings[7].onload = checkImagesLoaded;
})();
