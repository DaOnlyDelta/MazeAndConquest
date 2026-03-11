/**
 * animationLoop.js
 * Main requestAnimationFrame loop. Updates animations, player position, and scene
 * rendering each frame. Supports registering per-frame tick callbacks.
 */
(function() {
    let lastTimestamp = null;
    const tickCallbacks = [];

    function registerTick(fn) {
        tickCallbacks.push(fn);
    }

    // ==========================================================
    // Animation Loop
    // ==========================================================
    function animate(timestamp) {
        const deltaTime = lastTimestamp === null ? 0 : timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        window.animationState.updateAnimationFrames();
        window.player.updatePosition(deltaTime);
        window.sceneRenderer.drawScene();

        tickCallbacks.forEach(fn => fn());

        requestAnimationFrame(animate);
    }

    // ==========================================================
    // Initialization
    // ==========================================================
    window.addEventListener('assetsLoaded', () => {
        animate();
    });

    window.animationLoop = {
        animate,
        registerTick
    };
})();
