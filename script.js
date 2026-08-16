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


    // =========================================
    // LYRICS
    // =========================================
    //
    // duration = HOW LONG THE LINE STAYS
    // on screen.
    //
    // 1000 = 1 second
    // 2000 = 2 seconds
    // 3000 = 3 seconds
    //
    // =========================================

    const lyrics = [

        {
            text: "Tell me, why are we wasting time",
            duration: 2800
        },

        {
            text: "On all your wasted cryin'",
            duration: 1900
        },

        {
            text: "When you should be with me instead?",
            duration: 2600
        },

        {
            text: "I know I can treat you better",
            duration: 3100
        },

        {
            text: "Better than he can",
            duration: 1800
        }

    ];


    // =========================================
    // DISPLAY
    // =========================================

    function updateDisplay() {

        result.textContent =
            current === "" ? "0" : current;

    }


    // =========================================
    // ADD VALUE
    // =========================================

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

                const last =
                    current.charAt(current.length - 1);

                if (operators.includes(last)) {

                    current =
                        current.substring(
                            0,
                            current.length - 1
                        ) + value;

                } else {

                    current += value;

                }

            }

        }


        else if (value === ".") {

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

        }


        else {

            current += value;

        }


        updateDisplay();

    }


    // =========================================
    // DELETE
    // =========================================

    function deleteLast() {

        current =
            current.substring(
                0,
                current.length - 1
            );

        updateDisplay();

    }


    // =========================================
    // CLEAR
    // =========================================

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


    // =========================================
    // SHOW LYRIC
    // =========================================

    function showLyric(text) {

        lyric.textContent = text;

        lyric.classList.remove("active");

        void lyric.offsetWidth;

        lyric.classList.add("active");

    }


    // =========================================
    // START LYRICS
    // =========================================

    function startLyrics() {

        stopLyrics();

        lyricIndex = 0;


        function playNextLyric() {

            if (
                lyricIndex >= lyrics.length
            ) {

                stopLyrics();

                return;

            }


            const currentLyric =
                lyrics[lyricIndex];


            // Show the lyric

            showLyric(
                currentLyric.text
            );


            // WAIT FOR THIS LINE'S
            // INDIVIDUAL DURATION

            lyricTimer = setTimeout(() => {

                lyricIndex++;

                playNextLyric();

            }, currentLyric.duration);

        }


        playNextLyric();

    }


    // =========================================
    // STOP LYRICS
    // =========================================

    function stopLyrics() {

        if (lyricTimer !== null) {

            clearTimeout(lyricTimer);

            lyricTimer = null;

        }

        lyricIndex = 0;

    }


    // =========================================
    // CALCULATE
    // =========================================

    function calculate() {

        if (current === "") {
            return;
        }


        const last =
            current.charAt(
                current.length - 1
            );


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


        song.pause();

        song.currentTime = 0;


        startLyrics();


        if (!muted) {

            song.play().catch(() => {

                status.textContent =
                    "♪ Click 🔊 to enable audio";

            });

        }

    }


    // =========================================
    // BUTTONS
    // =========================================

    document.querySelectorAll(".key").forEach(button => {

        button.addEventListener("click", () => {

            const action =
                button.dataset.action;

            const value =
                button.dataset.value;


            if (action === "clear") {

                clearCalculator();

            }

            else if (action === "delete") {

                deleteLast();

            }

            else if (action === "equals") {

                calculate();

            }

            else if (value !== undefined) {

                add(value);

            }

        });

    });


    // =========================================
    // KEYBOARD
    // =========================================

    document.addEventListener("keydown", event => {

        const key = event.key;


        if (/^[0-9]$/.test(key)) {

            add(key);

        }

        else if ("+-*/%.".includes(key)) {

            add(key);

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


    // =========================================
    // SOUND BUTTON
    // =========================================

    soundBtn.addEventListener("click", () => {

        muted = !muted;


        if (muted) {

            song.pause();

            stopLyrics();

            soundBtn.textContent = "🔇";

            status.textContent = "♪ Muted";

        }

        else {

            soundBtn.textContent = "🔊";


            if (expression.textContent) {

                song.play();

                startLyrics();

                status.textContent =
                    "♪ Now playing";

            }

        }

    });


    // =========================================
    // SONG ENDED
    // =========================================

    song.addEventListener("ended", () => {

        stopLyrics();

        status.textContent =
            "♪ Finished";

    });


    // =========================================
    // INITIAL DISPLAY
    // =========================================

    updateDisplay();

});
