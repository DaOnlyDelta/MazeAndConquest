/**
 * drawingUtils.js
 * Utility functions for drawing sprites and animated elements
 */

(function() {
    const { ctx, TILE_SOURCE_SIZE, TILE_DISPLAY_SIZE } = window.canvasConfig;
    const { waterImg, foamImg, shadow, rocks, bushes, staticRocks, buildings, trees, sheepIdle, sheepGrass, units } = window.levelAssets;
    const animState = window.animationState;

    // ==========================================================
    // Helper: Draw Tile Row
    // ==========================================================
    /**
     * Draws a row of tiles from a tileset image
     * @param {Image} img - The tileset image to draw from
     * @param {number} y - The row position in grid coordinates
     * @param {Array} tileConfigs - Array of tile configurations with optional sx, sy, x overrides
     */
    function drawTileRow(img, y, tileConfigs) {
        let x = 0;
        tileConfigs.forEach((config) => {
            if (config.x !== undefined) x = config.x;
            const sx = config.sx !== undefined ? config.sx : 0;
            const sy = config.sy !== undefined ? config.sy : 0;
            ctx.drawImage(
                img,
                sx * TILE_SOURCE_SIZE,
                sy * TILE_SOURCE_SIZE,
                TILE_SOURCE_SIZE,
                TILE_SOURCE_SIZE,
                x * TILE_DISPLAY_SIZE,
                y * TILE_DISPLAY_SIZE,
                TILE_DISPLAY_SIZE,
                TILE_DISPLAY_SIZE
            );
            x++;
        });
    }

    // ==========================================================
    // Animated Decorations: Water Foam
    // ==========================================================
    /**
     * Draws animated water foam sprites with staggered animation
     * @param {Image} img - Water foam tileset
     * @param {number} y - Row position
     * @param {Array} xPositions - Column positions for foam tiles
     */
    function drawWaterFoam(img, y, xPositions) {
        xPositions.forEach((x, index) => {
            const frameOffset = (index * 3) % animState.FOAM_TOTAL_FRAMES;
            const currentFrame = (animState.getFoamFrame() + frameOffset) % animState.FOAM_TOTAL_FRAMES;
            
            const sx = currentFrame * animState.FOAM_FRAME_WIDTH;
            const sy = 0;
            const dx = x * TILE_DISPLAY_SIZE;
            const dy = y * TILE_DISPLAY_SIZE;
            
            ctx.drawImage(img, sx, sy, animState.FOAM_FRAME_WIDTH, animState.FOAM_FRAME_HEIGHT, dx, dy, animState.FOAM_FRAME_WIDTH, animState.FOAM_FRAME_HEIGHT);
        });
    }

    // ==========================================================
    // Static Decorations: Shadow Tiles
    // ==========================================================
    /**
     * Draws static shadow tiles (used for depth)
     * @param {Image} img - Shadow tileset
     * @param {number} y - Row position
     * @param {Array} xPositions - Column positions for shadows
     */
    function drawShadow(img, y, xPositions) {
        xPositions.forEach((x) => {
            const dx = x * TILE_DISPLAY_SIZE;
            const dy = y * TILE_DISPLAY_SIZE;
            
            ctx.drawImage(img, 0, 0, animState.FOAM_FRAME_WIDTH, animState.FOAM_FRAME_HEIGHT, dx, dy, animState.FOAM_FRAME_WIDTH, animState.FOAM_FRAME_HEIGHT);
        });
    }

    // ==========================================================
    // Animated Decorations: Rocks in Water
    // ==========================================================
    /**
     * Draws animated rock decorations in water
     * @param {number} i - Rock type index (0-3)
     * @param {number} x - X position in grid coordinates
     * @param {number} y - Y position in grid coordinates
     */
    function drawRockInWater(i, x, y) {
        const img = rocks[i];
        const currentFrame = animState.getRockFrame() % animState.ROCK_TOTAL_FRAMES;
        
        const sx = currentFrame * animState.ROCK_FRAME_WIDTH;
        const sy = 0;
        const dx = x * TILE_DISPLAY_SIZE;
        const dy = y * TILE_DISPLAY_SIZE;
        
        ctx.drawImage(img, sx, sy, animState.ROCK_FRAME_WIDTH, animState.ROCK_FRAME_HEIGHT, dx, dy, TILE_DISPLAY_SIZE, TILE_DISPLAY_SIZE);
    }

    // ==========================================================
    // Static Decorations: Rocks on Ground
    // ==========================================================
    /**
     * Draws static rock decorations with optional horizontal flip
     * @param {number} i - Rock type index (0-3)
     * @param {number} x - X position in grid coordinates
     * @param {number} y - Y position in grid coordinates
     * @param {boolean} flip - Whether to flip horizontally
     */
    function drawStaticRock(i, x, y, flip = false) {
        const img = staticRocks[i];
        const dx = x * TILE_DISPLAY_SIZE;
        const dy = y * TILE_DISPLAY_SIZE;
        
        if (flip) {
            ctx.save();
            ctx.translate(dx + TILE_DISPLAY_SIZE / 2, dy + TILE_DISPLAY_SIZE / 2);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0, animState.ROCK_FRAME_WIDTH, animState.ROCK_FRAME_HEIGHT, -TILE_DISPLAY_SIZE / 2, -TILE_DISPLAY_SIZE / 2, TILE_DISPLAY_SIZE, TILE_DISPLAY_SIZE);
            ctx.restore();
        } else {
            ctx.drawImage(img, 0, 0, animState.ROCK_FRAME_WIDTH, animState.ROCK_FRAME_HEIGHT, dx, dy, TILE_DISPLAY_SIZE, TILE_DISPLAY_SIZE);
        }
    }

    // ==========================================================
    // Animated Decorations: Bushes
    // ==========================================================
    /**
     * Draws animated bush decorations (128x128, occupies 2x2 tiles)
     * @param {number} i - Bush type index (0-3)
     * @param {number} x - X position in grid coordinates
     * @param {number} y - Y position in grid coordinates
     */
    function drawBush(i, x, y) {
        const img = bushes[i];
        const currentFrame = animState.getBushFrame() % animState.BUSH_TOTAL_FRAMES;
        
        const sx = currentFrame * animState.BUSH_FRAME_WIDTH;
        const sy = 0;
        const dx = x * TILE_DISPLAY_SIZE;
        const dy = y * TILE_DISPLAY_SIZE;
        
        ctx.drawImage(img, sx, sy, animState.BUSH_FRAME_WIDTH, animState.BUSH_FRAME_HEIGHT, dx, dy, animState.BUSH_FRAME_WIDTH, animState.BUSH_FRAME_HEIGHT);
    }

    // ==========================================================
    // Static Decorations: Buildings
    // ==========================================================
    /**
     * Draws building sprites with optional horizontal flip and height offset
     * @param {number} i - Building type index (0-7)
     * @param {number} x - X position in grid coordinates
     * @param {number} y - Y position in grid coordinates
     * @param {boolean} flip - Whether to flip horizontally
     */
    function drawBuilding(i, x, y, flip = false) {
        const img = buildings[i];
        const dx = x * TILE_DISPLAY_SIZE;
        const dy = y * TILE_DISPLAY_SIZE;
        
        if (flip) {
            ctx.save();
            ctx.translate(dx + TILE_DISPLAY_SIZE / 2, dy + TILE_DISPLAY_SIZE / 2);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0, img.width, img.height, -TILE_DISPLAY_SIZE / 2, -TILE_DISPLAY_SIZE / 2, img.width, img.height);
            ctx.restore();
        } else {
            ctx.drawImage(img, 0, 0, img.width, img.height, dx, dy - (img.height - TILE_DISPLAY_SIZE), img.width, img.height);
        }
    }

    // ==========================================================
    // Animated Decorations: Trees
    // ==========================================================
    /**
     * Draws animated tree sprites (192x256)
     * @param {number} i - Tree type index (0-3)
     * @param {number} x - X position in grid coordinates
     * @param {number} y - Y position in grid coordinates
     */
    function drawTree(i, x, y) {
        const img = trees[i];
        const currentFrame = animState.getTreeFrame() % animState.TREE_TOTAL_FRAMES;
        const sx = currentFrame * animState.TREE_FRAME_WIDTH;
        const sy = 0;
        const dx = x * TILE_DISPLAY_SIZE;
        const dy = y * TILE_DISPLAY_SIZE;

        ctx.drawImage(img, sx, sy, animState.TREE_FRAME_WIDTH, animState.TREE_FRAME_HEIGHT, dx, dy - (animState.TREE_FRAME_HEIGHT - TILE_DISPLAY_SIZE), animState.TREE_FRAME_WIDTH, animState.TREE_FRAME_HEIGHT);
    }

    // ==========================================================
    // Animated Resource: Sheep
    // ==========================================================
    /**
     * Draws animated sheep with cycling animations (idle -> grass -> idle -> ...)
     * Each sheep has its own independent cycle position based on id, so they
     * are evenly staggered across the full cycle - some will graze while others idle.
     * @param {number} x - X position in grid coordinates
     * @param {number} y - Y position in grid coordinates
     * @param {number} id - Sheep instance id (0+), used to stagger animation timing
     * @param {boolean} flip - Whether to flip horizontally
     */
    function drawSheep(x, y, id = 0, flip = false) {
        const total = 5; // Total number of sheep in the scene, used for staggering
        const dx = x * TILE_DISPLAY_SIZE;
        const dy = y * TILE_DISPLAY_SIZE;

        // Each sheep is positioned at a different point in the full cycle
        const tickOffset = Math.floor((id / total) * animState.SHEEP_FULL_CYCLE);
        const sheepTick = (animState.getSheepGlobalTick() + tickOffset) % animState.SHEEP_FULL_CYCLE;

        // Determine phase and frame from the per-sheep tick
        const idleSection = animState.SHEEP_CYCLE_IDLE_FRAMES * animState.SHEEP_IDLE_CYCLES_PER_GRASS_CYCLE;

        let img, sx, frameWidth, frameHeight;
        if (sheepTick < idleSection) {
            const currentFrame = Math.floor(sheepTick / animState.SHEEP_IDLE_ANIMATION_SPEED) % animState.SHEEP_IDLE_TOTAL_FRAMES;
            sx = currentFrame * animState.SHEEP_IDLE_FRAME_WIDTH;
            img = sheepIdle;
            frameWidth = animState.SHEEP_IDLE_FRAME_WIDTH;
            frameHeight = animState.SHEEP_IDLE_FRAME_HEIGHT;
        } else {
            const grassTick = sheepTick - idleSection;
            const currentFrame = Math.floor(grassTick / animState.SHEEPGRASS_ANIMATION_SPEED) % animState.SHEEPGRASS_TOTAL_FRAMES;
            sx = currentFrame * animState.SHEEPGRASS_FRAME_WIDTH;
            img = sheepGrass;
            frameWidth = animState.SHEEPGRASS_FRAME_WIDTH;
            frameHeight = animState.SHEEPGRASS_FRAME_HEIGHT;
        }

        if (flip) {
            ctx.save();
            ctx.translate(dx + TILE_DISPLAY_SIZE / 2, dy + TILE_DISPLAY_SIZE / 2);
            ctx.scale(-1, 1);
            ctx.drawImage(img, sx, 0, frameWidth, frameHeight, -TILE_DISPLAY_SIZE / 2, -TILE_DISPLAY_SIZE / 2, frameWidth, frameHeight);
            ctx.restore();
        } else {
            ctx.drawImage(img, sx, 0, frameWidth, frameHeight, dx, dy, frameWidth, frameHeight);
        }
    }

    // ==========================================================
    // Animated Resource: Units (Lancer, Warrior, Archer, Monk)
    // ==========================================================
    /**
     * Draws an animated unit sprite from a horizontal sprite sheet.
     * Each instance is staggered independently based on its id so units
     * don't all animate in lockstep.
     * @param {'lancer'|'warrior'|'archer'|'monk'} unitType - Which unit to draw
     * @param {number} x - X position in grid coordinates
     * @param {number} y - Y position in grid coordinates
     * @param {number} id - Unit instance id (0+), used to stagger animation timing
     * @param {number} total - Total number of this unit type in the scene, used for staggering
     * @param {boolean} flip - Whether to flip horizontally
     */
    function drawUnit(unitType, x, y, id = 0, total = 1, flip = false) {
        const configs = {
            lancer:  { img: units.lancer,  speed: animState.LANCER_ANIMATION_SPEED,  fw: animState.LANCER_FRAME_WIDTH,  fh: animState.LANCER_FRAME_HEIGHT,  frames: animState.LANCER_TOTAL_FRAMES },
            warrior: { img: units.warrior, speed: animState.WARRIOR_ANIMATION_SPEED, fw: animState.WARRIOR_FRAME_WIDTH, fh: animState.WARRIOR_FRAME_HEIGHT, frames: animState.WARRIOR_TOTAL_FRAMES },
            archer:  { img: units.archer,  speed: animState.ARCHER_ANIMATION_SPEED,  fw: animState.ARCHER_FRAME_WIDTH,  fh: animState.ARCHER_FRAME_HEIGHT,  frames: animState.ARCHER_TOTAL_FRAMES },
            monk:    { img: units.monk,    speed: animState.MONK_ANIMATION_SPEED,    fw: animState.MONK_FRAME_WIDTH,    fh: animState.MONK_FRAME_HEIGHT,    frames: animState.MONK_TOTAL_FRAMES },
        };

        const config = configs[unitType];

        // Each unit is offset by an equal fraction of the full cycle
        const fullCycle = config.frames * config.speed;
        const tickOffset = Math.floor((id / total) * fullCycle);
        const unitTick = (animState.getUnitGlobalTick() + tickOffset) % fullCycle;
        const currentFrame = Math.floor(unitTick / config.speed) % config.frames;
        const sx = currentFrame * config.fw;
        const dx = x * TILE_DISPLAY_SIZE;
        const dy = y * TILE_DISPLAY_SIZE;

        // Bottom-align the sprite to the unit's tile position
        const renderDy = dy - (config.fh - TILE_DISPLAY_SIZE);

        if (flip) {
            ctx.save();
            ctx.translate(dx + config.fw / 2, renderDy + config.fh / 2);
            ctx.scale(-1, 1);
            ctx.drawImage(config.img, sx, 0, config.fw, config.fh, -config.fw / 2, -config.fh / 2, config.fw, config.fh);
            ctx.restore();
        } else {
            ctx.drawImage(config.img, sx, 0, config.fw, config.fh, dx, renderDy, config.fw, config.fh);
        }
    }

    // ==========================================================
    // Player: draw the selected hero at their current grid position
    // ==========================================================
    /**
     * Draws the player's hero at their current grid position.
     * The sprite path is derived at runtime from window.selectedHero and
     * window.selectedColor so no assets need to be pre-loaded.
     * Images are cached by color:hero key so swapping heroes is seamless.
     * @param {boolean} flip - Whether to flip horizontally
     */
    const _playerImgCache = new Map();

    function _getPlayerImg(color, hero) {
        const key = `${color}:${hero}`;
        if (_playerImgCache.has(key)) return _playerImgCache.get(key);
        const entry = { img: new Image(), loaded: false };
        entry.img.onload  = () => { entry.loaded = true; };
        entry.img.onerror = () => { entry.loaded = false; };
        entry.img.src = `./assets/Units/${color} Units/${hero}/${hero}_Idle.png`;
        _playerImgCache.set(key, entry);
        return entry;
    }

    // Per-hero frame config (fw/fh/speed/frames).
    // Lancer uses 320px wide frames; everything else is 192px.
    const PLAYER_CONFIGS = {
        Warrior: { fw: 192, fh: 192, speed: animState.WARRIOR_ANIMATION_SPEED, frames: animState.WARRIOR_TOTAL_FRAMES },
        Lancer:  { fw: 320, fh: 320, speed: animState.LANCER_ANIMATION_SPEED,  frames: animState.LANCER_TOTAL_FRAMES  },
        Archer:  { fw: 192, fh: 192, speed: animState.ARCHER_ANIMATION_SPEED,  frames: animState.ARCHER_TOTAL_FRAMES  },
        Monk:    { fw: 192, fh: 192, speed: animState.MONK_ANIMATION_SPEED,    frames: animState.MONK_TOTAL_FRAMES    },
        Pawn:    { fw: 192, fh: 192, speed: animState.PAWN_ANIMATION_SPEED,    frames: animState.PAWN_TOTAL_FRAMES    },
    };

    const _playerRunImgCache = new Map();

    function _getPlayerRunImg(color, hero) {
        const key = `${color}:${hero}`;
        if (_playerRunImgCache.has(key)) return _playerRunImgCache.get(key);
        const entry = { img: new Image(), loaded: false };
        entry.img.onload  = () => { entry.loaded = true; };
        entry.img.onerror = () => { entry.loaded = false; };
        
        const config = PLAYER_RUN_CONFIGS[hero];
        if (config && config.src) {
            entry.img.src = config.src(color);
        } else {
            entry.img.src = `./assets/Units/${color} Units/${hero}/${hero}_Run.png`;
        }
        
        _playerRunImgCache.set(key, entry);
        return entry;
    }

    // Run animation configs (fill these out with correct values)
    const PLAYER_RUN_CONFIGS = {
        Warrior: { fw: 192, fh: 192, speed: 10, frames: 6, src: (color) => `./assets/Units/${color} Units/Warrior/Warrior_Run.png` },
        Lancer:  { fw: 320, fh: 320, speed: 10, frames: 6, src: (color) => `./assets/Units/${color} Units/Lancer/Lancer_Run.png` },
        Archer:  { fw: 192, fh: 192, speed: 10, frames: 4, src: (color) => `./assets/Units/${color} Units/Archer/Archer_Run.png` },
        Monk:    { fw: 192, fh: 192, speed: 10, frames: 4, src: (color) => `./assets/Units/${color} Units/Monk/Monk_Run.png` },
        Pawn:    { fw: 192, fh: 192, speed: 10, frames: 6, src: (color) => `./assets/Units/${color} Units/Pawn/Pawn_Run.png` },
    };

    function drawPlayer(flip = false) {
        const hero  = window.selectedHero  || 'Warrior';
        const color = window.selectedColor || 'Blue';
        const isMoving = window.player ? window.player.isMoving() : false;

        const entry = isMoving ? _getPlayerRunImg(color, hero) : _getPlayerImg(color, hero);
        if (!entry.loaded) return; // Still loading, skip this frame

        const config = isMoving ? PLAYER_RUN_CONFIGS[hero] : PLAYER_CONFIGS[hero];
        if (!config) return;

        const x = window.player ? window.player.getX() : 0;
        const y = window.player ? window.player.getY() : 0;
        const dir      = window.player ? window.player.getMoveDirection() : null;
        const progress = window.player ? window.player.getMoveProgress() : 0;

        // Interpolate visual position between current tile and destination tile
        let visualX = x;
        let visualY = y;
        if (dir === 'up')        visualY = y - progress;
        if (dir === 'down')      visualY = y + progress;
        if (dir === 'left')      visualX = x - progress;
        if (dir === 'right')     visualX = x + progress;
        if (dir === 'upleft')    { visualX = x - progress; visualY = y - progress; }
        if (dir === 'upright')   { visualX = x + progress; visualY = y - progress; }
        if (dir === 'downleft')  { visualX = x - progress; visualY = y + progress; }
        if (dir === 'downright') { visualX = x + progress; visualY = y + progress; }

        const fullCycle  = config.frames * config.speed;
        const currentFrame = Math.floor(animState.getPlayerGlobalTick() % fullCycle / config.speed);
        const sx       = currentFrame * config.fw;
        // Centre the sprite horizontally on the tile, and align the bottom of the sprite to the bottom of the tile
        const dx       = visualX * TILE_DISPLAY_SIZE - (config.fw - TILE_DISPLAY_SIZE) / 2;
        const dy       = visualY * TILE_DISPLAY_SIZE;
        const renderDy = dy - (config.fh - TILE_DISPLAY_SIZE) / 2 - 0.5 * TILE_DISPLAY_SIZE;

        if (flip) {
            ctx.save();
            ctx.translate(dx + config.fw / 2, renderDy + config.fh / 2);
            ctx.scale(-1, 1);
            ctx.drawImage(entry.img, sx, 0, config.fw, config.fh, -config.fw / 2, -config.fh / 2, config.fw, config.fh);
            ctx.restore();
        } else {
            ctx.drawImage(entry.img, sx, 0, config.fw, config.fh, dx, renderDy, config.fw, config.fh);
        }
    }

    // ==========================================================
    // Export Drawing Utilities
    // ==========================================================
    window.drawingUtils = {
        drawTileRow,
        drawWaterFoam,
        drawShadow,
        drawRockInWater,
        drawStaticRock,
        drawBush,
        drawBuilding,
        drawTree,
        drawSheep,
        drawUnit,
        drawPlayer
    };
})();
