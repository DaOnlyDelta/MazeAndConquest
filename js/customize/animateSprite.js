// Sprite-sheet animation helper.
// Usage:
//   const sprite = createSpriteDiv(parent);
//   const ctrl = animateSprite(sprite, {
//     imageUrl: './assets/Units/Blue Units/Monk/monk.png',
//     frameWidth: 64,
//     // frameHeight: 64,  // optional (defaults to image height)
//     // frameCount: 6,    // optional (defaults to imageWidth / frameWidth)
//     fps: 8,
//     scale: 2,
//     loop: true,
//   });
//   // ctrl.stop() / ctrl.play() / ctrl.setFrame(n)

(function () {
	function clampInt(value, min, max) {
		const n = Math.floor(Number(value));
		if (!Number.isFinite(n)) return min;
		return Math.max(min, Math.min(max, n));
	}

	function applyBaseSpriteStyles(el) {
		el.style.backgroundRepeat = 'no-repeat';
		el.style.imageRendering = 'pixelated';
		el.style.display = el.style.display || 'block';
	}

	// Creates a div sized to a single frame.
	window.createSpriteDiv = function createSpriteDiv(parent, frameWidth, frameHeight) {
		const el = document.createElement('div');
		applyBaseSpriteStyles(el);

		if (frameWidth != null) el.style.width = `${frameWidth}px`;
		if (frameHeight != null) el.style.height = `${frameHeight}px`;

		if (parent) parent.appendChild(el);
		return el;
	};

	// Animates a horizontal sprite sheet using background-position.
	// Required: imageUrl, frameWidth
	window.animateSprite = function animateSprite(element, options) {
		const {
			imageUrl,
			frameWidth,
			frameHeight,
			frameCount,
			fps = 10,
			scale = 1,
			loop = true,
			startFrame = 0,
			autoplay = true,
			setSize = true,
		} = options || {};

		if (!element) throw new Error('animateSprite: element is required');
		if (!imageUrl) throw new Error('animateSprite: options.imageUrl is required');
		if (!frameWidth) throw new Error('animateSprite: frameWidth is required');

		const scaleNum = Number(scale);
		const scaleFactor = Number.isFinite(scaleNum) && scaleNum > 0 ? scaleNum : 1;

		applyBaseSpriteStyles(element);

		// These become known after the image loads (unless explicitly provided).
		let resolvedFrameHeight = null;
		let resolvedFrameCount = null;
		let renderFrameW = frameWidth * scaleFactor;
		let renderFrameH = null;
		let frameMax = 0;
		let currentFrame = 0;
		let pendingFrame = startFrame;
		let isReady = false;
		let playing = Boolean(autoplay);
		let rafId = null;
		let lastTimeMs = 0;

		const frameDurationMs = 1000 / Math.max(1, Number(fps) || 1);

		function applyResolvedSizing() {
			if (!isReady) return;
			renderFrameW = frameWidth * scaleFactor;
			renderFrameH = resolvedFrameHeight * scaleFactor;

			if (setSize) {
				element.style.width = `${renderFrameW}px`;
				element.style.height = `${renderFrameH}px`;
			}

			element.style.backgroundSize = `${renderFrameW * resolvedFrameCount}px ${renderFrameH}px`;
		}

		function render() {
			if (!isReady) return;
			const x = -(currentFrame * renderFrameW);
			element.style.backgroundPosition = `${x}px 0px`;
		}

		function tick(nowMs) {
			if (!playing) return;
			if (!isReady) {
				rafId = window.requestAnimationFrame(tick);
				return;
			}

			if (!lastTimeMs) lastTimeMs = nowMs;
			const elapsed = nowMs - lastTimeMs;

			if (elapsed >= frameDurationMs) {
				const steps = Math.floor(elapsed / frameDurationMs);
				lastTimeMs += steps * frameDurationMs;

				currentFrame += steps;
				if (currentFrame > frameMax) {
					if (loop) {
						currentFrame = currentFrame % (frameMax + 1);
					} else {
						currentFrame = frameMax;
						playing = false;
					}
				}

				render();
			}

			rafId = window.requestAnimationFrame(tick);
		}

		function play() {
			if (playing) return;
			playing = true;
			lastTimeMs = 0;
			rafId = window.requestAnimationFrame(tick);
		}

		function stop() {
			playing = false;
			if (rafId != null) window.cancelAnimationFrame(rafId);
			rafId = null;
		}

		function setFrame(frameIndex) {
			pendingFrame = frameIndex;
			if (!isReady) return;
			currentFrame = clampInt(frameIndex, 0, frameMax);
			render();
		}

		// Resolve metadata from the image.
		element.style.backgroundImage = `url("${imageUrl}")`;
		const img = new Image();
		img.onload = () => {
			resolvedFrameHeight = frameHeight != null ? frameHeight : img.naturalHeight;
			resolvedFrameCount = frameCount != null ? frameCount : Math.max(1, Math.floor(img.naturalWidth / frameWidth));
			frameMax = Math.max(1, resolvedFrameCount) - 1;
			currentFrame = clampInt(pendingFrame, 0, frameMax);
			isReady = true;
			applyResolvedSizing();
			render();
		};
		img.src = imageUrl;

		// Initial paint (actual frame renders once the image loads)
		if (autoplay) rafId = window.requestAnimationFrame(tick);

		return {
			play,
			stop,
			setFrame,
			get isReady() {
				return isReady;
			},
			get frame() {
				return currentFrame;
			},
			get isPlaying() {
				return playing;
			},
		};
	};
})();

