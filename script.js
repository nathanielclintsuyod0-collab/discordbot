document.addEventListener("DOMContentLoaded", function () {

    // ==============================
    // GET HTML ELEMENTS
    // ==============================

    const result = document.getElementById("result");
    const expression = document.getElementById("expression");
    const lyric = document.getElementById("lyric");
    const status = document.getElementById("status");
    const song = document.getElementById("song");
    const soundBtn = document.getElementById("soundBtn");

    let current = "";
    let lyricTimer = null;
    let lyricIndex = 0;
    let muted = false;


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


    // ==============================
    // LYRIC SPEED
    // ==============================
    // Lower = faster
    //
    // 1000 = 1 second
    // 500  = 0.5 second
    // 300  = 0.3 second
    // 200  = 0.2 second

    const lyricSpeed = 500;


    // ==============================
    // UPDATE CALCULATOR
    // ==============================

    function updateDisplay() {

        if (current === "") {
            result.textContent = "0";
        } else {
            result.textContent = current;
        }

    }


    // ==============================
    // ADD NUMBER / OPERATOR
    // ==============================

    function add(value) {

        const operators = "+-*/%";

        // Operator
        if (operators.includes(value)) {

            // Don't allow operator as first character
            // except minus
            if (current === "") {

                if (value === "-") {
                    current = "-";
                } else {
                    return;
                }

            } else {

                const lastCharacter =
                    current.charAt(current.length - 1);

                // Replace previous operator
                if (operators.includes(lastCharacter)) {

                    current =
                        current.substring(0, current.length - 1)
                        + value;

                } else {

                    current += value;

                }

            }

        }

        // Decimal
        else if (value === ".") {

            const numbers =
                current.split(/[+\-*/%]/);

            const lastNumber =
                numbers[numbers.length - 1];

            // Don't allow two decimals
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


    // ==============================
    // DELETE
    // ==============================

    function deleteLast() {

        current =
            current.substring(0, current.length - 1);

        updateDisplay();
    }


    // ==============================
    // STOP LYRICS
    // ==============================

    function stopLyrics() {

        if (lyricTimer !== null) {

            clearInterval(lyricTimer);

            lyricTimer = null;
        }

        lyricIndex = 0;
    }


    // ==============================
    // SHOW LYRIC
    // ==============================

    function showLyric(text) {

        lyric.textContent = text;

        lyric.classList.remove("active");

        // Restart CSS animation
        void lyric.offsetWidth;

        lyric.classList.add("active");
    }


    // ==============================
    // START LYRICS
    // ==============================

    function startLyrics() {

        stopLyrics();

        if (lyrics.length === 0) {
            return;
        }

        lyricIndex = 0;

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


    // ==============================
    // CLEAR
    // ==============================

    function clearCalculator() {

        current = "";

        expression.textContent = "";
        result.textContent = "0";
        lyric.textContent = "";
        status.textContent = "";

        stopLyrics();

        song.pause();

        song.currentTime = 0;
    }


    // ==============================
    // EQUALS
    // ==============================

    function calculate() {

        // Nothing entered
        if (current === "") {
            return;
        }

        // Don't play with incomplete calculation
        const last =
            current.charAt(current.length - 1);

        if ("+-*/%.".includes(last)) {
            return;
        }


        // Show expression
        expression.textContent =
            current + " =";


        // Show music icon
        result.textContent = "🎵";


        // Animation
        result.classList.remove("flash");

        void result.offsetWidth;

        result.classList.add("flash");


        // Reset lyrics
        lyric.textContent = "";

        status.textContent =
            "♪ Now playing";


        // Reset audio
        song.pause();

        song.currentTime = 0;


        // Start lyrics
        startLyrics();


        // Play music
        if (!muted) {

            song.play()
                .then(function () {

                    status.textContent =
                        "♪ Now playing";

                })
                .catch(function () {

                    status.textContent =
                        "♪ Audio blocked — press 🔊";

                    stopLyrics();

                });

        }

    }


    // ==============================
    // CALCULATOR BUTTONS
    // ==============================

    const buttons =
        document.querySelectorAll(".key");


    buttons.forEach(function (button) {

        button.addEventListener("click", function () {

            const action =
                button.getAttribute("data-action");

            const value =
                button.getAttribute("data-value");


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
            else if (value !== null) {

                add(value);

            }

        });

    });


    // ==============================
    // KEYBOARD
    // ==============================

    document.addEventListener(
        "keydown",
        function (event) {

            const key = event.key;


            // Numbers
            if (
                key >= "0" &&
                key <= "9"
            ) {

                add(key);

            }


            // Operators
            else if (
                "+-*/%.".includes(key)
            ) {

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
            else if (
                key === "Backspace"
            ) {

                deleteLast();

            }


            // Escape
            else if (
                key === "Escape"
            ) {

                clearCalculator();

            }

        }
    );


    // ==============================
    // SOUND BUTTON
    // ==============================

    soundBtn.addEventListener(
        "click",
        function () {

            muted = !muted;


            if (muted) {

                song.pause();

                stopLyrics();

                soundBtn.textContent = "🔇";

                status.textContent =
                    "♪ Muted";

            } else {

                soundBtn.textContent = "🔊";


                if (
                    expression.textContent !== ""
                ) {

                    song.play()
                        .then(function () {

                            startLyrics();

                            status.textContent =
                                "♪ Now playing";

                        })
                        .catch(function () {

                            status.textContent =
                                "♪ Unable to play audio";

                        });

                }

            }

        }
    );


    // ==============================
    // SONG FINISHED
    // ==============================

    song.addEventListener(
        "ended",
        function () {

            stopLyrics();

            status.textContent =
                "♪ Finished";

        }
    );


    // ==============================
    // SONG ERROR
    // ==============================

    song.addEventListener(
        "error",
        function () {

            status.textContent =
                "⚠ song.mp3 not found";

            stopLyrics();

        }
    );


    // ==============================
    // INITIAL DISPLAY
    // ==============================

    updateDisplay();

});
