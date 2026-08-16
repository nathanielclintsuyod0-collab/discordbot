document.addEventListener("DOMContentLoaded", () => {

    const result = document.getElementById("result");
    const expression = document.getElementById("expression");
    const lyric = document.getElementById("lyric");
    const status = document.getElementById("status");
    const song = document.getElementById("song");
    const soundBtn = document.getElementById("soundBtn");

    let current = "";
    let muted = false;
    let lyricTimer = null;
    let lyricIndex = 0;

    // ==============================
    // LYRICS
    // ==============================

    const lyrics = [
        "Tell me, why are we wasting time",
        "On all your wasted cryin'",
        "When you should be with me instead?",
        "I know I can treat you better",
        "Better than he can"
    ];

    // Lower = faster
    const lyricSpeed = 500;


    // ==============================
    // DISPLAY
    // ==============================

    function updateDisplay() {
        result.textContent = current || "0";
    }


    // ==============================
    // INPUT
    // ==============================

    function add(value) {

        const operators = "+-*/%";

        if (operators.includes(value)) {

            if (current === "") {

                if (value === "-") {
                    current = "-";
                } else {
                    return;
                }

            } else {

                const last = current[current.length - 1];

                if (operators.includes(last)) {
                    current = current.slice(0, -1) + value;
                } else {
                    current += value;
                }
            }

        } else if (value === ".") {

            const parts = current.split(/[+\-*/%]/);
            const lastNumber = parts[parts.length - 1];

            if (lastNumber.includes(".")) {
                return;
            }

            current += lastNumber === "" ? "0." : ".";

        } else {

            current += value;
        }

        updateDisplay();
    }


    // ==============================
    // DELETE
    // ==============================

    function deleteLast() {

        current = current.slice(0, -1);

        updateDisplay();
    }


    // ==============================
    // CLEAR
    // ==============================

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


    // ==============================
    // LYRICS
    // ==============================

    function showLyric(text) {

        lyric.textContent = text;

        lyric.classList.remove("active");

        void lyric.offsetWidth;

        lyric.classList.add("active");
    }


    function startLyrics() {

        stopLyrics();

        lyricIndex = 0;

        if (lyrics.length === 0) {
            return;
        }

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


    function stopLyrics() {

        if (lyricTimer) {

            clearInterval(lyricTimer);

            lyricTimer = null;
        }

        lyricIndex = 0;
    }


    // ==============================
    // EQUALS
    // ==============================

    function calculate() {

        if (current === "") {
            return;
        }

        const last = current[current.length - 1];

        if ("+-*/%.".includes(last)) {
            return;
        }

        // Save what the user entered
        expression.textContent = current + " =";

        // Instead of calculating, play the song
        result.textContent = "🎵";

        result.classList.remove("flash");
        void result.offsetWidth;
        result.classList.add("flash");

        lyric.textContent = "";

        status.textContent = "♪ Now playing";

        // Restart audio
        song.pause();
        song.currentTime = 0;

        // Start lyrics
        startLyrics();

        if (!muted) {

            song.play().catch(() => {

                status.textContent =
                    "♪ Press 🔊 to enable audio";

            });
        }
    }


    // ==============================
    // BUTTONS
    // ==============================

    document.querySelectorAll(".key").forEach(button => {

        button.addEventListener("click", () => {

            const action = button.dataset.action;
            const value = button.dataset.value;

            if (action === "clear") {

                clearCalculator();

            } else if (action === "delete") {

                deleteLast();

            } else if (action === "equals") {

                calculate();

            } else if (value !== undefined) {

                add(value);
            }

        });

    });


    // ==============================
    // KEYBOARD
    // ==============================

    document.addEventListener("keydown", event => {

        if (/^[0-9]$/.test(event.key)) {

            add(event.key);

        } else if ("+-*/%.".includes(event.key)) {

            add(event.key);

        } else if (
            event.key === "Enter" ||
            event.key === "="
        ) {

            event.preventDefault();

            calculate();

        } else if (event.key === "Backspace") {

            deleteLast();

        } else if (event.key === "Escape") {

            clearCalculator();
        }

    });


    // ==============================
    // SOUND
    // ==============================

    soundBtn.addEventListener("click", () => {

        muted = !muted;

        if (muted) {

            song.pause();

            stopLyrics();

            soundBtn.textContent = "🔇";

            status.textContent = "♪ Muted";

        } else {

            soundBtn.textContent = "🔊";

            if (expression.textContent) {

                song.play();

                startLyrics();

                status.textContent = "♪ Now playing";
            }
        }

    });


    // ==============================
    // AUDIO FINISHED
    // ==============================

    song.addEventListener("ended", () => {

        stopLyrics();

        status.textContent = "♪ Finished";

    });


    // ==============================
    // INITIAL DISPLAY
    // ==============================

    updateDisplay();

});
