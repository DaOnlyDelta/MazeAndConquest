// Customize screen controller.
// Responsibilities:
// - Render the table/paper UI
// - Manage hero + color single-select
// - Animate the selected unit idle sprite in the display
// - On hover, temporarily lift the display above the veil (but not the whole screen)

(function () {
    // ==========================================================
    // Screen elements + navigation
    // ==========================================================
    const customize = document.getElementById('customize');
    const mainMenu = document.getElementById('mainMenu');
    const table = document.getElementById('table');

    // Table background
    drawTable(table, 8, 6);

    const customizeBack = document.getElementById('customizeBack');
    customizeBack.addEventListener('click', () => {
        playSound('click2');
        backToMenu();
    });

    const confirm = document.getElementById('confirmCustomize');
    confirm.addEventListener('pointerenter', () => playSound('hover'));
    confirm.addEventListener('click', () => {
        playSound('click');

        // Expose selection for future gameplay screen.
        window.selectedHero = getSelectedHero();
        window.selectedColor = getSelectedColor();
        
        backToMenu();
    });

    function backToMenu() {
        transition(() => {
            customize.style.display = 'none';
            mainMenu.style.display = 'block';
        });
    }

    // ==========================================================
    // Unit sprite metadata
    // ==========================================================
    // Note: different idles can have different frame counts.
    // The animator derives frameCount at runtime via: image.naturalWidth / frameWidth.
    // IMPORTANT: order must match the DOM order of .heroSlot/.colorSlots in index.html.
    // heroSlots: Warrior, Lancer, Archer, Monk, Pawn
    // colorSlots: Blue, Red, Yellow, Purple, Black
    const UNIT_HEROES = ['Warrior', 'Lancer', 'Archer', 'Monk', 'Pawn'];
    const UNIT_COLORS = ['Blue', 'Red', 'Yellow', 'Purple', 'Black'];

    window.selectedHero = UNIT_HEROES[0];
    window.selectedColor = UNIT_COLORS[0];

    const UNIT_IDLE_FRAME_WIDTH_DEFAULT = 192;
    const UNIT_IDLE_FRAME_WIDTH_LANCER = 320;

    function getUnitIdleFrameWidth(hero) {
        return hero === 'Lancer' ? UNIT_IDLE_FRAME_WIDTH_LANCER : UNIT_IDLE_FRAME_WIDTH_DEFAULT;
    }

    function getUnitIdleSpritePath(color, hero) {
        // File naming is intentionally simple: <Hero>_Idle.png
        // (If you rename assets, update this in one place.)
        const fileName = `${hero}_Idle.png`;
        return `./assets/Units/${color} Units/${hero}/${fileName}`;
    }

    // Keyed lookup so we can store per-sprite metadata (frameWidth differs for Lancer).
    const unitIdleKeys = new Set();
    const unitIdleMeta = new Map();

    function addUnitIdle(color, hero) {
        const key = `${color}:${hero}`;
        const imageUrl = getUnitIdleSpritePath(color, hero);

        unitIdleKeys.add(key);
        unitIdleMeta.set(key, {
            color,
            hero,
            imageUrl,
            frameWidth: getUnitIdleFrameWidth(hero),
        });
    }

    UNIT_COLORS.forEach((color) => {
        UNIT_HEROES.forEach((hero) => addUnitIdle(color, hero));
    });

    function getUnitIdle(color, hero) {
        return unitIdleMeta.get(`${color}:${hero}`);
    }

    // ==========================================================
    // Avatar icons (25 total)
    // ==========================================================
    function getAvatarIconPaths() {
        const basePath = './assets/UI Elements/UI Elements/Human Avatars';
        return Array.from({ length: 25 }, (_, i) => {
            const index = String(i + 1).padStart(2, '0');
            return `${basePath}/Avatars_${index}.png`;
        });
    }

    const icons = getAvatarIconPaths();

    // ==========================================================
    // Slot UI: hero + color single-select
    // ==========================================================
    const heroSlots = Array.from(document.getElementsByClassName('heroSlot'));
    let heroImages = Array();
    let displayCtrl = null;
    heroSlots.forEach((parent, idx) => {
        parent.addEventListener('pointerenter', () => playSound('hover'));
        const heroImage = document.createElement('div');
        heroImage.classList.add('heroImage');
        if (idx === 0) parent.classList.add('selected');
        const iconPath = icons[idx];
        heroImage.style.backgroundImage = `url("${iconPath}")`;
        heroImages.push(heroImage);
        parent.appendChild(heroImage);
        parent.addEventListener('click', () => {
            heroSlots.forEach((s) => {
                s.classList.remove('selected');
            });
            parent.classList.add('selected');
            updateDisplay();
        });
    });

    const colorSlots = Array.from(document.getElementsByClassName('colorSlots'));
    colorSlots.forEach((parent, idx) => {
        parent.addEventListener('pointerenter', () => playSound('hover'));

        const colorImage = document.createElement('div');
        colorImage.classList.add('colorImage');
        if (idx === 0) parent.classList.add('selected');
        drawColor(colorImage, 0.7, idx);
        parent.appendChild(colorImage);
        parent.addEventListener('click', () => {
            colorSlots.forEach((s, idx) => {
                s.classList.remove('selected');
            });
            parent.classList.add('selected');
            updateHeroImages(idx);
            updateDisplay();
        });
    });

    function updateHeroImages(colorIdx) {
        // The avatar sheet is grouped in rows of 5.
        // When you switch color, shift the 5 hero images by (colorIdx * 5).
        heroImages.forEach((heroImage, idx) => {
            const iconPath = icons[idx + 5 * colorIdx];
            heroImage.style.backgroundImage = `url("${iconPath}")`;
        });
    }

    // ==========================================================
    // Display overlay: animation + veil stacking
    // ==========================================================
    const displayWrapper = document.getElementById('displayWrapper');
    const display = document.getElementById('display');
    const veil = document.getElementById('veil');

    // `#table` is transformed (stacking context), so children can't out-z-index `#veil`.
    // Solution: on hover, temporarily move only `#displayWrapper` to <body> ("portal"),
    // and move it back when hover ends.
    const displayHomeParent = displayWrapper ? displayWrapper.parentElement : null;
    const displayPlaceholder = displayWrapper ? document.createComment('displayWrapper-home') : null;
    if (displayHomeParent && displayWrapper && displayPlaceholder) {
        displayHomeParent.insertBefore(displayPlaceholder, displayWrapper);
    }

    function setDisplayOverlayEnabled(enabled) {
        if (!displayWrapper || !displayPlaceholder) return;

        if (enabled) {
            if (displayWrapper.parentElement !== document.body) {
                document.body.appendChild(displayWrapper);
            }
            displayWrapper.classList.add('displayOverlay');
            return;
        }

        displayWrapper.classList.remove('displayOverlay');
        if (displayPlaceholder.parentNode) {
            displayPlaceholder.parentNode.insertBefore(displayWrapper, displayPlaceholder.nextSibling);
        }
    }
    
    const DISPLAY_WRAPPER_BASE_TRANSFORM = 'translate(-50%, -50%) scale(1)';
    const DISPLAY_WRAPPER_HOVER_TRANSFORM = 'translate(-50%, -50%) scale(1.7)';

    // Must match the CSS transition duration for smooth "scale down then un-portal".
    const DISPLAY_TRANSITION_MS = 400;
    
    let mouseStillIn = false;
    displayWrapper.addEventListener('mouseenter', (event) => {
        mouseStillIn = true;
        setTimeout(() => {
            if (mouseStillIn) {
                veil.classList.add('active');
                setDisplayOverlayEnabled(true);

                // Make sure the browser commits the overlay/base state before scaling up,
                // otherwise it can snap without animating.
                displayWrapper.style.transform = DISPLAY_WRAPPER_BASE_TRANSFORM;
                void displayWrapper.offsetWidth;

                window.requestAnimationFrame(() => {
                    if (!mouseStillIn) return;
                    displayWrapper.style.transform = DISPLAY_WRAPPER_HOVER_TRANSFORM;
                });
            }
        }, 200);
    });

    displayWrapper.addEventListener('mouseleave', () => {
        mouseStillIn = false;
        veil.classList.remove('active');
        displayWrapper.style.transform = DISPLAY_WRAPPER_BASE_TRANSFORM;

        // Let the scale-down animation finish before moving it back under the table.
        window.setTimeout(() => {
            if (!mouseStillIn) setDisplayOverlayEnabled(false);
        }, DISPLAY_TRANSITION_MS);
    });

    function getSelectedIndex(slotEls) {
        const idx = slotEls.findIndex((node) => node.classList.contains('selected'));
        return idx >= 0 ? idx : 0;
    }

    // ==========================================================
    // Load persisted selection (read-only)
    // ==========================================================
    // The menu calls this every time the user opens Customize.
    // It reads from window.selectedHero / window.selectedColor but DOES NOT write to them.
    function loadCustomizeSelection() {
        const desiredHero = window.selectedHero;
        const desiredColor = window.selectedColor;

        const heroIdx = typeof desiredHero === 'string' ? UNIT_HEROES.indexOf(desiredHero) : -1;
        const colorIdx = typeof desiredColor === 'string' ? UNIT_COLORS.indexOf(desiredColor) : -1;

        if (heroIdx >= 0) {
            heroSlots.forEach((s) => s.classList.remove('selected'));
            if (heroSlots[heroIdx]) heroSlots[heroIdx].classList.add('selected');
        }

        if (colorIdx >= 0) {
            colorSlots.forEach((s) => s.classList.remove('selected'));
            if (colorSlots[colorIdx]) colorSlots[colorIdx].classList.add('selected');
            updateHeroImages(colorIdx);
        }

        updateDisplay();
    }

    // Exposed for menu.js
    window.loadCustomizeSelection = loadCustomizeSelection;

    // ==========================================================
    // Display: animate selected unit idle
    // ==========================================================
    function updateDisplay() {
        const hero = getSelectedHero();
        const color = getSelectedColor();

        const idle = getUnitIdle(color, hero);
        if (!idle) return;

        if (displayCtrl) displayCtrl.stop();
        displayCtrl = animateSprite(display, {
            imageUrl: idle.imageUrl,
            frameWidth: idle.frameWidth,
            fps: 8,
            scale: 2,
            loop: true,
        });
    }

    function getSelectedHero() {
        const heroIdx = getSelectedIndex(heroSlots);
        return UNIT_HEROES[heroIdx] || UNIT_HEROES[0];
    }

    function getSelectedColor() {
        const colorIdx = getSelectedIndex(colorSlots);
        return UNIT_COLORS[colorIdx] || UNIT_COLORS[0];
    }

    drawRegularPaper(displayWrapper, 2, 3);

    // Initial state
    updateDisplay();
})();
