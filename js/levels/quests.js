(function() {
    let questProgress = 0;
    const paperHolder = document.getElementById('paperHolder');
    const veil = document.getElementById('veil');
    let isPaperActive = false;

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
        return paper;
    }

    const paper1 = makePaper(2, 4, `
        <p>Good traveller, I am Brother Aldric, a humble servant of the faith.</p>
        <p>Many seasons past, the King cast me from these lands for speaking truths he did not wish to hear. I hold no ill will toward him, yet the exile weighs heavy upon my soul.</p>
        <p>The royal guard would turn me away at the gate, but you may walk freely where I cannot. I ask of you this: seek audience with the King and plead my case — I wish only to return in peace, to tend to my lifestock. Nothing more.</p>
        <p>May your words find favour in his ears.</p>
        <p style="text-align:right; margin-top: 1em;">— Brother Aldric</p>
    `);

    const paper2 = makePaper(3, 5, `
        <div class="dialogue-line guard-line"><span class="speaker">— Guards:</span> Halt! State your business at the King's gate, stranger.</div>
        <div class="dialogue-line you-line"><span class="speaker">— You:</span> I come in peace. I seek an audience with His Majesty on behalf of Brother Aldric.</div>
        <div class="dialogue-line guard-line"><span class="speaker">— Guards:</span> Aldric? The exiled monk? You dare speak that name before these walls?</div>
        <div class="dialogue-line you-line"><span class="speaker">— You:</span> I do. The man holds no malice. He asks only for mercy — to return and tend to the sick as he always has.</div>
        <div class="dialogue-line guard-line"><span class="speaker">— Guards:</span> The King's decree stands. He was cast out for stirring unrest among the people.</div>
        <div class="dialogue-line you-line"><span class="speaker">— You:</span> He spoke his conscience. No sword was raised, no blood was shed. Surely mercy costs a king less than regret.</div>
        <div class="dialogue-line guard-line"><span class="speaker">— Guards:</span> ...We shall inform His Majesty that you wait. But do not expect a warm welcome, stranger.</div>
    `);

    // ==========================================================
    // Trigger definitions
    // { x, y, progress, paper, facing, auto }
    // auto: true  → fires on tile arrival (no E needed)
    // auto: false → fires on E press while on tile
    // ==========================================================
    const triggers = [
        { x: 16, y: 15, progress: 0, paper: paper1, facing: 'left', auto: false },
        { x:  8, y:  7, progress: 1, paper: paper2, facing: null,   auto: true  },
        { x:  5, y:  5, progress: 2, paper: paper2, facing: null,   auto: false },
    ];

    // Waypoints to show after each step (indexed by questProgress after dismiss)
    const waypointByProgress = {
        1: () => window.sceneRenderer.addWaypoint(8, 7),
        2: () => window.sceneRenderer.addWaypoint(5, 5),
    };

    // Initial waypoint
    window.sceneRenderer.addWaypoint(16, 15);

    // ==========================================================
    // Show / hide paper
    // ==========================================================
    function showPaper(paper) {
        if (!isPaperActive) {
            paper.classList.add('active');
            setTimeout(() => veil.classList.add('active'), 300);
        } else {
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
        const { TILE_DISPLAY_SIZE } = window.canvasConfig;
        const px = trigger.x * TILE_DISPLAY_SIZE + TILE_DISPLAY_SIZE / 2;
        const py = trigger.y * TILE_DISPLAY_SIZE + TILE_DISPLAY_SIZE / 2;
        if (window.player.isMoving()) window.player.cancelMovement();
        if (trigger.facing) window.player.updateFacingFromDirection(trigger.facing);
        window.sceneRenderer.setCameraZoom(px, py);
        setTimeout(() => showPaper(trigger.paper), 200);
    }

    // ==========================================================
    // Auto-trigger tick (runs every frame)
    // ==========================================================
    function checkAutoTriggers() {
        if (isPaperActive) return;
        const px = window.player.getX();
        const py = window.player.getY();
        triggers.forEach(t => {
            if (t.auto && t.progress === questProgress && px === t.x && py === t.y) {
                fireTrigger(t);
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

        if (window.sceneRenderer.isZoomed()) {
            const activeTrigger = triggers.find(t => t.progress === questProgress);
            if (activeTrigger) showPaper(activeTrigger.paper);
            window.sceneRenderer.resetCameraZoom();
            return;
        }

        const px = window.player.getX();
        const py = window.player.getY();
        const trigger = triggers.find(t => !t.auto && t.progress === questProgress && px === t.x && py === t.y);
        if (trigger) fireTrigger(trigger);
    });
})();
