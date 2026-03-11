/**
 * quests.js
 * Quest/dialogue system: paper popups, notification banners, trigger definitions,
 * waypoint progression, and E-key interaction handling.
 */
(function() {
    let questProgress = 0;
    const paperHolder = document.getElementById('paperHolder');
    const veil = document.getElementById('veil');
    let isPaperActive = false;
    let triggerFiring = false;
    let paperShownAt = 0;

    // ==========================================================
    // Build papers
    // ==========================================================
    function makePaper(bannerW, bannerH, html) {
        const paper = document.createElement('div');
        paper.classList.add('paper');
        paperHolder.appendChild(paper);
        drawCurvedBanner(paper, bannerW, bannerH);
        const text = document.createElement('div');
        text.classList.add('paper-text');
        text.innerHTML = html;
        paper.appendChild(text);
        const x = document.createElement('div');
        x.classList.add('paper-x');
        paper.appendChild(x);
        x.addEventListener('click', () => {
            if (!isPaperActive) return;
            if (Date.now() - paperShownAt < 1000) return;
            const activeTrigger = triggers.find(t => t.progress === questProgress);
            if (activeTrigger) showPaper(activeTrigger.paper);
            window.sceneRenderer.resetCameraZoom();
        });
        return paper;
    }

    // Notification banner
    const notificationBanner = document.getElementById('notificationBanner');
    const notificationText = document.getElementById('notificationText');
    drawBanner(notificationBanner, 5, 2.0, 3);
    // Scale the banner canvas to be proportional to the 1600px-wide canvas
    const notifCanvas = notificationBanner.querySelector('canvas');
    notificationBanner.style.width = (notifCanvas.width / 1600 * 100) + '%';
    notifCanvas.style.width = '100%';
    notifCanvas.style.height = 'auto';

    function showNotification(text) {
        notificationText.innerHTML = text;
        notificationBanner.classList.add('active');
        setTimeout(() => notificationBanner.classList.remove('active'), 2500);
    }

    const paper1 = makePaper(3, 5, `
        <div class="dialogue-line"><span class="speaker">— Aldric:</span> Ah, a traveller. You look like someone who knows how to handle themselves. Might I have a word?</div>
        <div class="dialogue-line"><span class="speaker">— You:</span> Speak freely.</div>
        <div class="dialogue-line"><span class="speaker">— Aldric:</span> I am Brother Aldric. Many seasons past, the King cast me from these lands for speaking truths he did not wish to hear. I hold no ill will — yet the exile weighs heavy on my soul.</div>
        <div class="dialogue-line"><span class="speaker">— Aldric:</span> The royal guard would turn me away at the gate, but you may walk freely where I cannot. Would you seek audience with the King and plead my case? I wish only to return in peace, to tend to my livestock.</div>
        <div class="dialogue-line"><span class="speaker">— You:</span> I will see what can be done.</div>
        <div class="dialogue-line"><span class="speaker">— Aldric:</span> May your words find favour in his ears. Thank you, traveller.</div>
    `);

    const paper2 = makePaper(4, 5, `
        <div class="dialogue-line"><span class="speaker">— Guards:</span> Halt! State your business at the King's gate, stranger.</div>
        <div class="dialogue-line"><span class="speaker">— You:</span> I come in peace. I seek an audience with His Majesty on behalf of Brother Aldric.</div>
        <div class="dialogue-line"><span class="speaker">— Guards:</span> Aldric? The exiled monk? You dare speak that name before these walls?</div>
        <div class="dialogue-line"><span class="speaker">— You:</span> I do. The man holds no malice. He asks only for mercy — to return and tend to his lifestock.</div>
        <div class="dialogue-line"><span class="speaker">— Guards:</span> The King's decree stands. He was cast out for stirring unrest among the people.</div>
        <div class="dialogue-line"><span class="speaker">— You:</span> He spoke his conscience. No sword was raised, no blood was shed. Surely mercy costs a king less than regret.</div>
        <div class="dialogue-line"><span class="speaker">— Guards:</span> ...His Majesty will see you. Follow us — and mind your tongue before the throne.</div>
    `);

    const paper3 = makePaper(3, 5, `
        <div class="dialogue-line"><span class="speaker">— King:</span> So. You are the one who dares plead for the monk's return.</div>
        <div class="dialogue-line"><span class="speaker">— You:</span> Your Majesty. Brother Aldric means no harm. He asks only to live quietly and tend to his flock.</div>
        <div class="dialogue-line"><span class="speaker">— King:</span> His flock. Yes, he was always fond of those wretched sheep.</div>
        <div class="dialogue-line"><span class="speaker">— King:</span> Very well. I am a reasonable man. My winter stores run thin and my seamstress grows impatient. Bring me wool — from Aldric's own sheep — and I shall lift the exile. Let it be a token of his goodwill.</div>
        <div class="dialogue-line"><span class="speaker">— You:</span> And you will hold to your word?</div>
        <div class="dialogue-line"><span class="speaker">— King:</span> A king's word is his law, stranger. Now go. Do not keep me waiting.</div>
    `);
    
    const paper4 = makePaper(3, 4, `
        <div class="dialogue-line"><span class="speaker">— You:</span> Brother Aldric. I have spoken with the King.</div>
        <div class="dialogue-line"><span class="speaker">— Aldric:</span> And? Does he grant me leave to return?</div>
        <div class="dialogue-line"><span class="speaker">— You:</span> He will lift the exile — but he asks for wool. From your own sheep. As a token of goodwill, he says.</div>
        <div class="dialogue-line"><span class="speaker">— Aldric:</span> Of course he does. The man never could resist a good fleece.</div>
        <div class="dialogue-line"><span class="speaker">— Aldric:</span> Very well. Take wool from my house and give it to the King. Report back to me once you're done.</div>
        <div class="dialogue-line"><span class="speaker">— You:</span> I will not be long.</div>
    `);

    const paper5 = makePaper(3, 5, `
        <div class="dialogue-line"><span class="speaker">— You:</span> Your Majesty. I bring the wool, as promised.</div>
        <div class="dialogue-line"><span class="speaker">— King:</span> So you do. And in good time. I had half-expected you to vanish like the rest of them.</div>
        <div class="dialogue-line"><span class="speaker">— You:</span> I gave my word. As did you.</div>
        <div class="dialogue-line"><span class="speaker">— King:</span> So I did. Very well. The exile is lifted. Brother Aldric may return to these lands — so long as he keeps his sheep and his opinions to himself.</div>
        <div class="dialogue-line"><span class="speaker">— You:</span> He will be glad to hear it.</div>
        <div class="dialogue-line"><span class="speaker">— King:</span> See that he is. Now go. You have served well, traveller.</div>
    `);

    // ==========================================================
    // Trigger definitions
    // { x, y, progress, paper, facing, auto }
    // auto: true  → fires on tile arrival (no E needed)
    // auto: false → fires on E press while on tile
    // ==========================================================
    const triggers = [
        { x: 16, y: 15, progress: 0, paper: paper1, facing: 'left', auto: false, hint: 'Press <span style="color:var(--primary-text-color)">E</span> to interact' },
        { x:  8, y:  7, progress: 1, paper: paper2, facing: null,   auto: true  },
        { x:  5, y:  5, progress: 2, paper: paper3, facing: 'up',   auto: false },
        { x: 16, y: 15, progress: 3, paper: paper4, facing: 'left',   auto: false },
        { x: 15, y: 13, progress: 4, paper: null, notify: 'You have acquired <span style="color:var(--primary-text-color)">wool</span>.', facing: null, auto: false  },
        { x: 5, y: 5, progress: 5, paper: paper5, facing: 'up',   auto: false, onFire: () => {
            window.sceneRenderer.setMonkPosition(19, 8.6);
            window.grid.setCell(1, 15, 15, 1);
            window.grid.setCell(1, 20, 8, 0);
        } },
    ];

    // Waypoints to show after each step (indexed by questProgress after dismiss)
    const waypointByProgress = {
        0: () => window.sceneRenderer.addWaypoint(16, 15),
        1: () => window.sceneRenderer.addWaypoint(8, 7),
        2: () => window.sceneRenderer.addWaypoint(5, 5),
        3: () => window.sceneRenderer.addWaypoint(16, 15),
        4: () => window.sceneRenderer.addWaypoint(15, 13),
        5: () => window.sceneRenderer.addWaypoint(5, 5),
        6: () => { window.sceneRenderer.clearWaypoints(); showNotification('The End.'); window.playSound('winner'); },
    };

    // Initial waypoint
    waypointByProgress[questProgress]?.();

    // ==========================================================
    // Show / hide paper
    // ==========================================================
    function showPaper(paper) {
        if (!paper) return;

        if (!isPaperActive) {
            paper.classList.add('active');
            setTimeout(() => veil.classList.add('active'), 300);
            paperShownAt = Date.now();
        } else {
            if (Date.now() - paperShownAt < 1000) return;
            paper.classList.remove('active');
            veil.classList.remove('active');
            questProgress++;
            window.sceneRenderer.clearWaypoints();
            waypointByProgress[questProgress]?.();
        }
        isPaperActive = !isPaperActive;
    }

    // ==========================================================
    // Fire a trigger (zoom + show paper)
    // ==========================================================
    function fireTrigger(trigger) {
        if (triggerFiring) return;
        if (trigger.paper === null) {
            if (trigger.notify) showNotification(trigger.notify);
            questProgress++;
            window.sceneRenderer.clearWaypoints();
            waypointByProgress[questProgress]?.();
            return;
        }
        triggerFiring = true;
        trigger.onFire?.();
        const { TILE_DISPLAY_SIZE } = window.canvasConfig;
        const px = trigger.x * TILE_DISPLAY_SIZE + TILE_DISPLAY_SIZE / 2;
        const py = trigger.y * TILE_DISPLAY_SIZE + TILE_DISPLAY_SIZE / 2;
        if (window.player.isMoving()) window.player.cancelMovement();
        if (trigger.facing) window.player.updateFacingFromDirection(trigger.facing);
        window.sceneRenderer.setCameraZoom(px, py);
        setTimeout(() => { if (!isPaperActive) showPaper(trigger.paper); triggerFiring = false; }, 200);
    }

    // ==========================================================
    // Auto-trigger tick (runs every frame)
    // ==========================================================
    const shownHints = new Set();
    function checkAutoTriggers() {
        if (isPaperActive) return;
        const px = window.player.getX();
        const py = window.player.getY();
        triggers.forEach(t => {
            if (t.progress !== questProgress || px !== t.x || py !== t.y) return;
            if (t.auto) {
                fireTrigger(t);
            } else if (t.hint && !shownHints.has(t.progress)) {
                shownHints.add(t.progress);
                showNotification(t.hint);
            }
        });
    }

    window.addEventListener('assetsLoaded', () => {
        window.animationLoop.registerTick(checkAutoTriggers);
    });

    // ==========================================================
    // E key handler (manual triggers + dismiss)
    // ==========================================================
    window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() !== 'e') return;

        // Dismiss active paper
        if (isPaperActive) {
            if (Date.now() - paperShownAt < 1000) return;
            const activeTrigger = triggers.find(t => t.progress === questProgress);
            if (activeTrigger) showPaper(activeTrigger.paper);
            window.sceneRenderer.resetCameraZoom();
            return;
        }

        // Block E during the zoom-in animation
        if (triggerFiring) return;

        // Open a manual trigger
        const px = window.player.getX();
        const py = window.player.getY();
        const trigger = triggers.find(t => !t.auto && t.progress === questProgress && px === t.x && py === t.y);
        if (trigger) fireTrigger(trigger);
    });
})();
