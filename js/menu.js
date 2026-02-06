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

    const freeMusic = document.getElementById('musicImageHolder');
    freeMusic.addEventListener('click', () => {
        if (freeMusic.classList.contains('off')) {
            freeMusic.classList.remove('off');
            return;
        }
        freeMusic.classList.add('off');
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
            }
        });
    });

    drawPaper(settingsAudio, 4, 3);

    const musicSlider = document.getElementById('musicSlider');
    const seSlider = document.getElementById('seSldier');
    drawSliderBorder(musicSlider, 4, 1);
    drawSliderBorder(seSlider, 4, 1);

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