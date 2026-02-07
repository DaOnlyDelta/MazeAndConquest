(function() {
    const titleWrapper = document.getElementById('titleWrapper');
    drawBanner(titleWrapper, 6, 2.5, 0);

    const buttons = Array.from(document.getElementsByClassName('menuButtons'));
    buttons.forEach((btn) => btn.addEventListener('pointerenter', () => playSound('hover')));
    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            playSound('click');
            btn.classList.add('pressed');

            // Load next window
            if (btn.id === 'startButton') {
            }

            if (btn.id === 'costumizeButton') {
            }
        });
    });

    const aboutWindow = document.getElementById('aboutWindow');
    const settingsWindow = document.getElementById('settingsWindow');
    const settingsXs = Array.from(document.getElementsByClassName('settingsX'));
    const sideButtons = Array.from(document.getElementsByClassName('sideButtons'));
    const redBanners = Array.from(document.getElementsByClassName('redBanner'));
    const veil = document.getElementById('veil');
    sideButtons.forEach((btn) => btn.addEventListener('pointerenter', () => playSound('hover')));
    sideButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            playSound('click');
            veil.classList.add('active');
            btn.classList.add('pressed');
            setTimeout(() => {
                btn.classList.remove('pressed');
            }, 100);

            // Load next window
            if (btn.id === 'aboutButton') {
                // Open the about window
                aboutWindow.classList.add('active');
            }

            if (btn.id === 'settingsButton') {
                // Open the settings window
                settingsWindow.classList.add('active');
            }
        });
    });

    drawPaper(aboutWindow, 4, 4);

    redBanners.forEach((div) => {drawBanner(div, 6, 0.9, 3)});

    settingsXs.forEach((x) => {
        x.addEventListener('pointerenter', () => playSound('hover'));
        x.addEventListener('click', () => {
            playSound('click2');
            if (currentPanel === null) {
                veil.classList.remove('active');
                aboutWindow.classList.remove('active');
                settingsWindow.classList.remove('active');
                return;
            }
            currentPanel.classList.remove('active');
            currentPanel = null;
            settingsWindow.classList.remove('selected');
        });
    });

    drawPaper(settingsWindow, 4, 4);

    // Settings pane
    const settingsOptions = Array.from(document.getElementsByClassName('settingsOption'));
    const settingsAudio = document.getElementById('settingsAudio');
    
    let currentPanel = null;

    settingsOptions.forEach((div) => {
        div.addEventListener('pointerenter', () => playSound('hover'));
        drawBanner(div, 3, 1, 0);
        div.addEventListener('click', () => {
            playSound('click');
            currentActive = div;
            div.classList.add('active');
            settingsWindow.classList.add('selected');
            if (div.id === 'settingsAudioOption') {
                settingsAudio.classList.add('active');
                currentPanel = settingsAudio;

                syncMusicIcons();
            }
        });
    });

    // Audio settings
    drawPaper(settingsAudio, 4, 3);

    const freeMusic = document.getElementById('musicImageHolder');
    const settingsMusicIcon = document.getElementById('musicImage');
    const settingsSfxIcon = document.getElementById('sfxImage');
    const musicSlider = document.getElementById('musicSlider');
    const sfxSlider = document.getElementById('sfxSldier');

    function syncMusicIcons() {
        freeMusic.classList.toggle('off', !musicEnabled);
        settingsMusicIcon.classList.toggle('off', !musicEnabled);
    }

    function toggleMusicEnabled() {
        window.setMusicEnabled(!musicEnabled);
        syncMusicIcons();
    }

    function toggleSfxEnabled() {
        sfxEnabled = !sfxEnabled;
        if (sfxEnabled) {
            settingsSfxIcon.classList.remove('off');
            return;
        }
        settingsSfxIcon.classList.add('off');
    }

    freeMusic.addEventListener('click', (toggleMusicEnabled));

    settingsMusicIcon.addEventListener('click', toggleMusicEnabled);

    settingsSfxIcon.addEventListener('click', toggleSfxEnabled);

    drawSliderBorder(musicSlider, 4, 1);
    drawSliderBorder(sfxSlider, 4, 1);
    drawSliderLine(musicSlider, 5, 1);
    drawSliderLine(sfxSlider, 5, 1);

    // Slider logic
    function getSliderT(event, sliderEl) {
        const insetLeftPx = 10;
        const insetRightPx = 10;
        const rect = sliderEl.getBoundingClientRect();

        const usableLeft = rect.left + insetLeftPx;
        const usableWidth = Math.max(1, rect.width - insetLeftPx - insetRightPx);

        const rawX = event.clientX - usableLeft;
        const clampedX = Math.max(0, Math.min(rawX, usableWidth));
        return clampedX / usableWidth;
    }

    function setSliderFill(sliderEl, t) {
        const insetLeftPx = 10;
        const insetRightPx = 10;
        const rect = sliderEl.getBoundingClientRect();

        const usableWidth = Math.max(1, rect.width - insetLeftPx - insetRightPx);
        const fillPx = Math.max(0, Math.min(t, 1)) * usableWidth;

        const holder = sliderEl.querySelector('.sliderHolder');
        if (!holder) return;

        holder.style.left = `${insetLeftPx}px`;
        holder.style.right = 'auto';
        holder.style.width = `${fillPx}px`;
    }

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

    veil.addEventListener('click', (event) => {
        // Only close when clicking the veil backdrop itself (not inner content)
        if (event.target === veil) {
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
    });
})();