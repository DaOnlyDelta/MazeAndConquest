/**
 * canvasConfig.js
 * Handles canvas initialization and basic configuration
 */

(function() {
    // ==========================================================
    // Canvas Setup
    // ==========================================================
    const canvas = document.getElementById('levelCanvas');
    const ctx = canvas.getContext('2d');
    
    // Tile grid configuration
    const TILES_X = 25;
    const TILES_Y = 19;
    const TILE_SOURCE_SIZE = 64;  // Size of tiles in source images
    const TILE_DISPLAY_SIZE = 64; // Size of tiles on canvas

    // Set canvas dimensions to exactly fit the tile grid
    canvas.width = TILES_X * TILE_DISPLAY_SIZE;
    canvas.height = TILES_Y * TILE_DISPLAY_SIZE;

    // Export configuration for use in other modules
    window.canvasConfig = {
        canvas,
        ctx,
        TILES_X,
        TILES_Y,
        TILE_SOURCE_SIZE,
        TILE_DISPLAY_SIZE
    };
})();
