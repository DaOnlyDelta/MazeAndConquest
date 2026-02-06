// Minimal audio.
// SFX: playSound('click') / playSound('gameOver') / playSound('winner')
// Volumes: setSfxVolume(0..1), setMusicVolume(0..1)

(function () {
	let sfxVolume = 0.1;
	let musicVolume = 0.1;

	const sfxByKey = {
        hover: new Audio('./sounds/hover.mp3'),
		click: new Audio('./sounds/click.mp3'),
        click2: new Audio('./sounds/click2.mp3'),
		gameOver: new Audio('./sounds/game-over-417465.mp3'),
		winner: new Audio('./sounds/winner-game-sound-404167.mp3'),
	};

	Object.values(sfxByKey).forEach((a) => {
		a.preload = 'auto';
		a.volume = sfxVolume;
		a.load();
	});

	// Music playlist (1-13) that plays in order and loops.
	// Files expected at: ./music/mp3/Pixel 1.mp3 ... Pixel 13.mp3
	const musicPlaylist = Array.from({ length: 13 }, (_, i) => `./music/mp3/Pixel ${i + 1}.mp3`);
	let musicIndex = 0;
	let musicEnabled = true;

	const music = new Audio();
	music.loop = false; // we handle looping manually across the playlist
	music.preload = 'auto';
	music.volume = musicVolume;

	window.playSound = function (effect) {
		const audio = sfxByKey[effect] || new Audio(effect);
		audio.volume = sfxVolume;
		audio.currentTime = 0;
		audio.play();
	};

	window.setSfxVolume = function (value) {
		sfxVolume = value;
		Object.values(sfxByKey).forEach((a) => {
			a.volume = sfxVolume;
		});
	};

	window.setMusicVolume = function (value) {
		musicVolume = value;
		music.volume = musicVolume;
	};

	function startMusic() {
		music.volume = musicVolume;
		music.play();
	}

	let sfxPrimed = false;
	function primeSfxOnce() {
		if (sfxPrimed) return;
		sfxPrimed = true;

		Object.values(sfxByKey).forEach((a) => {
			const originalVolume = a.volume;
			a.volume = 0;
			a.play()
				.then(() => {
					a.pause();
					a.currentTime = 0;
					a.volume = originalVolume;
				})
				.catch(() => {
					a.volume = originalVolume;
				});
		});
	}

	// Called once on startup; you don't need to call it again.
	function initAudio() {
		// Try immediately...
		startMusic();

		// ...and also arm a one-time "resume" on first interaction
		// (most browsers require a user gesture before audio can play).
		const resume = function () {
			startMusic();
			primeSfxOnce();
		};
		window.addEventListener('pointerdown', resume, { once: true });
		window.addEventListener('keydown', resume, { once: true });
	}

	initAudio();
})();

