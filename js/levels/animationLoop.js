/**
 * animationLoop.js
 * Manages the main animation loop and continuous rendering
 */

(function() {
    let lastTimestamp = null;

    // ==========================================================
    // Animation Loop
    // ==========================================================
    /**
     * Main animation loop called 60 times per second
     * Updates animation frames and redraws the scene
     */
    function animate(timestamp) {
        // Compute delta time in milliseconds since last frame
        const deltaTime = lastTimestamp === null ? 0 : timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        // Update all active animation states
        window.animationState.updateAnimationFrames();

        // Update player position
        window.player.updatePosition(deltaTime);

        // Redraw the entire scene with updated frame data
        window.sceneRenderer.drawScene();

        // Request next frame from browser
        requestAnimationFrame(animate);
    }

    // ==========================================================
    // Initialization
    // ==========================================================
    // Listen for when all assets have finished loading
    window.addEventListener('assetsLoaded', () => {
        animate();
    });

    // Export animation loop functions
    window.animationLoop = {
        animate
    };
})();
