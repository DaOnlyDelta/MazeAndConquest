(function() {
    // The grid is 25x20, so we'll make a 2d array to represent the player's position on the grid
    // but to more accurately represent it, we'll make it so every tile has 4 sub-tiles (top-left, top-right, bottom-left, bottom-right) to allow for smoother movement and better collision detection
    const GRID_WIDTH = 25;
    const GRID_HEIGHT = 19;
    const SUBTILES_PER_TILE = 4;
    const SUBTILE_SIZE = 16; // Each subtile is 16x16 pixels (since our tiles are 64x64)

    // Player's position
    let playerX = 17;
    let playerY = 4;

    // Player's movement state
    let isMoving = false;
    let moveDirection = null; // 'up', 'down', 'left', 'right'
    let moveProgress = 0; // Progress of the current move (0 to 1)

    // Listen for keyboard input to move the player
    window.addEventListener('keydown', (e) => {
        if (isMoving) return; // Ignore input if already moving
        let newX = playerX;
        let newY = playerY;
        switch(e.key) {
            case 'ArrowUp':    newY--; moveDirection = 'up';    break;
            case 'ArrowDown':  newY++; moveDirection = 'down';  break;
            case 'ArrowLeft':  newX--; moveDirection = 'left';  break;
            case 'ArrowRight': newX++; moveDirection = 'right'; break;
            default: return; // Ignore any other keys
        }
        if (!window.grid.canMoveTo(playerX, playerY, Math.round(newX), Math.round(newY))) return; // Blocked
        isMoving = true;
        moveProgress = 0;
    });

    // Update player's position based on movement
    function updatePlayerPosition(deltaTime) {
        if (!isMoving) return;
        const moveSpeed = 0.005; // Speed of movement (adjust as needed)
        moveProgress += moveSpeed * deltaTime;
        if (moveProgress >= 1) {
            // Move is complete, update player's grid position
            switch(moveDirection) {
                case 'up':    playerY = Math.max(0, playerY - 1); break;
                case 'down':  playerY = Math.min(GRID_HEIGHT - 1, playerY + 1); break;
                case 'left':  playerX = Math.max(0, playerX - 1); break;
                case 'right': playerX = Math.min(GRID_WIDTH - 1, playerX + 1); break;
            }
            // Handle slope layer transitions — may adjust X and Y
            const { dx, dy } = window.grid.onEnterTile(playerX, playerY, moveDirection);
            playerX = Math.max(0, Math.min(GRID_WIDTH  - 1, playerX + dx));
            playerY = Math.max(0, Math.min(GRID_HEIGHT - 1, playerY + dy));
            isMoving = false;
            moveDirection = null;
            moveProgress = 0;
        }
    }

    // Export player state and update function for use in other modules
    window.player = {
        getX: () => playerX,
        getY: () => playerY,
        isMoving: () => isMoving,
        flipped: () => moveDirection === 'left', // For sprite flipping
        getMoveDirection: () => moveDirection,
        getMoveProgress: () => moveProgress,
        updatePosition: updatePlayerPosition
    };
})();
