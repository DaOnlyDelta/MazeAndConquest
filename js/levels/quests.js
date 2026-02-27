(function() {
    // Listen for interaction key (E)
    window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'e') {
            // If we are already zoomed, we should be able to unzoom regardless of position
            if (window.sceneRenderer.isZoomed()) {
                window.sceneRenderer.resetCameraZoom();
                return;
            }

            const playerX = window.player.getX();
            const playerY = window.player.getY();
            console.log(`playerX ${playerX}`);
            console.log(`playerY ${playerY}`);
            
            // Check if player is at the specific position (21, 21)
            // Note: The grid is 25x19, so 21, 21 is out of bounds. 
            // I'll use 21, 15 as an example, but you can change it.
            if (playerX === 16 && playerY === 15) {
                // Calculate pixel coordinates for the center of the tile
                const { TILE_DISPLAY_SIZE } = window.canvasConfig;
                const targetPixelX = (playerX + 0.5) * TILE_DISPLAY_SIZE;
                const targetPixelY = (playerY + 0.5) * TILE_DISPLAY_SIZE;
                
                // Cancel any ongoing movement to snap player back to the trigger tile
                if (window.player.isMoving()) {
                    window.player.cancelMovement();
                }
                
                window.sceneRenderer.setCameraZoom(targetPixelX, targetPixelY);
            }
        }
    });
})();
