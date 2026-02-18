/**
 * assets.js
 * Manages loading all image assets for the level scene
 */

(function() {
    // ==========================================================
    // Image Asset Declarations
    // ==========================================================
    const waterImg = new Image();
    const g5 = new Image();
    const g3 = new Image();
    const g2 = new Image();
    const g1 = new Image();
    const foamImg = new Image();
    const shadow = new Image();
    
    // Decoration sprite arrays (indexed by type)
    const rocks = [new Image(), new Image(), new Image(), new Image()];
    const bushes = [new Image(), new Image(), new Image(), new Image()];
    const staticRocks = [new Image(), new Image(), new Image(), new Image()];
    const buildings = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
    const trees = [new Image(), new Image(), new Image(), new Image()];
    const stumps = [new Image(), new Image(), new Image(), new Image()];
    const units = {
        lancer: new Image(),
        warrior: new Image(),
        archer: new Image(),
        monk: new Image()
    };
    
    // Sheep animation sprites
    const sheepIdle = new Image();
    const sheepGrass = new Image();

    // ==========================================================
    // Image Loading Management
    // ==========================================================
    let imagesLoaded = 0;
    const TOTAL_IMAGES = 41; // 7 base + 4 rocks + 4 bushes + 4 static rocks + 8 buildings + 4 trees + 4 stumps + 2 sheep + 4 unit sprites

    function checkImagesLoaded() {
        imagesLoaded++;
        if (imagesLoaded === TOTAL_IMAGES) {
            // All images loaded, trigger animation start
            window.dispatchEvent(new CustomEvent('assetsLoaded'));
        }
    }

    // ==========================================================
    // Load Tileset Images
    // ==========================================================
    waterImg.src = './assets/Terrain/Tileset/Water Background color.png';
    waterImg.onload = checkImagesLoaded;
    
    g5.src = './assets/Terrain/Tileset/Tilemap_color5.png';
    g5.onload = checkImagesLoaded;
    
    g3.src = './assets/Terrain/Tileset/Tilemap_color3.png';
    g3.onload = checkImagesLoaded;
    
    g2.src = './assets/Terrain/Tileset/Tilemap_color2.png';
    g2.onload = checkImagesLoaded;
    
    g1.src = './assets/Terrain/Tileset/Tilemap_color1.png';
    g1.onload = checkImagesLoaded;
    
    foamImg.src = './assets/Terrain/Tileset/Water Foam.png';
    foamImg.onload = checkImagesLoaded;
    
    shadow.src = './assets/Terrain/Tileset/Shadow.png';
    shadow.onload = checkImagesLoaded;

    // ==========================================================
    // Load Water Rock Sprites (animated decorations)
    // ==========================================================
    rocks[0].src = './assets/Terrain/Decorations/Rocks in the Water/Water Rocks_01.png';
    rocks[0].onload = checkImagesLoaded;
    rocks[1].src = './assets/Terrain/Decorations/Rocks in the Water/Water Rocks_02.png';
    rocks[1].onload = checkImagesLoaded;
    rocks[2].src = './assets/Terrain/Decorations/Rocks in the Water/Water Rocks_03.png';
    rocks[2].onload = checkImagesLoaded;
    rocks[3].src = './assets/Terrain/Decorations/Rocks in the Water/Water Rocks_04.png';
    rocks[3].onload = checkImagesLoaded;

    // ==========================================================
    // Load Bush Sprites (animated decorations)
    // ==========================================================
    bushes[0].src = './assets/Terrain/Decorations/Bushes/Bushe1.png';
    bushes[0].onload = checkImagesLoaded;
    bushes[1].src = './assets/Terrain/Decorations/Bushes/Bushe2.png';
    bushes[1].onload = checkImagesLoaded;
    bushes[2].src = './assets/Terrain/Decorations/Bushes/Bushe3.png';
    bushes[2].onload = checkImagesLoaded;
    bushes[3].src = './assets/Terrain/Decorations/Bushes/Bushe4.png';
    bushes[3].onload = checkImagesLoaded;

    // ==========================================================
    // Load Static Rock Sprites (non-animated decorations)
    // ==========================================================
    staticRocks[0].src = './assets/Terrain/Decorations/Rocks/Rock1.png';
    staticRocks[0].onload = checkImagesLoaded;
    staticRocks[1].src = './assets/Terrain/Decorations/Rocks/Rock2.png';
    staticRocks[1].onload = checkImagesLoaded;
    staticRocks[2].src = './assets/Terrain/Decorations/Rocks/Rock3.png';
    staticRocks[2].onload = checkImagesLoaded;
    staticRocks[3].src = './assets/Terrain/Decorations/Rocks/Rock4.png';
    staticRocks[3].onload = checkImagesLoaded;

    // ==========================================================
    // Load Unit Sprites
    // ==========================================================
    units.lancer.src = './assets/Units/Blue Units/Lancer/Lancer_Idle.png';
    units.lancer.onload = checkImagesLoaded;
    units.warrior.src = './assets/Units/Blue Units/Warrior/Warrior_Idle.png';
    units.warrior.onload = checkImagesLoaded;
    units.archer.src = './assets/Units/Blue Units/Archer/Archer_Idle.png';
    units.archer.onload = checkImagesLoaded;
    units.monk.src = './assets/Units/Blue Units/Monk/Monk_Idle.png';
    units.monk.onload = checkImagesLoaded;

    // ==========================================================
    // Load Building Sprites
    // ==========================================================
    buildings[0].src = './assets/Buildings/Blue Buildings/Archery.png';
    buildings[0].onload = checkImagesLoaded;
    buildings[1].src = './assets/Buildings/Blue Buildings/Barracks.png';
    buildings[1].onload = checkImagesLoaded;
    buildings[2].src = './assets/Buildings/Blue Buildings/Castle.png';
    buildings[2].onload = checkImagesLoaded;
    buildings[3].src = './assets/Buildings/Blue Buildings/House1.png';
    buildings[3].onload = checkImagesLoaded;
    buildings[4].src = './assets/Buildings/Blue Buildings/House2.png';
    buildings[4].onload = checkImagesLoaded;
    buildings[5].src = './assets/Buildings/Blue Buildings/House3.png';
    buildings[5].onload = checkImagesLoaded;
    buildings[6].src = './assets/Buildings/Blue Buildings/Monastery.png';
    buildings[6].onload = checkImagesLoaded;
    buildings[7].src = './assets/Buildings/Blue Buildings/Tower.png';
    buildings[7].onload = checkImagesLoaded;

    // ==========================================================
    // Load Tree Sprites (animated decorations)
    // ==========================================================
    trees[0].src = './assets/Terrain/Resources/Wood/Trees/Tree1.png';
    trees[0].onload = checkImagesLoaded;
    trees[1].src = './assets/Terrain/Resources/Wood/Trees/Tree2.png';
    trees[1].onload = checkImagesLoaded;
    trees[2].src = './assets/Terrain/Resources/Wood/Trees/Tree3.png';
    trees[2].onload = checkImagesLoaded;
    trees[3].src = './assets/Terrain/Resources/Wood/Trees/Tree4.png';
    trees[3].onload = checkImagesLoaded;

    // ==========================================================
    // Load Stump Sprites (cut tree remnants)
    // ==========================================================
    stumps[0].src = './assets/Terrain/Resources/Wood/Trees/Stump 1.png';
    stumps[0].onload = checkImagesLoaded;
    stumps[1].src = './assets/Terrain/Resources/Wood/Trees/Stump 2.png';
    stumps[1].onload = checkImagesLoaded;
    stumps[2].src = './assets/Terrain/Resources/Wood/Trees/Stump 3.png';
    stumps[2].onload = checkImagesLoaded;
    stumps[3].src = './assets/Terrain/Resources/Wood/Trees/Stump 4.png';
    stumps[3].onload = checkImagesLoaded;

    // ==========================================================
    // Load Sheep Sprites (animated resource)
    // ==========================================================
    sheepIdle.src = './assets/Terrain/Resources/Meat/Sheep/Sheep_idle.png';
    sheepIdle.onload = checkImagesLoaded;
    sheepGrass.src = './assets/Terrain/Resources/Meat/Sheep/Sheep_grass.png';
    sheepGrass.onload = checkImagesLoaded;

    // ==========================================================
    // Export Assets for use in other modules
    // ==========================================================
    window.levelAssets = {
        waterImg,
        g5, g3, g2, g1,
        foamImg,
        shadow,
        rocks,
        bushes,
        staticRocks,
        buildings,
        trees,
        stumps,
        sheepIdle,
        sheepGrass,
        units
    };
})();
