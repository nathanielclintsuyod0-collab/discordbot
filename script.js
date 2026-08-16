document.addEventListener("DOMContentLoaded", function () {

    console.log("BetterCalc JS loaded!");

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

    const lyrics = [
        "Tell me, why are we wasting time",
        "On all your wasted cryin'",
        "When you should be with me instead?",
        "I know I can treat you better",
        "Better than he can"
    ];

    // Change this to make lyrics faster/slower.
    // 500 = 0.5 seconds per line
    const lyricSpeed = 500;


    // ========================================
    // DISPLAY
    // ========================================

    function updateDisplay() {
        result.textContent = current === "" ? "0" : current;
    }


    // ========================================
    // ADD VALUE
    // ========================================

    function addValue(value) {

        console.log("Button pressed:", value);

        const operators = ["+", "-", "*", "/", "%"];

        // Operator
        if (operators.includes(value)) {

            if (current === "") {

                // Only allow minus as first character
                if (value === "-") {
                    current = "-";
                }

                updateDisplay();
                return;
            }

            const last =
                current.charAt(current.length - 1);

            // Replace an existing operator
            if (operators.includes(last)) {

                current =
                    current.substring(0, current.length - 1)
                    + value;

            } else {

                current += value;
            }

            updateDisplay();
            return;
        }


        // Decimal
        if (value === ".") {

            const parts =
                current.split(/[+\-*/%]/);

            const lastNumber =
                parts[parts.length - 1];

            if (lastNumber.includes(".")) {
                return;
            }

            if (lastNumber === "") {
                current += "0.";
            } else {
                current += ".";
            }

            updateDisplay();
            return;
        }


        // Number
        current += value;

        updateDisplay();
    }


    // ========================================
    // DELETE
    // ========================================

    function deleteLast() {

        current =
            current.substring(0, current.length - 1);

        updateDisplay();
    }


    // ========================================
    // CLEAR
    // ========================================

    function clearCalculator() {

        current = "";

        expression.textContent = "";
        lyric.textContent = "";
        status.textContent = "";

        stopLyrics();

        if (song) {
            song.pause();
            song.currentTime = 0;
        }

        updateDisplay();
    }


    // ========================================
    // LYRICS
    // ========================================

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

        lyricTimer = setInterval(function () {

            lyricIndex++;

            if (lyricIndex >= lyrics.length) {

                stopLyrics();
                return;
            }

            showLyric(lyrics[lyricIndex]);

        }, lyricSpeed);
    }


    function stopLyrics() {

        if (lyricTimer !== null) {

            clearInterval(lyricTimer);

            lyricTimer = null;
        }

        lyricIndex = 0;
    }


    // ========================================
    // CALCULATE / PLAY
    // ========================================

    function calculate() {

        if (current === "") {
            return;
        }

        const last =
            current.charAt(current.length - 1);

        if ("+-*/%.".includes(last)) {
            return;
        }

        expression.textContent =
            current + " =";

        result.textContent = "🎵";

        result.classList.remove("flash");

        void result.offsetWidth;

        result.classList.add("flash");

        status.textContent =
            "♪ Now playing";

        if (song) {

            song.pause();
            song.currentTime = 0;

        }

        startLyrics();

        if (!muted && song) {

            song.play().catch(function () {

                status.textContent =
                    "♪ Click 🔊 to enable audio";

            });
        }
    }


    // ========================================
    // BUTTONS
    // ========================================

    const buttons =
        document.querySelectorAll(".key");

    console.log("Calculator buttons found:", buttons.length);

    buttons.forEach(function (button) {

        button.addEventListener("click", function () {

            const action =
                button.getAttribute("data-action");

            const value =
                button.getAttribute("data-value");


            if (action === "clear") {

                clearCalculator();

                return;
            }


            if (action === "delete") {

                deleteLast();

                return;
            }


            if (action === "equals") {

                calculate();

                return;
            }


            if (value !== null) {

                addValue(value);

            }

        });

    });


    // ========================================
    // KEYBOARD
    // ========================================

    document.addEventListener("keydown", function (event) {

        const key = event.key;

        if (/^[0-9]$/.test(key)) {

            addValue(key);

        }

        else if ("+-*/%.".includes(key)) {

            addValue(key);

        }

        else if (
            key === "Enter" ||
            key === "="
        ) {

            event.preventDefault();

            calculate();

        }

        else if (key === "Backspace") {

            deleteLast();

        }

        else if (key === "Escape") {

            clearCalculator();

        }

    });


    // ========================================
    // SOUND BUTTON
    // ========================================

    if (soundBtn) {

        soundBtn.addEventListener("click", function () {

            muted = !muted;

            if (muted) {

                if (song) {
                    song.pause();
                }

                stopLyrics();

                soundBtn.textContent = "🔇";

                status.textContent = "♪ Muted";

            } else {

                soundBtn.textContent = "🔊";

                if (expression.textContent !== "") {

                    if (song) {

                        song.play().catch(function () {
                            console.log("Audio playback blocked.");
                        });

                    }

                    startLyrics();

                    status.textContent =
                        "♪ Now playing";
                }
            }

        });

    }


    // ========================================
    // AUDIO
    // ========================================

    if (song) {

        song.addEventListener("ended", function () {

            stopLyrics();

            status.textContent =
                "♪ Finished";

        });

    }


    // ========================================
    // INITIALIZE
    // ========================================

    updateDisplay();

});
