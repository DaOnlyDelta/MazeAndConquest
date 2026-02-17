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

    function drawScene() {
        imagesLoaded++;
        if (imagesLoaded !== 5) return; // Wait for all five images


        // Draw water background first
        for (let row = 0; row < tilesY; row++) {
            for (let col = 0; col < tilesX; col++) {
                ctx.drawImage(waterImg, 0, 0, tileS, tileS, col * displayS, row * displayS, displayS, displayS);
            }
        }

        // Draw the bottom most layer of grass
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

        // Draw the forest layer in the back
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
                { x: 13, sx: 1, sy: 1 },
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

        // Draw the next layer of grass, the layer that's on rocks, so sx += 5, since it's on rocks
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

        // Draw the top layer of grass
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

    waterImg.src = './assets/Terrain/Tileset/Water Background color.png';
    waterImg.onload = drawScene;

    g5.src = './assets/Terrain/Tileset/Tilemap_color5.png';
    g5.onload = drawScene;

    g3.src = './assets/Terrain/Tileset/Tilemap_color3.png';
    g3.onload = drawScene;

    g2.src = './assets/Terrain/Tileset/Tilemap_color2.png';
    g2.onload = drawScene;

    g1.src = './assets/Terrain/Tileset/Tilemap_color1.png';
    g1.onload = drawScene;
})();
