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
    let facingLeft = false; // Persisted horizontal facing when idle

    // Track currently pressed keys to allow continuous movement without OS key repeat delay
    const keysPressed = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false
    };

    function updateFacingFromDirection(direction) {
        if (!direction) return;
        if (direction.includes('left')) facingLeft = true;
        if (direction.includes('right')) facingLeft = false;
    }

    window.addEventListener('keydown', (e) => {
        if (keysPressed.hasOwnProperty(e.key)) {
            keysPressed[e.key] = true;
        }
    });

    window.addEventListener('keyup', (e) => {
        if (keysPressed.hasOwnProperty(e.key)) {
            keysPressed[e.key] = false;
        }
    });

    function tryStartMove() {
        if (isMoving) return;

        let newX = playerX;
        let newY = playerY;
        let attemptedDirection = null;

        if (keysPressed.ArrowUp) {
            newY--; attemptedDirection = 'up';
        } else if (keysPressed.ArrowDown) {
            newY++; attemptedDirection = 'down';
        } else if (keysPressed.ArrowLeft) {
            newX--; attemptedDirection = 'left';
        } else if (keysPressed.ArrowRight) {
            newX++; attemptedDirection = 'right';
        } else {
            return; // No movement keys pressed
        }

        moveDirection = attemptedDirection;
        updateFacingFromDirection(moveDirection);
        
        // Normal walkable tile
        if (window.grid.canMoveTo(playerX, playerY, Math.round(newX), Math.round(newY))) {
            isMoving = true;
            moveProgress = 0;
            return;
        }
        
        // Slope entry — skip the horizontal leg, snap to slope tile and play diagonal
        const slope = window.grid.getSlopeTransition(playerX, playerY, moveDirection);
        if (slope) {
            playerX = slope.slopeX;
            playerY = slope.slopeY;
            moveDirection = slope.diagDirection;
            updateFacingFromDirection(moveDirection);
            moveProgress = 0;
            isMoving = true;
        }
    }

    // Map a {dx, dy} offset to a direction string for sprite/interpolation purposes
    function offsetToDirection(dx, dy) {
        if (dx === -1 && dy === -1) return 'upleft';
        if (dx ===  1 && dy === -1) return 'upright';
        if (dx === -1 && dy ===  1) return 'downleft';
        if (dx ===  1 && dy ===  1) return 'downright';
        return null;
    }

    // Update player's position based on movement
    function updatePlayerPosition(deltaTime) {
        tryStartMove(); // Check for input every frame if not moving
        
        if (!isMoving) return;
        const moveSpeed = 1 / 250; // Complete one tile in ~250ms
        moveProgress += moveSpeed * deltaTime;
        if (moveProgress >= 1) {
            // Advance player grid position by one step in moveDirection
            switch(moveDirection) {
                case 'up':        playerY = Math.max(0, playerY - 1); break;
                case 'down':      playerY = Math.min(GRID_HEIGHT - 1, playerY + 1); break;
                case 'left':      playerX = Math.max(0, playerX - 1); break;
                case 'right':     playerX = Math.min(GRID_WIDTH - 1, playerX + 1); break;
                case 'upleft':    playerX = Math.max(0, playerX - 1); playerY = Math.max(0, playerY - 1); break;
                case 'upright':   playerX = Math.min(GRID_WIDTH - 1, playerX + 1); playerY = Math.max(0, playerY - 1); break;
                case 'downleft':  playerX = Math.max(0, playerX - 1); playerY = Math.min(GRID_HEIGHT - 1, playerY + 1); break;
                case 'downright': playerX = Math.min(GRID_WIDTH - 1, playerX + 1); playerY = Math.min(GRID_HEIGHT - 1, playerY + 1); break;
            }

            // Check for a slope transition on the tile we just landed on
            const { dx, dy } = window.grid.onEnterTile(playerX, playerY, moveDirection);
            if (dx !== 0 || dy !== 0) {
                // Animate the slope transition as a second move instead of teleporting
                moveDirection = offsetToDirection(dx, dy);
                updateFacingFromDirection(moveDirection);
                moveProgress = 0;
                // isMoving stays true — the second leg plays out next frames
            } else {
                isMoving = false;
                moveDirection = null;
                moveProgress = 0;
            }
        }
    }

    // Export player state and update function for use in other modules
    window.player = {
        getX: () => playerX,
        getY: () => playerY,
        isMoving: () => isMoving,
        flipped: () => facingLeft, // Persisted sprite flip direction
        getMoveDirection: () => moveDirection,
        getMoveProgress: () => moveProgress,
        updatePosition: updatePlayerPosition
    };
})();
