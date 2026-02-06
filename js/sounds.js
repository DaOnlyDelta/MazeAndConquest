// Global sound "enum" for plain <script> usage.
// Use like: playSound(sounds.click) or playSound('click')

(function () {
    window.sounds = Object.freeze({
        click: './sounds/click.mp3',
        gameOver: './sounds/game-over-417465.mp3',
        winner: './sounds/winner-game-sound-404167.mp3',
    });
})();
