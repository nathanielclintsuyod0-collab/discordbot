// BetterCalc - calculator + lyric player

document.addEventListener("DOMContentLoaded", () => {
    const result = document.getElementById("result");
    const expression = document.getElementById("expression");
    const lyric = document.getElementById("lyric");
    const status = document.getElementById("status");
    const song = document.getElementById("song");
    const soundBtn = document.getElementById("soundBtn");
    const buttons = document.querySelectorAll(".key");

    let current = "";
    let muted = false;
    let lyricTimer = null;
    let lyricIndex = 0;

    // Lower number = faster lyric changes.
    // 500 = one line every half second.
    const lyricSpeed = 500;

    const lyrics = [
        "Tell me, why are we wasting time",
        "On all your wasted cryin'",
        "When you should be with me instead?",
        "I know I can treat you better",
        "Better than he can"
    ];

    function updateDisplay() {
        result.textContent = current === "" ? "0" : current;
    }

    function add(value) {
        const operators = "+-*/%";

        if (operators.indexOf(value) !== -1) {
            if (current === "") {
                if (value === "-") {
                    current = "-";
                } else {
                    return;
                }
            } else {
                const last = current.charAt(current.length - 1);

                if (operators.indexOf(last) !== -1) {
                    current = current.slice(0, -1) + value;
                } else {
                    current += value;
                }
            }
        } else if (value === ".") {
            const parts = current.split(/[+\-*/%]/);
            const lastNumber = parts[parts.length - 1];

            if (lastNumber.indexOf(".") !== -1) {
                return;
            }

            if (lastNumber === "") {
                current += "0.";
            } else {
                current += ".";
            }
        } else {
            current += value;
        }

        updateDisplay();
    }

    function deleteLast() {
        current = current.slice(0, -1);
        updateDisplay();
    }

    function stopLyrics() {
        if (lyricTimer !== null) {
            clearInterval(lyricTimer);
            lyricTimer = null;
        }

        lyricIndex = 0;
    }

    function showLyric(text) {
        lyric.textContent = text;

        lyric.classList.remove("active");
        void lyric.offsetWidth;
        lyric.classList.add("active");
    }

    function startLyrics() {
        stopLyrics();

        if (lyrics.length === 0) {
            return;
        }

        lyricIndex = 0;
        showLyric(lyrics[0]);

        lyricTimer = setInterval(() => {
            lyricIndex++;

            if (lyricIndex >= lyrics.length) {
                stopLyrics();
                return;
            }

            showLyric(lyrics[lyricIndex]);
        }, lyricSpeed);
    }

    function clearCalculator() {
        current = "";

        expression.textContent = "";
        lyric.textContent = "";
        status.textContent = "";

        stopLyrics();

        song.pause();
        song.currentTime = 0;

        updateDisplay();
    }

    function calculate() {
        if (current === "") {
            return;
        }

        // Don't start with an incomplete expression.
        const last = current.charAt(current.length - 1);

        if ("+-*/%.".indexOf(last) !== -1) {
            return;
        }

        expression.textContent = current + " =";

        // This calculator intentionally replaces the answer with the song.
        result.textContent = "🎵";

        result.classList.remove("flash");
        void result.offsetWidth;
        result.classList.add("flash");

        lyric.textContent = "";
        status.textContent = "♪ Now playing";

        stopLyrics();

        song.pause();
        song.currentTime = 0;

        startLyrics();

        if (!muted) {
            const playPromise = song.play();

            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    status.textContent = "♪ Press 🔊 to enable audio";
                    stopLyrics();
                });
            }
        }
    }

    // Calculator buttons
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const action = button.getAttribute("data-action");
            const value = button.getAttribute("data-value");

            if (action === "clear") {
                clearCalculator();
            } else if (action === "delete") {
                deleteLast();
            } else if (action === "equals") {
                calculate();
            } else if (value !== null) {
                add(value);
            }
        });
    });

    // Keyboard controls
    document.addEventListener("keydown", (event) => {
        const key = event.key;

        if (key >= "0" && key <= "9") {
            add(key);
            return;
        }

        if ("+-*/%.".indexOf(key) !== -1) {
            add(key);
            return;
        }

        if (key === "Enter" || key === "=") {
            event.preventDefault();
            calculate();
            return;
        }

        if (key === "Backspace") {
            event.preventDefault();
            deleteLast();
            return;
        }

        if (key === "Escape") {
            clearCalculator();
        }
    });

    // Sound button
    soundBtn.addEventListener("click", () => {
        muted = !muted;

        if (muted) {
            song.pause();
            stopLyrics();
            soundBtn.textContent = "🔇";
            status.textContent = "♪ Muted";
        } else {
            soundBtn.textContent = "🔊";

            if (expression.textContent !== "") {
                song.play().then(() => {
                    startLyrics();
                    status.textContent = "♪ Now playing";
                }).catch(() => {
                    status.textContent = "♪ Unable to play audio";
                });
            }
        }
    });

    // Audio events
    song.addEventListener("ended", () => {
        stopLyrics();
        status.textContent = "♪ Finished";
    });

    song.addEventListener("error", () => {
        stopLyrics();
        status.textContent = "⚠ song.mp3 could not be loaded";
    });

    // Initial display
    updateDisplay();
});
