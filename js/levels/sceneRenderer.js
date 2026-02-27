/**
 * sceneRenderer.js
 * Handles rendering of the complete level scene
 */

(function () {
    const { ctx, TILES_X, TILES_Y, TILE_DISPLAY_SIZE } = window.canvasConfig;
    const { waterImg, g5, g3, g2, g1 } = window.levelAssets;
    const { drawTileRow: drawTileRowBase, drawWaterFoam, drawShadow, drawRockInWater, drawStaticRock, drawBush, drawBuilding, drawTree, drawSheep, drawUnit, drawPlayer } = window.drawingUtils;

    // ==========================================================
    // Camera / Zoom
    // ==========================================================
    let cameraTargetX = null;
    let cameraTargetY = null;
    let isZoomEnabled = false;
    
    // Smooth zoom state
    let currentZoom = 1.0;
    let currentCameraX = 0;
    let currentCameraY = 0;

    function setCameraZoom(x, y) {
        cameraTargetX = x;
        cameraTargetY = y;
        isZoomEnabled = true;
    }

    function resetCameraZoom() {
        isZoomEnabled = false;
    }

    function isZoomed() {
        return isZoomEnabled;
    }

    // ==========================================================
    // Main Scene Renderer
    // ==========================================================
    function drawScene() {
        // Clear canvas
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();

        ctx.save();

        const targetZoom = isZoomEnabled ? 2.0 : 1.0;
        const zoomSpeed = 0.05; // Adjust this value to change zoom speed (0.01 to 0.1 is usually good)
        
        // Calculate the center of the canvas
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;

        // Smoothly interpolate zoom
        currentZoom += (targetZoom - currentZoom) * zoomSpeed;

        // Smoothly interpolate camera position
        if (isZoomEnabled) {
            currentCameraX += (cameraTargetX - currentCameraX) * zoomSpeed;
            currentCameraY += (cameraTargetY - currentCameraY) * zoomSpeed;
        } else {
            // When zooming out, move camera back to center
            currentCameraX += (centerX - currentCameraX) * zoomSpeed;
            currentCameraY += (centerY - currentCameraY) * zoomSpeed;
        }

        // Clamp camera position to prevent showing black borders
        const maxCameraX = ctx.canvas.width - (centerX / currentZoom);
        const minCameraX = centerX / currentZoom;
        const maxCameraY = ctx.canvas.height - (centerY / currentZoom);
        const minCameraY = centerY / currentZoom;

        let clampedCameraX = Math.max(minCameraX, Math.min(maxCameraX, currentCameraX));
        let clampedCameraY = Math.max(minCameraY, Math.min(maxCameraY, currentCameraY));

        // Apply transformations if we are zoomed in or currently zooming
        if (Math.abs(currentZoom - 1.0) > 0.01) {
            ctx.translate(centerX, centerY);
            ctx.scale(currentZoom, currentZoom);
            ctx.translate(-clampedCameraX, -clampedCameraY);
        }

        // Global sprite queue sorted by depth Y (larger Y draws in front).
        const sprites = [];

        // Ground tiles render immediately.
        const drawTileRow = drawTileRowBase;

        // Queue player once into global depth queue.
        {
            const _py = window.player ? window.player.getY() : 0;
            const _dir = window.player ? window.player.getMoveDirection() : null;
            const _prg = window.player ? window.player.getMoveProgress() : 0;
            let _vy = _py;
            if (_dir === 'down' || _dir === 'downleft' || _dir === 'downright') _vy = _py + _prg;
            if (_dir === 'up' || _dir === 'upleft' || _dir === 'upright') _vy = _py - _prg;
            sprites.push({ y: _vy, draw: () => drawPlayer(window.player.flipped()) });
        }

        // Base water layer
        // Draw slightly outside the bounds to prevent seams during sub-pixel rendering
        for (let row = -1; row <= TILES_Y; row++) {
            for (let col = -1; col <= TILES_X; col++) {
                // Use Math.floor/ceil to prevent sub-pixel gaps
                const drawX = Math.floor(col * TILE_DISPLAY_SIZE);
                const drawY = Math.floor(row * TILE_DISPLAY_SIZE);
                const drawSize = Math.ceil(TILE_DISPLAY_SIZE) + 1; // Add 1px overlap to hide seams
                
                ctx.drawImage(waterImg, 0, 0, 64, 64, drawX, drawY, drawSize, drawSize);
            }
        }

        // ==========================================================
        // Water Decorations
        // ==========================================================
        {
            drawWaterFoam(window.levelAssets.foamImg, 1, [13, 14, 15, 16, 17, 18, 19, 20, 21]);
            drawWaterFoam(window.levelAssets.foamImg, 2, [14, 22]);
            drawWaterFoam(window.levelAssets.foamImg, 3, [10, 11, 12, 13, 22]);
            drawWaterFoam(window.levelAssets.foamImg, 3, [22]);
            drawWaterFoam(window.levelAssets.foamImg, 4, [22]);
            drawWaterFoam(window.levelAssets.foamImg, 5, [0, 21, 22]);
            drawWaterFoam(window.levelAssets.foamImg, 6, [0, 20]);
            drawWaterFoam(window.levelAssets.foamImg, 7, [0]);
            drawWaterFoam(window.levelAssets.foamImg, 8, [1, 2]);
            drawWaterFoam(window.levelAssets.foamImg, 9, [3, 9, 10, 11, 22]);
            drawWaterFoam(window.levelAssets.foamImg, 10, [6, 7, 8, 12, 22]);
            drawWaterFoam(window.levelAssets.foamImg, 11, [0, 5, 11, 12, 22]);
            drawWaterFoam(window.levelAssets.foamImg, 12, [0, 5, 7, 11, 21]);
            drawWaterFoam(window.levelAssets.foamImg, 13, [0, 5, 6, 12, 13, 14, 15, 16, 17]);
            drawWaterFoam(window.levelAssets.foamImg, 14, [0, 1, 2, 3, 4, 21, 22]);
            drawWaterFoam(window.levelAssets.foamImg, 15, [9, 10, 14, 15, 16, 17, 22]);
            drawWaterFoam(window.levelAssets.foamImg, 16, [1, 2, 3, 8, 9, 10, 18, 19, 20, 21]);
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
                { x: 13, sx: 0, sy: 2 },
                { sx: 1, sy: 2 },
                { sx: 1, sy: 2 },
                { sx: 1, sy: 2 },
                { sx: 1, sy: 2 },
                { sx: 1, sy: 2 }
            ]);

            // Y=15
            drawTileRow(g3, 15, [
                { x: 1, sx: 0, sy: 2 },
                { sx: 1, sy: 2 },
                { sx: 1, sy: 2 },
                { sx: 1, sy: 2 },
                { sx: 2, sy: 2 },
                { x: 22, sx: 1, sy: 0 },
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
        }

        // ==========================================================
        // Flat Ground Shadows
        // ==========================================================
        {
            drawShadow(window.levelAssets.shadow, 9, [5, 6, 7, 8, 14, 15]);
            drawShadow(window.levelAssets.shadow, 10, [4, 13, 15]);
            drawShadow(window.levelAssets.shadow, 11, [1, 4, 13, 16, 17]);
            drawShadow(window.levelAssets.shadow, 12, [1, 2, 3, 4, 18]);
            drawShadow(window.levelAssets.shadow, 14, [20]);
            drawShadow(window.levelAssets.shadow, 15, [18, 19, 20]);
        }

        // ==========================================================
        // Background Trees
        // ==========================================================
        {
            drawTree(3, 21.57, 16.35);
            drawTree(2, 21, 16.9);
        }

        // ==========================================================
        // Forest Area
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
            drawShadow(window.levelAssets.shadow, 5, [13, 14]);
            drawShadow(window.levelAssets.shadow, 6, [13]);
        }

        // ==========================================================
        // Forest Trees
        // ==========================================================
        {
            sprites.push({ y: 2.4, draw: () => drawTree(0, 13.9, 2.4) });
            sprites.push({ y: 3, draw: () => drawTree(0, 15.5, 3) });
            sprites.push({ y: 3, draw: () => drawTree(1, 21.5, 3) });
            sprites.push({ y: 3.5, draw: () => drawTree(0, 18.4, 3.5) });
            sprites.push({ y: 3.5, draw: () => drawTree(1, 14.6, 3.5) });
            sprites.push({ y: 4.1, draw: () => drawTree(1, 10.6, 4.3) });
            sprites.push({ y: 6, draw: () => drawTree(0, 21.7, 6) });
            sprites.push({ y: 6.6, draw: () => drawTree(0, 19.8, 6.6) });
            sprites.push({ y: 7.1, draw: () => drawTree(1, 19, 7.6) });
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
                { x: 21, sx: 6, sy: 0 },
                { sx: 7, sy: 0 }
            ]);

            sprites.push({ y: 7.2, draw: () => drawTileRow(g1, 8, [{ x: 20, sx: 6, sy: 0 },]) }); // To fix forest tree g2 overlap

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
                { x: 19, sx: 5, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 7, sy: 1 }
            ]);

            // Y=15
            drawTileRow(g1, 15, [
                { x: 15, sx: 5, sy: 3 },
                { sx: 6, sy: 3 },
                { sx: 6, sy: 3 },
                { sx: 6, sy: 3 },
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
        }

        // ==========================================================
        // Elevated Ground Trees
        // ==========================================================
        {
            sprites.push({ y: 1, draw: () => drawTree(2, 1, 4.9) });
            sprites.push({ y: 2, draw: () => drawTree(2, 0, 6.3) });
            sprites.push({ y: 2.1, draw: () => drawTree(3, 0.55, 6.5) });
            sprites.push({ y: 14.7, draw: () => drawTree(2, 19.6, 14.7) });
            sprites.push({ y: 15.7, draw: () => drawTree(2, 18.9, 15.7) });
            sprites.push({ y: 16, draw: () => drawTree(3, 19.9, 16) });
        }

        // ==========================================================
        // Flat Ground Buildings
        // ==========================================================
        {
            sprites.push({ y: 17, draw: () => drawBuilding(7, 10, 17) });
            sprites.push({ y: 13.3, draw: () => drawBuilding(4, 16.4, 13.3) });
        }

        // ==========================================================
        // Flat Ground Rocks (Static)
        // ==========================================================
        {
            sprites.push({ y: 16.8, draw: () => drawStaticRock(0, 19.02, 16.8) });
            sprites.push({ y: 16.5, draw: () => drawStaticRock(3, 19.2, 16.5, true) });
            sprites.push({ y: 13.5, draw: () => drawStaticRock(3, 4.3, 13.5, true) });
            sprites.push({ y: 10.5, draw: () => drawStaticRock(3, 8.8, 10.5) });
            sprites.push({ y: 10.7, draw: () => drawStaticRock(0, 8.3, 10.7) });
            sprites.push({ y: 10.5, draw: () => drawStaticRock(2, 14.75, 10.5) });
            sprites.push({ y: 7.5, draw: () => drawStaticRock(2, 3.1, 7.5) });
            sprites.push({ y: 5.5, draw: () => drawStaticRock(1, 1, 5.5) });
        }

        // ==========================================================
        // Forest Area Rocks
        // ==========================================================
        {
            sprites.push({ y: 6.4, draw: () => drawStaticRock(1, 15.1, 6.4, true) });
        }

        // ==========================================================
        // Ground Level Bushes
        // ==========================================================
        {
            sprites.push({ y: 16.5, draw: () => drawBush(3, 3.5, 16.5) });
            sprites.push({ y: 16.5, draw: () => drawBush(0, 2.5, 16.5) });
            sprites.push({ y: 16.25, draw: () => drawBush(1, 3.1, 16.25) });
            sprites.push({ y: 15.7, draw: () => drawBush(1, 21.7, 15.7) });
            sprites.push({ y: 15.4, draw: () => drawBush(0, 22.2, 15.4) });
            sprites.push({ y: 13.5, draw: () => drawBush(1, 0.65, 13.5) });
            sprites.push({ y: 13.5, draw: () => drawBush(2, 1.65, 13.5) });
            sprites.push({ y: 13.1, draw: () => drawBush(0, 1.1, 13.1) });
            sprites.push({ y: 13.4, draw: () => drawBush(3, 15.4, 12.8) });
            sprites.push({ y: 13.4, draw: () => drawBush(1, 17.1, 12.7) });
            sprites.push({ y: 12.3, draw: () => drawBush(0, 13.4, 12.3) });
            sprites.push({ y: 12, draw: () => drawBush(1, 13.9, 12) });
            sprites.push({ y: 11.7, draw: () => drawBush(3, 0.5, 11.7) });
        }

        // ==========================================================
        // Elevated Ground Shadows
        // ==========================================================
        {
            drawShadow(window.levelAssets.shadow, 3, [2]);
            drawShadow(window.levelAssets.shadow, 4, [2, 10]);
            drawShadow(window.levelAssets.shadow, 5, [2, 8, 9, 10]);
            drawShadow(window.levelAssets.shadow, 6, [1, 2, 7]);
            drawShadow(window.levelAssets.shadow, 7, [3, 4, 5, 6, 7, 8]);
        }

        // ==========================================================
        // Elevated Ground Buildings
        // ==========================================================
        {
            sprites.push({ y: 12, draw: () => drawBuilding(7, 2, 12) });
            sprites.push({ y: 9, draw: () => drawBuilding(5, 21.15, 9) });
            sprites.push({ y: 8.9, draw: () => drawBuilding(3, 17.9, 8.9) });
            sprites.push({ y: 10.6, draw: () => drawBuilding(4, 21.5, 8.6, true) });
        }

        // ==========================================================
        // Middle Elevated Ground (Platform in middle-left)
        // ==========================================================
        {
            // Y=3
            drawTileRow(g2, 3, [
                { x: 4, sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 6, sy: 0 },
                { sx: 7, sy: 0 }
            ]);

            sprites.push({ y: 2,  draw: () => drawTileRow(g2, 3, [{ x: 3, sx: 5, sy: 0 }]) }); // To fix forest tree g2 overlap

            // Y=4
            drawTileRow(g2, 4, [
                { x: 3, sx: 5, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 },
                { sx: 6, sy: 1 }
            ]);

            sprites.push({ y: 4.2,  draw: () => drawTileRow(g2, 4, [{ x: 11,  sx: 7, sy: 0 }]) }); // To fix forest tree g2 overlap

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
                { sx: 6, sy: 2 },
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
        }

        // ==========================================================
        // Elevated Ground Trees
        // ==========================================================
        {
            sprites.push({ y: 3, draw: () => drawTree(3, 6.8, 4) });
            sprites.push({ y: 8.9, draw: () => drawTree(2, 1.5, 8.9) });
            sprites.push({ y: 8.1, draw: () => drawTree(3, 3.8, 9.6) });
            sprites.push({ y: 8.2, draw: () => drawTree(2, 3.3, 10) });
        }

        // ==========================================================
        // Elevated Ground Bushes
        // ==========================================================
        {
            sprites.push({ y: 10.7, draw: () => drawBush(3, 20.4, 10.5) });
            sprites.push({ y: 8.3, draw: () => drawBush(1, 4.6, 8.3) });
        }

        // ==========================================================
        // Elevated Ground 2 Building
        // ==========================================================
        {
            sprites.push({ y: 4, draw: () => drawBuilding(2, 3, 4) });
        }

        // ==========================================================
        // Draw Sheep
        // ==========================================================
        {
            sprites.push({ y: 14.3, draw: () => drawSheep(18.7, 14.3, 4) });
            sprites.push({ y: 11.8, draw: () => drawSheep(13.2, 11.8, 3, true) });
            sprites.push({ y: 9.2, draw: () => drawSheep(22.2, 9.2, 2) });
            sprites.push({ y: 9, draw: () => drawSheep(18.2, 9, 1, true) });
            sprites.push({ y: 8.4, draw: () => drawSheep(16.4, 8.4, 0) });
        }

        const totalUnits = 12;

        // ==========================================================
        // Draw Flat Ground Units
        // ==========================================================
        {
            sprites.push({ y: 15.6, draw: () => drawUnit('monk', 14.1, 15.6, 1, totalUnits) });
            sprites.push({ y: 17.6, draw: () => drawUnit('archer', 9.5, 15.6, 0, totalUnits, true) });
        }

        // ==========================================================
        // Draw Elevated Ground Units
        // ==========================================================
        {
            sprites.push({ y: 12.6, draw: () => drawUnit('archer', 1.5, 10.6, 2, totalUnits) });
        }

        // ==========================================================
        // Draw Elevated Ground 2 Units
        // ==========================================================
        {
            sprites.push({ y: 4.6, draw: () => drawUnit('archer', 2.5, 2.6, 11, totalUnits, true) });
            sprites.push({ y: 4.9, draw: () => drawUnit('archer', 4.3, 2.9, 10, totalUnits) });
            sprites.push({ y: 5.6, draw: () => drawUnit('lancer', 7.4, 5.6, 9, totalUnits) });
            sprites.push({ y: 5.9, draw: () => drawUnit('lancer', 8.6, 5.9, 8, totalUnits) });
            sprites.push({ y: 6.5, draw: () => drawUnit('lancer', 7.7, 6.5, 7, totalUnits) });
            sprites.push({ y: 6.8, draw: () => drawUnit('lancer', 5, 7.6, 6, totalUnits) });
            sprites.push({ y: 6.9, draw: () => drawUnit('lancer', 4.2, 8, 5, totalUnits) });
        }

        // Final flush: draw all sprites sorted by depth Y.
        sprites.sort((a, b) => a.y - b.y);
        sprites.forEach((sprite) => sprite.draw());

        ctx.restore();
    }

    // Export the scene renderer
    window.sceneRenderer = {
        drawScene,
        setCameraZoom,
        resetCameraZoom,
        isZoomed
    };
})();
