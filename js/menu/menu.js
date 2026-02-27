function transition(onMidTransition, doubleDuration = false) {
    veil.classList.add('transition');
    const duration = doubleDuration ? 1600 : 800;
    setTimeout(() => {
        onMidTransition();
        veil.classList.remove('transition');
    }, duration);
}

(function () {
    // ==========================================================
    // Title / decorations
    // ==========================================================
    const titleWrapper = document.getElementById('titleWrapper');
    drawBanner(titleWrapper, 6, 2.5, 0);

    const redBanners = Array.from(document.getElementsByClassName('redBanner'));
    redBanners.forEach((div) => {
        drawBanner(div, 6, 0.9, 3);
    });

    // ==========================================================
    // Window navigation + veil
    // ==========================================================
    const mainMenu = document.getElementById('mainMenu');
    const customize = document.getElementById('customize');
    const level = document.getElementById('level');
    const veil = document.getElementById('veil');
    const aboutWindow = document.getElementById('aboutWindow');
    const settingsWindow = document.getElementById('settingsWindow');
    const settingsAudio = document.getElementById('settingsAudio');

    // Tracks which inner settings panel is open (e.g. audio).
    let currentPanel = null;

    function closeTopmost() {
        if (currentPanel === null) {
            veil.classList.remove('active');
            aboutWindow.classList.remove('active');
            settingsWindow.classList.remove('active');
            return;
        }

        currentPanel.classList.remove('active');
        currentPanel = null;
        settingsWindow.classList.remove('selected');
    }

    veil.addEventListener('click', (event) => {
        // Only close when clicking the veil backdrop itself (not inner content)
        if (event.target === veil) closeTopmost();
    });

    // Draw the paper backgrounds once.
    drawPaper(aboutWindow, 4, 4);
    drawPaper(settingsWindow, 4, 4);
    drawPaper(settingsAudio, 4, 3);

    // X buttons close either the currently open panel, or the window.
    const settingsXs = Array.from(document.getElementsByClassName('settingsX'));
    settingsXs.forEach((x) => {
        x.addEventListener('pointerenter', () => playSound('hover'));
        x.addEventListener('click', () => {
            playSound('click2');
            closeTopmost();
        });
    });

    // Switch to other screens.
    function switchToLevel() {
        transition(() => {
            mainMenu.style.display = 'none';
            level.style.display = 'flex';
        }, true);
    }

    switchToLevel(); // Auto-start the game for now, to skip the menu during development.

    function switchToCustomizeScreen() {
        transition(() => {
            mainMenu.style.display = 'none';
            customize.style.display = 'block';
        });
        window.loadCustomizeSelection();
    }

    // ==========================================================
    // Main menu buttons
    // ==========================================================
    const buttons = Array.from(document.getElementsByClassName('menuButtons'));
    buttons.forEach((btn) => btn.addEventListener('pointerenter', () => playSound('hover')));
    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            playSound('click');
            btn.classList.add('pressed');
            setTimeout(() => btn.classList.remove('pressed'), 800);

            if (btn.id === 'startButton') {
                switchToLevel();
            }
            if (btn.id === 'costumizeButton') {
                switchToCustomizeScreen();
            }
        });
    });

    // Side buttons open modal windows.
    const sideButtons = Array.from(document.getElementsByClassName('sideButtons'));
    sideButtons.forEach((btn) => btn.addEventListener('pointerenter', () => playSound('hover')));
    sideButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            playSound('click');
            veil.classList.add('active');
            btn.classList.add('pressed');
            setTimeout(() => btn.classList.remove('pressed'), 100);

            if (btn.id === 'aboutButton') {
                aboutWindow.classList.add('active');
            }
            if (btn.id === 'settingsButton') {
                settingsWindow.classList.add('active');
            }
        });
    });

    // ==========================================================
    // Settings: option list + panels
    // ==========================================================
    const settingsOptions = Array.from(document.getElementsByClassName('settingsOption'));
    settingsOptions.forEach((div) => {
        div.addEventListener('pointerenter', () => playSound('hover'));
        drawBanner(div, 3, 1, 0);

        div.addEventListener('click', () => {
            playSound('click');

            // Kept as-is: creates/updates a global for the currently active option.
            currentActive = div;

            div.classList.add('active');
            settingsWindow.classList.add('selected');

            if (div.id === 'settingsAudioOption') {
                settingsAudio.classList.add('active');
                currentPanel = settingsAudio;
                syncAudioIcons();
            }
        });
    });

    // ==========================================================
    // Audio: icons + mute toggles
    // ==========================================================
    const freeMusic = document.getElementById('musicImageHolder');
    const settingsMusicIcon = document.getElementById('musicImage');
    const settingsSfxIcon = document.getElementById('sfxImage');

    function syncAudioIcons() {
        if (freeMusic) freeMusic.classList.toggle('off', !musicEnabled);
        if (settingsMusicIcon) settingsMusicIcon.classList.toggle('off', !musicEnabled);
        if (settingsSfxIcon) settingsSfxIcon.classList.toggle('off', !sfxEnabled);
    }

    function toggleMusicEnabled() {
        window.setMusicEnabled(!musicEnabled);
        syncAudioIcons();
    }

    function toggleSfxEnabled() {
        sfxEnabled = !sfxEnabled;
        syncAudioIcons();
    }

    if (freeMusic) freeMusic.addEventListener('click', toggleMusicEnabled);
    if (settingsMusicIcon) settingsMusicIcon.addEventListener('click', toggleMusicEnabled);
    if (settingsSfxIcon) settingsSfxIcon.addEventListener('click', toggleSfxEnabled);

    // ==========================================================
    // Audio: sliders (volume 0.0..0.1)
    // ==========================================================
    const musicSlider = document.getElementById('musicSlider');
    const sfxSlider = document.getElementById('sfxSldier');

    drawSliderBorder(musicSlider, 4, 1);
    drawSliderBorder(sfxSlider, 4, 1);
    drawSliderLine(musicSlider, 5, 1);
    drawSliderLine(sfxSlider, 5, 1);

    const SLIDER_INSET_LEFT_PX = 10;
    const SLIDER_INSET_RIGHT_PX = 10;

    // Convert a pointer position into t in [0..1].
    function getSliderT(event, sliderEl) {
        const rect = sliderEl.getBoundingClientRect();

        const usableLeft = rect.left + SLIDER_INSET_LEFT_PX;
        const usableWidth = Math.max(1, rect.width - SLIDER_INSET_LEFT_PX - SLIDER_INSET_RIGHT_PX);

        const rawX = event.clientX - usableLeft;
        const clampedX = Math.max(0, Math.min(rawX, usableWidth));
        return clampedX / usableWidth;
    }

    // The fill is drawn inside `.sliderHolder`; we adjust the clip width to match t.
    function setSliderFill(sliderEl, t) {
        const rect = sliderEl.getBoundingClientRect();
        const usableWidth = Math.max(1, rect.width - SLIDER_INSET_LEFT_PX - SLIDER_INSET_RIGHT_PX);
        const fillPx = Math.max(0, Math.min(t, 1)) * usableWidth;

        const holder = sliderEl.querySelector('.sliderHolder');
        if (!holder) return;

        holder.style.left = `${SLIDER_INSET_LEFT_PX}px`;
        holder.style.right = 'auto';
        holder.style.width = `${fillPx}px`;
    }

    // Dragging uses pointer capture so the cursor can leave the element while adjusting.
    function attachSliderDrag(sliderEl, onTChange) {
        if (!sliderEl) return;

        let activePointerId = null;

        const updateFromEvent = (event) => {
            const t = getSliderT(event, sliderEl);
            onTChange(t);
            setSliderFill(sliderEl, t);
        };

        sliderEl.addEventListener('pointerdown', (event) => {
            event.preventDefault();
            activePointerId = event.pointerId;
            sliderEl.setPointerCapture(activePointerId);
            updateFromEvent(event);
        });

        sliderEl.addEventListener('pointermove', (event) => {
            if (activePointerId === null) return;
            if (event.pointerId !== activePointerId) return;
            updateFromEvent(event);
        });

        const endDrag = (event) => {
            if (activePointerId === null) return;
            if (event.pointerId !== activePointerId) return;

            try {
                sliderEl.releasePointerCapture(activePointerId);
            } catch {
                // ignore
            }

            activePointerId = null;
        };

        sliderEl.addEventListener('pointerup', endDrag);
        sliderEl.addEventListener('pointercancel', endDrag);
    }

    attachSliderDrag(musicSlider, (t) => {
        // From 0.0 (left) to 0.1 (right)
        window.setMusicVolume(t * 0.1);
    });

    attachSliderDrag(sfxSlider, (t) => {
        // From 0.0 (left) to 0.1 (right)
        window.setSfxVolume(t * 0.1);
    });

    // After loading, show the veil
    setTimeout(() => {
        veil.classList.add('ready');
    }, 300);
})();
