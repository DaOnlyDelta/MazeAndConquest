/**
 * sceneRenderer.js
 * Handles rendering of the complete level scene
 */

(function() {
    const { ctx, TILES_X, TILES_Y, TILE_DISPLAY_SIZE } = window.canvasConfig;
    const { waterImg, g5, g3, g2, g1 } = window.levelAssets;
    const { drawTileRow, drawWaterFoam, drawShadow, drawRockInWater, drawStaticRock, drawBush, drawBuilding, drawTree, drawSheep, drawUnit, drawPlayer } = window.drawingUtils;

    // ==========================================================
    // Main Scene Renderer
    // ==========================================================
    function drawScene() {
        // Clear canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Base water layer
        for (let row = 0; row < TILES_Y; row++) {
            for (let col = 0; col < TILES_X; col++) {
                ctx.drawImage(waterImg, 0, 0, 64, 64, col * TILE_DISPLAY_SIZE, row * TILE_DISPLAY_SIZE, TILE_DISPLAY_SIZE, TILE_DISPLAY_SIZE);
            }
        }

        // ==========================================================
        // Water Decorations
        // ==========================================================
        {
            drawWaterFoam(window.levelAssets.foamImg, 1, [ 13, 14, 15, 16, 17, 18, 19, 20, 21 ]);
            drawWaterFoam(window.levelAssets.foamImg, 2, [ 14, 22 ]);
            drawWaterFoam(window.levelAssets.foamImg, 3, [ 10, 11, 12, 13, 22 ]);
            drawWaterFoam(window.levelAssets.foamImg, 3, [ 22 ]);
            drawWaterFoam(window.levelAssets.foamImg, 4, [ 22 ]);
            drawWaterFoam(window.levelAssets.foamImg, 5, [ 0, 21, 22 ]);
            drawWaterFoam(window.levelAssets.foamImg, 6, [ 0, 20 ]);
            drawWaterFoam(window.levelAssets.foamImg, 7, [ 0 ]);
            drawWaterFoam(window.levelAssets.foamImg, 8, [ 1, 2 ]);
            drawWaterFoam(window.levelAssets.foamImg, 9, [ 3, 9, 10, 11, 22 ]);
            drawWaterFoam(window.levelAssets.foamImg, 10, [ 6, 7, 8, 12, 22 ]);
            drawWaterFoam(window.levelAssets.foamImg, 11, [ 0, 5, 11, 12, 22 ]);
            drawWaterFoam(window.levelAssets.foamImg, 12, [ 0, 5, 7, 11, 21 ]);
            drawWaterFoam(window.levelAssets.foamImg, 13, [ 0, 5, 6, 12 ]);
            drawWaterFoam(window.levelAssets.foamImg, 14, [ 0, 1, 2, 3, 4, 12, 13 ]);
            drawWaterFoam(window.levelAssets.foamImg, 15, [ 9, 10, 14, 15, 16, 17, 22 ]);
            drawWaterFoam(window.levelAssets.foamImg, 16, [ 1, 2, 3, 8, 9, 10, 18, 19, 20, 21 ]);
        }
        
        // ==========================================================
        // Animated Rocks in Water
        // ==========================================================
        {
            drawRockInWater(1, 13.8, 3);
            drawRockInWater(0, 0.5, 9);
            drawRockInWater(1, 0.7, 9.3);
            drawRockInWater(2, 10, 11);
            drawRockInWater(2, 23.8, 12.8);
            drawRockInWater(3, 23.5, 13.2);
            drawRockInWater(0, 5.8, 15.8);
            drawRockInWater(1, 13.9, 16.1);
            drawRockInWater(3, 0.8, 17.7);
            drawRockInWater(2, 18, 17.3);
            drawRockInWater(0, 17.7, 17);
        }

        // ==========================================================
        // Flat Ground Area
        // ==========================================================
        {
            // Y=10
            drawTileRow(g3, 10, [
                { x: 5, sx: 0, sy: 0 },
                { sx: 1, sy: 0 },
                { sx: 1, sy: 0 },
                { sx: 1, sy: 0 },
                { sx: 2, sy: 0 },
                { x: 14, sx: 0, sy: 0 },
                { sx: 1, sy: 0 },
                { sx: 1, sy: 0 }
            ]);

            // Y=11
            drawTileRow(g3, 11, [
                { x: 5, sx: 0, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 2 },
                { sx: 1, sy: 2 },
                { sx: 2, sy: 2 },
                { x: 14, sx: 0, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 }
            ]);

            // Y=12
            drawTileRow(g3, 12, [
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

            // Y=13
            drawTileRow(g3, 13, [
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

            // Y=14
            drawTileRow(g3, 14, [
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

            // Y=15
            drawTileRow(g3, 15, [
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

            // Y=16
            drawTileRow(g3, 16, [
                { x: 10, sx: 0, sy: 0 },
                { sx: 2, sy: 0 },
                { x: 19, sx: 0, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 2, sy: 2 }
            ]);

            // Y=17: bottom row
            drawTileRow(g3, 17, [
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

            // Y=16
            drawTileRow(g3, 16, [
                { x: 10, sx: 0, sy: 0 },
                { sx: 2, sy: 0 },
                { x: 19, sx: 0, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 2, sy: 2 }
            ]);

            // Y=15
            drawTileRow(g3, 15, [
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

            // Y=14
            drawTileRow(g3, 14, [
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

            // Y=13
            drawTileRow(g3, 13, [
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

            // Y=12
            drawTileRow(g3, 12, [
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

            // Y=11
            drawTileRow(g3, 11, [
                { x: 5, sx: 0, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 2 },
                { sx: 1, sy: 2 },
                { sx: 2, sy: 2 },
                { x: 14, sx: 0, sy: 1 },
                { sx: 1, sy: 1 },
                { sx: 1, sy: 1 }
            ]);

        }

        // ==========================================================
        // Flat Ground Shadows
        // ==========================================================
        {
            drawShadow(window.levelAssets.shadow, 9, [ 5, 6, 7, 8, 14, 15 ]);
            drawShadow(window.levelAssets.shadow, 10, [ 4, 13, 15 ]);
            drawShadow(window.levelAssets.shadow, 11, [ 1, 4, 13, 16, 17 ]);
            drawShadow(window.levelAssets.shadow, 12, [ 1, 2, 3, 4, 18 ]);
            drawShadow(window.levelAssets.shadow, 14, [ 20 ]);
            drawShadow(window.levelAssets.shadow, 15, [ 18, 19, 20 ]);
        }

        // ==========================================================
        // Background Trees
        // ==========================================================
        {
            drawTree(3, 21.57, 16.35);
            drawTree(2, 21, 16.9);
        }

        // ==========================================================
        // Forest Area (Middle-right grassland)
        // ==========================================================
        {
            // Y=2
            drawTileRow(g5, 2, [
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

            // Y=3
            drawTileRow(g5, 3, [
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

            // Y=4
            drawTileRow(g5, 4, [
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

            // Y=5
            drawTileRow(g5, 5, [
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
                { sx: 1, sy: 2 },
                { sx: 2, sy: 2 }
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
                { sx: 2, sy: 1 }
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
                { sx: 1, sy: 2 },
                { sx: 2, sy: 2 }
            ]);

            // Y=5
            drawTileRow(g5, 5, [
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

            // Y=4
            drawTileRow(g5, 4, [
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

            // Y=3
            drawTileRow(g5, 3, [
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

        }

        // ==========================================================
        // Forest Area Shadows
        // ==========================================================
        {
            drawShadow(window.levelAssets.shadow, 5, [ 13, 14 ]);
            drawShadow(window.levelAssets.shadow, 6, [ 13 ]);
        }

        // ==========================================================
        // Forest Trees
        // ==========================================================
        {
            drawTree(0, 13.9, 2.4);
            drawTree(0, 15.5, 3);
            drawTree(1, 21.5, 3);
            drawTree(0, 18.4, 3.5);
            drawTree(1, 14.6, 3.5);
            drawTree(1, 10.6, 4.3);
            drawTree(0, 21.7, 6);
            drawTree(0, 19.8, 6.6);
            drawTree(1, 19, 7.6);
        }

        // Draw player behind elevated ground when on ground layer
        if (window.grid.getCurrentLayer() === 0) {
            drawPlayer(window.player.flipped());
        }

        // ==========================================================
        // Elevated Ground
        // ==========================================================
        {
            // Y=4
            drawTileRow(g1, 4, [
                { x: 2, sx: 5, sy: 0 },
                { sx: 6, sy: 0 }
            ]);

            // Y=5
            drawTileRow(g1, 5, [
                { x: 1, sx: 5, sy: 0 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { x: 11, sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 3 },
                { sx: 7, sy: 3 }
            ]);

            // Y=6
            drawTileRow(g1, 6, [
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

            // Y=7
            drawTileRow(g1, 7, [
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

            // Y=8
            drawTileRow(g1, 8, [
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

            // Y=9
            drawTileRow(g1, 9, [
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

            // Y=10
            drawTileRow(g1, 10, [
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

            // Y=11
            drawTileRow(g1, 11, [
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

            // Y=12
            drawTileRow(g1, 12, [
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

            // Y=13
            drawTileRow(g1, 13, [
                { x: 2, sx: 5, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 3, sy: 5 },
                { x: 19, sx: 5, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 7, sy: 1 },
                { sx: 7, sy: 5 }
            ]);

            // Y=14
            drawTileRow(g1, 14, [
                { x: 17, sx: 0, sy: 4 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 7, sy: 1 }
            ]);

            // Y=15
            drawTileRow(g1, 15, [
                { x: 15, sx: 5, sy: 3 },
                { sx: 6, sy: 3 },
                { x: 17, sx: 0, sy: 5 },
                { x: 17, sx: 6, sy: 3 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 7, sy: 2 }
            ]);

            // Y=16
            drawTileRow(g1, 16, [
                { x: 15, sx: 5, sy: 5 },
                { sx: 6, sy: 5 },
                { sx: 6, sy: 5 },
                { sx: 6, sy: 5 },
                { sx: 6, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 7, sy: 4 }
            ]);
            
            // Y=14
            drawTileRow(g1, 14, [
                { x: 17, sx: 0, sy: 4 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 7, sy: 1 }
            ]);
            
            // Y=15
            drawTileRow(g1, 15, [
                { x: 15, sx: 5, sy: 3 },
                { sx: 6, sy: 3 },
                { x: 17, sx: 0, sy: 5 },
                { x: 17, sx: 6, sy: 3 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 7, sy: 2 }
            ]);
            
            // Y=13
            drawTileRow(g1, 13, [
                { x: 2, sx: 5, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 3, sy: 5 },
                { x: 19, sx: 5, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 7, sy: 1 },
                { sx: 7, sy: 5 }
            ]);

            // Y=12
            drawTileRow(g1, 12, [
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

            // Y=11
            drawTileRow(g1, 11, [
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

            // Y=10
            drawTileRow(g1, 10, [
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

            // Y=9
            drawTileRow(g1, 9, [
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

            // Y=8
            drawTileRow(g1, 8, [
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

            // Y=7
            drawTileRow(g1, 7, [
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

            // Y=6
            drawTileRow(g1, 6, [
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

            // Y=5
            drawTileRow(g1, 5, [
                { x: 1, sx: 5, sy: 0 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { x: 11, sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 3 },
                { sx: 7, sy: 3 }
            ]);

        }

        // ==========================================================
        // Flat Ground Trees
        // ==========================================================
        {
            drawTree(2, 1, 4.9);
            drawTree(2, 0, 6.3);
            drawTree(3, 0.55, 6.5);
            drawTree(2, 19.6, 14.7);
            drawTree(2, 18.9, 15.7);
            drawTree(3, 19.9, 16);
        }

        // ==========================================================
        // Flat Ground Buildings
        // ==========================================================
        {
            drawBuilding(7, 10, 17);
            drawBuilding(4, 16.4, 13.3);
        }

        // ==========================================================
        // Flat Ground Rocks (Static)
        // ==========================================================
        {
            drawStaticRock(0, 19.02, 16.8);
            drawStaticRock(3, 19.2, 16.5, true);
            drawStaticRock(3, 4.3, 13.5, true);
            drawStaticRock(3, 8.8, 10.5);
            drawStaticRock(0, 8.3, 10.7);
            drawStaticRock(2, 14.75, 10.5);
            drawStaticRock(2, 3.1, 7.5);
            drawStaticRock(1, 1, 5.5);
        }

        // ==========================================================
        // Forest Area Rocks
        // ==========================================================
        {
            drawStaticRock(1, 15.1, 6.4, true);
        }

        // ==========================================================
        // Ground Level Bushes
        // ==========================================================
        {
            drawBush(3, 3.5, 16.5);
            drawBush(0, 2.5, 16.5);
            drawBush(1, 3.1, 16.25);
            drawBush(1, 21.7, 15.7);
            drawBush(0, 22.2, 15.4);
            drawBush(1, 0.65, 13.5);
            drawBush(2, 1.65, 13.5);
            drawBush(0, 1.1, 13.1);
            drawBush(3, 15.4, 12.8);
            drawBush(1, 17.1, 12.7);
            drawBush(0, 13.4, 12.3);
            drawBush(1, 13.9, 12);
            drawBush(3, 0.5, 11.7);
        }

        // ==========================================================
        // Elevated Ground Shadows
        // ==========================================================
        {
            drawShadow(window.levelAssets.shadow, 3, [ 2 ]);
            drawShadow(window.levelAssets.shadow, 4, [ 2, 10 ]);
            drawShadow(window.levelAssets.shadow, 5, [ 2, 8, 9, 10 ]);
            drawShadow(window.levelAssets.shadow, 6, [ 1, 2, 7 ]);
            drawShadow(window.levelAssets.shadow, 7, [ 3, 4, 5, 6, 7, 8 ]);
        }

        // ==========================================================
        // Elevated Ground Buildings
        // ==========================================================
        {
            drawBuilding(7, 2, 12);
            drawBuilding(3, 18.9, 9.9);
            drawBuilding(5, 21.15, 9);
            drawBuilding(4, 21.4, 8.7, true);
            drawBuilding(3, 17, 8.65);
        }

        // ==========================================================
        // Middle Elevated Ground (Platform in middle-left)
        // ==========================================================
        {
            // Y=3
            drawTileRow(g2, 3, [
                { x: 3, sx: 5, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 7, sy: 0 }
            ]);

            // Y=4
            drawTileRow(g2, 4, [
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

             // Y=5
             drawTileRow(g2, 5, [
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

            // Y=6
            drawTileRow(g2, 6, [
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

            // Y=7
            drawTileRow(g2, 7, [
                { x: 2, sx: 5, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 5, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 3, sy: 4 }
             ]);

            // Y=8
            drawTileRow(g2, 8, [
                { x: 4, sx: 5, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 3, sy: 5 }
            ]);

            // Y=7
            drawTileRow(g2, 7, [
                { x: 2, sx: 5, sy: 4 },
                { sx: 6, sy: 4 },
                { sx: 5, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 6, sy: 2 },
                { sx: 3, sy: 4 }
             ]);

            // Y=6
            drawTileRow(g2, 6, [
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

             // Y=5
             drawTileRow(g2, 5, [
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

             // Y=4
            drawTileRow(g2, 4, [
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

        }

        // ==========================================================
        // Middle Elevated Ground Trees
        // ==========================================================
        {
            drawTree(3, 6.8, 4);
            drawTree(2, 1.5, 8.9);
            drawTree(3, 3.8, 9.6);
            drawTree(2, 3.3, 10);
        }

        // ==========================================================
        // Middle Elevated Ground Bushes
        // ==========================================================
        {
            drawBush(3, 20.4, 10.5);
            drawBush(1, 4.6, 8.3);
        }

        // ==========================================================
        // Middle Elevated Ground Building
        // ==========================================================
        {
            drawBuilding(2, 3, 4);
        }

        // ==========================================================
        // Draw Sheep
        // ==========================================================
        {
            drawSheep(18.7, 14.3, 4);
            drawSheep(13.2, 11.8, 3, true);
            drawSheep(22.2, 9.2, 2);
            drawSheep(18.2, 9, 1, true);
            drawSheep(16.4, 8.4, 0);
        }

        // ==========================================================
        // Draw Units
        // ==========================================================
        {
            const totalUnits = 12;
            drawUnit('monk', 14.3, 15.6, 1, totalUnits);
            drawUnit('archer', 9.5, 15.6, 0, totalUnits, true);
            drawUnit('archer', 1.5, 10.6, 2, totalUnits);
            drawUnit('warrior', 9.8, 9.1, 3, totalUnits);
            drawUnit('warrior', 10.6, 8.4, 4, totalUnits);
            drawUnit('lancer', 4.6, 8.2, 5, totalUnits);
            drawUnit('lancer', 5.2, 7.8, 6, totalUnits);
            drawUnit('lancer', 7.7, 6.5, 7, totalUnits);
            drawUnit('lancer', 8.6, 5.9, 8, totalUnits);
            drawUnit('lancer', 7.4, 5.6, 9, totalUnits);
            drawUnit('archer', 4.3, 2.9, 10, totalUnits);
            drawUnit('archer', 2.5, 2.6, 11, totalUnits, true);
        }

        // ==========================================================
        // Draw Player
        // ==========================================================
        if (window.grid.getCurrentLayer() !== 0) {
            drawPlayer(window.player.flipped());
        }
    }

    // Export the scene renderer
    window.sceneRenderer = {
        drawScene
    };
})();
