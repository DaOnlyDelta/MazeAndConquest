// ==========================================================
// Audio globals (read by menu.js)
// ==========================================================
// - `musicEnabled`: toggles music volume between `musicVolume` and 0
// - `sfxEnabled`: blocks SFX playback when false
let sfxVolume = 0.1;
let musicVolume = 0.1;
let musicEnabled = true;
let sfxEnabled = true;

(function () {
	// ==========================================================
	// Setup
	// ==========================================================
	let audioUnlocked = false;

	const sfxByKey = {
		hover: new Audio('./sounds/hover.mp3'),
		click: new Audio('./sounds/click.mp3'),
		click2: new Audio('./sounds/click2.mp3'),
		gameOver: new Audio('./sounds/game-over-417465.mp3'),
		winner: new Audio('./sounds/winner-game-sound-404167.mp3'),
	};

	for (const audio of Object.values(sfxByKey)) {
		audio.preload = 'auto';
		audio.volume = sfxVolume;
	}

	// Background music: loops through Pixel 1..12 in order.
	const musicPlaylist = Array.from({ length: 12 }, (_, i) => `./music/Ogg/Pixel ${i + 1}.ogg`);
	let musicIndex = 0;

	const music = new Audio(musicPlaylist[musicIndex]);
	music.preload = 'auto';
	music.loop = false;

	// ==========================================================
	// Helpers
	// ==========================================================
	function applyMusicVolume() {
		music.volume = musicEnabled ? musicVolume : 0;
	}

	function safePlay(audioEl) {
		try {
			const p = audioEl.play();
			if (p && typeof p.catch === 'function') p.catch(() => {});
		} catch {
			// ignore autoplay-policy errors
		}
	}

	function startMusicIfPossible() {
		if (!audioUnlocked) return;
		applyMusicVolume();
		safePlay(music);
	}

	// ==========================================================
	// Music looping
	// ==========================================================
	music.addEventListener('ended', () => {
		musicIndex = (musicIndex + 1) % musicPlaylist.length;
		music.src = musicPlaylist[musicIndex];
		music.load();
		startMusicIfPossible();
	});

	// ==========================================================
	// Public API (used by menu.js)
	// ==========================================================
	window.playSound = function (effect) {
		// Avoid autoplay-policy errors on hover before the first user interaction.
		if ((!audioUnlocked && effect === 'hover') || !sfxEnabled) return;

		const audio = sfxByKey[effect] || new Audio(effect);
		audio.volume = sfxVolume;
		audio.currentTime = 0;
		safePlay(audio);
	};

	window.setSfxVolume = function (value) {
		sfxVolume = value;
		for (const audio of Object.values(sfxByKey)) {
			audio.volume = sfxVolume;
		}
	};

	window.setMusicVolume = function (value) {
		musicVolume = value;
		applyMusicVolume();
	};

	// "Mute" toggle: sets music volume to 0 (no pause/restart).
	window.setMusicEnabled = function (enabled) {
		musicEnabled = Boolean(enabled);
		applyMusicVolume();

		// If user unmutes after unlock and music hasn't started yet, start it.
		if (musicEnabled && audioUnlocked && music.paused) {
			startMusicIfPossible();
		}
	};

	// ==========================================================
	// Unlock (browser policy)
	// ==========================================================
	function unlockAudioOnce() {
		if (audioUnlocked) return;
		audioUnlocked = true;
		startMusicIfPossible();
	}

	window.addEventListener('pointerdown', unlockAudioOnce, { once: true });
	window.addEventListener('keydown', unlockAudioOnce, { once: true });
})();