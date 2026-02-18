/**
 * animationState.js
 * Manages animation frame counters and state for all animated sprites
 */

(function() {
    // ==========================================================
    // Water Foam Animation
    // ==========================================================
    let foamAnimationFrame = 0;
    const FOAM_ANIMATION_SPEED = 10; // Higher = slower animation
    let foamFrameCounter = 0;
    const FOAM_FRAME_WIDTH = 192;
    const FOAM_FRAME_HEIGHT = 192;
    const FOAM_TOTAL_FRAMES = 16;

    // ==========================================================
    // Water Rock Animation
    // ==========================================================
    let rockAnimationFrame = 0;
    const ROCK_ANIMATION_SPEED = 10;
    let rockFrameCounter = 0;
    const ROCK_FRAME_WIDTH = 64;
    const ROCK_FRAME_HEIGHT = 64;
    const ROCK_TOTAL_FRAMES = 16;

    // ==========================================================
    // Bush Animation
    // ==========================================================
    let bushAnimationFrame = 0;
    const BUSH_ANIMATION_SPEED = 15;
    let bushFrameCounter = 0;
    const BUSH_FRAME_WIDTH = 128;
    const BUSH_FRAME_HEIGHT = 128;
    const BUSH_TOTAL_FRAMES = 8;

    // ==========================================================
    // Tree Animation
    // ==========================================================
    let treeAnimationFrame = 0;
    const TREE_ANIMATION_SPEED = 15;
    let treeFrameCounter = 0;
    const TREE_FRAME_WIDTH = 192;
    const TREE_FRAME_HEIGHT = 256;
    const TREE_TOTAL_FRAMES = 8;

    // ==========================================================
    // Sheep.idle Animation
    // ==========================================================
    let sheepIdleAnimationFrame = 0;
    const SHEEP_IDLE_ANIMATION_SPEED = 15;
    let sheepIdleFrameCounter = 0;
    const SHEEP_IDLE_FRAME_WIDTH = 128;
    const SHEEP_IDLE_FRAME_HEIGHT = 128;
    const SHEEP_IDLE_TOTAL_FRAMES = 6;

    // ==========================================================
    // Sheep.grass Animation
    // ==========================================================
    let sheepGrassAnimationFrame = 0;
    const SHEEPGRASS_ANIMATION_SPEED = 15;
    let sheepGrassFrameCounter = 0;
    const SHEEPGRASS_FRAME_WIDTH = 128;
    const SHEEPGRASS_FRAME_HEIGHT = 128;
    const SHEEPGRASS_TOTAL_FRAMES = 12;

    // ==========================================================
    // Sheep Combined Animation Cycle
    // ==========================================================
    // Sheep cycle: multiple idle animations, then 1 grass animation, repeat
    // Adjust SHEEP_IDLE_CYCLES_PER_GRASS_CYCLE to control how many idle cycles play before grass
    const SHEEP_IDLE_CYCLES_PER_GRASS_CYCLE = 3; // Play idle this many times before grass
    let sheepCyclePhase = 'idle'; // 'idle' or 'grass'
    let sheepCycleFrameCounter = 0;
    let sheepIdleCycleCount = 0; // Tracks how many idle cycles have completed
    const SHEEP_CYCLE_IDLE_FRAMES = SHEEP_IDLE_TOTAL_FRAMES * SHEEP_IDLE_ANIMATION_SPEED;
    const SHEEP_CYCLE_GRASS_FRAMES = SHEEPGRASS_TOTAL_FRAMES * SHEEPGRASS_ANIMATION_SPEED;
    // Full cycle duration in ticks (N idle cycles + 1 grass cycle)
    const SHEEP_FULL_CYCLE = SHEEP_CYCLE_IDLE_FRAMES * SHEEP_IDLE_CYCLES_PER_GRASS_CYCLE + SHEEP_CYCLE_GRASS_FRAMES;
    let sheepGlobalTick = 0; // Raw tick used for per-sheep staggering

    let unitGlobalTick = 0; // Raw tick used for per-unit staggering

    // ==========================================================
    // Lancer Animation
    // ==========================================================
    let lancerAnimationFrame = 0;
    const LANCER_ANIMATION_SPEED = 15;
    let lancerFrameCounter = 0;
    const LANCER_FRAME_WIDTH = 320;
    const LANCER_FRAME_HEIGHT = 320;
    const LANCER_TOTAL_FRAMES = 12;

    // ==========================================================
    // Warrior Animation
    // ==========================================================
    let warriorAnimationFrame = 0;
    const WARRIOR_ANIMATION_SPEED = 15;
    let warriorFrameCounter = 0;
    const WARRIOR_FRAME_WIDTH = 192;
    const WARRIOR_FRAME_HEIGHT = 192;
    const WARRIOR_TOTAL_FRAMES = 8;

    // ==========================================================
    // Archer Animation
    // ==========================================================
    let archerAnimationFrame = 0;
    const ARCHER_ANIMATION_SPEED = 20;
    let archerFrameCounter = 0;
    const ARCHER_FRAME_WIDTH = 192;
    const ARCHER_FRAME_HEIGHT = 192;
    const ARCHER_TOTAL_FRAMES = 6;

    // ==========================================================
    // Monk Animation
    // ==========================================================
    let monkAnimationFrame = 0;
    const MONK_ANIMATION_SPEED = 20;
    let monkFrameCounter = 0;
    const MONK_FRAME_WIDTH = 192;
    const MONK_FRAME_HEIGHT = 192;
    const MONK_TOTAL_FRAMES = 6;

    // ==========================================================
    // Pawn Animation
    // ==========================================================
    let pawnAnimationFrame = 0;
    const PAWN_ANIMATION_SPEED = 15;
    let pawnFrameCounter = 0;
    const PAWN_FRAME_WIDTH = 192;
    const PAWN_FRAME_HEIGHT = 192;
    const PAWN_TOTAL_FRAMES = 8;

    let playerGlobalTick = 0; // Raw tick used for the player unit animation

    // ==========================================================
    // Animation Update Functions
    // ==========================================================
    function updateAnimationFrames() {
        // Update water foam animation
        foamFrameCounter++;
        if (foamFrameCounter >= FOAM_ANIMATION_SPEED) {
            foamFrameCounter = 0;
            foamAnimationFrame = (foamAnimationFrame + 1) % FOAM_TOTAL_FRAMES;
        }

        // Update water rock animation
        rockFrameCounter++;
        if (rockFrameCounter >= ROCK_ANIMATION_SPEED) {
            rockFrameCounter = 0;
            rockAnimationFrame = (rockAnimationFrame + 1) % ROCK_TOTAL_FRAMES;
        }

        // Update bush animation
        bushFrameCounter++;
        if (bushFrameCounter >= BUSH_ANIMATION_SPEED) {
            bushFrameCounter = 0;
            bushAnimationFrame = (bushAnimationFrame + 1) % BUSH_TOTAL_FRAMES;
        }

        // Update tree animation
        treeFrameCounter++;
        if (treeFrameCounter >= TREE_ANIMATION_SPEED) {
            treeFrameCounter = 0;
            treeAnimationFrame = (treeAnimationFrame + 1) % TREE_TOTAL_FRAMES;
        }

        // Update sheep idle animation
        sheepIdleFrameCounter++;
        if (sheepIdleFrameCounter >= SHEEP_IDLE_ANIMATION_SPEED) {
            sheepIdleFrameCounter = 0;
            sheepIdleAnimationFrame = (sheepIdleAnimationFrame + 1) % SHEEP_IDLE_TOTAL_FRAMES;
        }

        // Update sheep grass animation
        sheepGrassFrameCounter++;
        if (sheepGrassFrameCounter >= SHEEPGRASS_ANIMATION_SPEED) {
            sheepGrassFrameCounter = 0;
            sheepGrassAnimationFrame = (sheepGrassAnimationFrame + 1) % SHEEPGRASS_TOTAL_FRAMES;
        }

        // Raw tick for per-sheep staggering
        sheepGlobalTick++;

        // Raw tick for per-unit staggering
        unitGlobalTick++;

        // Update sheep cycle phase (idle x N -> grass -> idle x N -> ...)
        sheepCycleFrameCounter++;
        if (sheepCyclePhase === 'idle' && sheepCycleFrameCounter >= SHEEP_CYCLE_IDLE_FRAMES) {
            sheepCycleFrameCounter = 0;
            sheepIdleCycleCount++;
            
            // Only switch to grass after N idle cycles
            if (sheepIdleCycleCount >= SHEEP_IDLE_CYCLES_PER_GRASS_CYCLE) {
                sheepCyclePhase = 'grass';
                sheepIdleCycleCount = 0;
                sheepGrassAnimationFrame = 0;
                sheepGrassFrameCounter = 0;
            } else {
                // Reset idle animation for next cycle
                sheepIdleAnimationFrame = 0;
                sheepIdleFrameCounter = 0;
            }
        } else if (sheepCyclePhase === 'grass' && sheepCycleFrameCounter >= SHEEP_CYCLE_GRASS_FRAMES) {
            sheepCycleFrameCounter = 0;
            sheepCyclePhase = 'idle';
            sheepIdleAnimationFrame = 0;
            sheepIdleFrameCounter = 0;
        }

        // Update lancer animation
        lancerFrameCounter++;
        if (lancerFrameCounter >= LANCER_ANIMATION_SPEED) {
            lancerFrameCounter = 0;
            lancerAnimationFrame = (lancerAnimationFrame + 1) % LANCER_TOTAL_FRAMES;
        }

        // Update warrior animation
        warriorFrameCounter++;
        if (warriorFrameCounter >= WARRIOR_ANIMATION_SPEED) {
            warriorFrameCounter = 0;
            warriorAnimationFrame = (warriorAnimationFrame + 1) % WARRIOR_TOTAL_FRAMES;
        }

        // Update archer animation
        archerFrameCounter++;
        if (archerFrameCounter >= ARCHER_ANIMATION_SPEED) {
            archerFrameCounter = 0;
            archerAnimationFrame = (archerAnimationFrame + 1) % ARCHER_TOTAL_FRAMES;
        }

        // Update monk animation
        monkFrameCounter++;
        if (monkFrameCounter >= MONK_ANIMATION_SPEED) {
            monkFrameCounter = 0;
            monkAnimationFrame = (monkAnimationFrame + 1) % MONK_TOTAL_FRAMES;
        }

        // Update pawn animation
        pawnFrameCounter++;
        if (pawnFrameCounter >= PAWN_ANIMATION_SPEED) {
            pawnFrameCounter = 0;
            pawnAnimationFrame = (pawnAnimationFrame + 1) % PAWN_TOTAL_FRAMES;
        }

        // Raw tick for player animation
        playerGlobalTick++;
    }

    // ==========================================================
    // Export Animation State and Functions
    // ==========================================================
    window.animationState = {
        // Getters for current animation frames
        getFoamFrame: () => foamAnimationFrame,
        getRockFrame: () => rockAnimationFrame,
        getBushFrame: () => bushAnimationFrame,
        getTreeFrame: () => treeAnimationFrame,
        getLancerFrame: () => lancerAnimationFrame,
        getWarriorFrame: () => warriorAnimationFrame,
        getArcherFrame: () => archerAnimationFrame,
        getSheepIdleFrame: () => sheepIdleAnimationFrame,
        getSheepGrassFrame: () => sheepGrassAnimationFrame,
        getSheepCyclePhase: () => sheepCyclePhase,
        getSheepGlobalTick: () => sheepGlobalTick,
        getUnitGlobalTick: () => unitGlobalTick,
        getPlayerGlobalTick: () => playerGlobalTick,

        // Frame dimensions
        FOAM_FRAME_WIDTH,
        FOAM_FRAME_HEIGHT,
        FOAM_TOTAL_FRAMES,
        ROCK_FRAME_WIDTH,
        ROCK_FRAME_HEIGHT,
        ROCK_TOTAL_FRAMES,
        BUSH_FRAME_WIDTH,
        BUSH_FRAME_HEIGHT,
        BUSH_TOTAL_FRAMES,
        TREE_FRAME_WIDTH,
        TREE_FRAME_HEIGHT,
        TREE_TOTAL_FRAMES,
        SHEEP_IDLE_FRAME_WIDTH,
        SHEEP_IDLE_FRAME_HEIGHT,
        SHEEP_IDLE_TOTAL_FRAMES,
        SHEEP_IDLE_ANIMATION_SPEED,
        SHEEPGRASS_FRAME_WIDTH,
        SHEEPGRASS_FRAME_HEIGHT,
        SHEEPGRASS_TOTAL_FRAMES,
        SHEEPGRASS_ANIMATION_SPEED,
        SHEEP_CYCLE_IDLE_FRAMES,
        SHEEP_CYCLE_GRASS_FRAMES,
        SHEEP_FULL_CYCLE,
        SHEEP_IDLE_CYCLES_PER_GRASS_CYCLE,
        LANCER_FRAME_WIDTH,
        LANCER_FRAME_HEIGHT,
        LANCER_TOTAL_FRAMES,
        LANCER_ANIMATION_SPEED,
        WARRIOR_FRAME_WIDTH,
        WARRIOR_FRAME_HEIGHT,
        WARRIOR_TOTAL_FRAMES,
        WARRIOR_ANIMATION_SPEED,
        ARCHER_FRAME_WIDTH,
        ARCHER_FRAME_HEIGHT,
        ARCHER_TOTAL_FRAMES,
        ARCHER_ANIMATION_SPEED,
        MONK_FRAME_WIDTH,
        MONK_FRAME_HEIGHT,
        MONK_TOTAL_FRAMES,
        MONK_ANIMATION_SPEED,
        PAWN_FRAME_WIDTH,
        PAWN_FRAME_HEIGHT,
        PAWN_TOTAL_FRAMES,
        PAWN_ANIMATION_SPEED,

        // Update function
        updateAnimationFrames
    };
})();
