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
    // LYRICS + INDIVIDUAL TIMING
    // =========================================
    //
    // duration is in milliseconds.
    //
    // 1000 = 1 second
    // 500  = 0.5 seconds
    // 250  = 0.25 seconds
    //
    // Change each duration separately to sync
    // each line with your song.mp3.
    // =========================================

    const lyrics = [
        {
            text: "Tell me, why are we wasting time",
            duration: 1000
        },

        {
            text: "On all your wasted cryin'",
            duration: 1200
        },

        {
            text: "When you should be with me instead?",
            duration: 1700
        },

        {
            text: "I know I can treat you better",
            duration: 1400
        },

        {
            text: "Better than he can",
            duration: 2000
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


        // Operator
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
                        current.slice(0, -1) + value;

                } else {

                    current += value;

                }

            }

        }


        // Decimal
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


        // Number
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
            current.slice(0, -1);

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

        // Restart CSS animation
        void lyric.offsetWidth;

        lyric.classList.add("active");
    }


    // =========================================
    // START LYRICS
    // =========================================

    function startLyrics() {

        stopLyrics();

        lyricIndex = 0;


        if (lyrics.length === 0) {
            return;
        }


        function showNextLine() {

            // Finished all lyrics
            if (lyricIndex >= lyrics.length) {

                stopLyrics();

                return;
            }


            const line =
                lyrics[lyricIndex];


            // Show current line
            showLyric(line.text);


            // Wait THIS LINE'S duration
            lyricTimer = setTimeout(() => {

                lyricIndex++;

                showNextLine();

            }, line.duration);

        }


        showNextLine();
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
    // EQUALS / PLAY
    // =========================================

    function calculate() {

        if (current === "") {
            return;
        }


        const last =
            current.charAt(current.length - 1);


        // Don't start with incomplete expression
        if ("+-*/%.".includes(last)) {
            return;
        }


        // Show expression
        expression.textContent =
            current + " =";


        // Replace answer with music icon
        result.textContent = "🎵";


        // Animation
        result.classList.remove("flash");

        void result.offsetWidth;

        result.classList.add("flash");


        // Status
        status.textContent =
            "♪ Now playing";


        // Reset song
        song.pause();
        song.currentTime = 0;


        // Start synchronized lyrics
        startLyrics();


        // Play audio
        if (!muted) {

            song.play().catch(() => {

                status.textContent =
                    "♪ Click 🔊 to enable audio";

            });

        }

    }


    // =========================================
    // CALCULATOR BUTTONS
    // =========================================

    document.querySelectorAll(".key").forEach(button => {

        button.addEventListener("click", () => {

            const action =
                button.dataset.action;

            const value =
                button.dataset.value;


            // AC
            if (action === "clear") {

                clearCalculator();

            }


            // DELETE
            else if (action === "delete") {

                deleteLast();

            }


            // EQUALS
            else if (action === "equals") {

                calculate();

            }


            // Number/operator
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


        // Numbers
        if (/^[0-9]$/.test(key)) {

            add(key);

        }


        // Operators
        else if ("+-*/%.".includes(key)) {

            add(key);

        }


        // Enter
        else if (
            key === "Enter" ||
            key === "="
        ) {

            event.preventDefault();

            calculate();

        }


        // Backspace
        else if (key === "Backspace") {

            deleteLast();

        }


        // Escape
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


            if (expression.textContent !== "") {

                song.play();

                startLyrics();

                status.textContent =
                    "♪ Now playing";

            }

        }

    });


    // =========================================
    // AUDIO FINISHED
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
