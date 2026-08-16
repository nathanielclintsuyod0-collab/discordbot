document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // ELEMENTS
    // =========================================

    const result = document.getElementById("result");
    const expression = document.getElementById("expression");
    const lyric = document.getElementById("lyric");
    const status = document.getElementById("status");
    const song = document.getElementById("song");
    const soundBtn = document.getElementById("soundBtn");


    // =========================================
    // CALCULATOR VARIABLES
    // =========================================

    let current = "";
    let muted = false;


    // =========================================
    // LYRIC VARIABLES
    // =========================================

    let currentLyricIndex = -1;


    // =========================================
    // LYRICS
    // =========================================
    //
    // "start" = when that lyric starts in song.mp3
    //
    // Time is in SECONDS.
    //
    // Example:
    // start: 2.50 = 2.5 seconds
    // start: 5.25 = 5.25 seconds
    //
    // Change these values to synchronize the
    // lyrics with YOUR song.mp3.
    // =========================================

    const lyrics = [

        {
            text: "Tell me, why are we wasting time",
            start: 0.00
        },

        {
            text: "On all your wasted cryin'",
            start: 2.00
        },

        {
            text: "When you should be with me instead?",
            start: 3.50
        },

        {
            text: "I know I can treat you better",
            start: 5.50
        },

        {
            text: "Better than he can",
            start: 7.50
        }

    ];


    // =========================================
    // DISPLAY
    // =========================================

    function updateDisplay() {

        if (current === "") {

            result.textContent = "0";

        } else {

            result.textContent = current;

        }

    }


    // =========================================
    // ADD NUMBER / OPERATOR
    // =========================================

    function add(value) {

        const operators = "+-*/%";


        // -----------------------------
        // OPERATOR
        // -----------------------------

        if (operators.includes(value)) {

            if (current === "") {

                // Only allow minus at beginning

                if (value === "-") {

                    current = "-";

                } else {

                    return;

                }

            } else {

                const last =
                    current.charAt(current.length - 1);


                // Replace previous operator

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


        // -----------------------------
        // DECIMAL
        // -----------------------------

        else if (value === ".") {

            const parts =
                current.split(/[+\-*/%]/);

            const lastNumber =
                parts[parts.length - 1];


            // Prevent multiple decimals

            if (lastNumber.includes(".")) {

                return;

            }


            if (lastNumber === "") {

                current += "0.";

            } else {

                current += ".";

            }

        }


        // -----------------------------
        // NUMBER
        // -----------------------------

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

        currentLyricIndex = -1;


        // Stop song

        song.pause();

        song.currentTime = 0;


        updateDisplay();

    }


    // =========================================
    // SHOW LYRIC
    // =========================================

    function showLyric(text) {

        lyric.textContent = text;


        // Restart CSS animation

        lyric.classList.remove("active");

        void lyric.offsetWidth;

        lyric.classList.add("active");

    }


    // =========================================
    // SYNCHRONIZE LYRICS
    // =========================================
    //
    // This function uses song.currentTime.
    //
    // The MP3 is the clock.
    // =========================================

    function syncLyrics() {

        if (!song) {

            return;

        }


        const time =
            song.currentTime;


        let newIndex = -1;


        // Find the latest lyric whose
        // start time has been reached.

        for (
            let i = 0;
            i < lyrics.length;
            i++
        ) {

            if (
                time >= lyrics[i].start
            ) {

                newIndex = i;

            } else {

                break;

            }

        }


        // No lyric yet

        if (newIndex === -1) {

            return;

        }


        // Don't repeatedly redraw
        // the same lyric.

        if (
            newIndex !== currentLyricIndex
        ) {

            currentLyricIndex =
                newIndex;


            showLyric(
                lyrics[newIndex].text
            );

        }

    }


    // =========================================
    // CALCULATE / PLAY SONG
    // =========================================

    function calculate() {

        if (current === "") {

            return;

        }


        const last =
            current.charAt(
                current.length - 1
            );


        // Don't play if expression ends
        // with an operator.

        if (
            "+-*/%.".includes(last)
        ) {

            return;

        }


        // Show expression

        expression.textContent =
            current + " =";


        // Show music icon

        result.textContent = "🎵";


        // Result animation

        result.classList.remove("flash");

        void result.offsetWidth;

        result.classList.add("flash");


        // Reset lyric position

        currentLyricIndex = -1;

        lyric.textContent = "";


        status.textContent =
            "♪ Now playing";


        // Restart song

        song.pause();

        song.currentTime = 0;


        // Play song

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

    const buttons =
        document.querySelectorAll(".key");


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.action;

                const value =
                    button.dataset.value;


                // AC

                if (
                    action === "clear"
                ) {

                    clearCalculator();

                }


                // DELETE

                else if (
                    action === "delete"
                ) {

                    deleteLast();

                }


                // EQUALS

                else if (
                    action === "equals"
                ) {

                    calculate();

                }


                // Number / operator

                else if (
                    value !== undefined
                ) {

                    add(value);

                }

            }
        );

    });


    // =========================================
    // KEYBOARD
    // =========================================

    document.addEventListener(
        "keydown",
        event => {

            const key =
                event.key;


            // Numbers

            if (
                /^[0-9]$/.test(key)
            ) {

                add(key);

            }


            // Operators

            else if (
                "+-*/%.".includes(key)
            ) {

                add(key);

            }


            // ENTER

            else if (
                key === "Enter" ||
                key === "="
            ) {

                event.preventDefault();

                calculate();

            }


            // BACKSPACE

            else if (
                key === "Backspace"
            ) {

                event.preventDefault();

                deleteLast();

            }


            // ESCAPE

            else if (
                key === "Escape"
            ) {

                clearCalculator();

            }

        }
    );


    // =========================================
    // SOUND BUTTON
    // =========================================

    soundBtn.addEventListener(
        "click",
        () => {

            muted = !muted;


            // -----------------------------
            // MUTED
            // -----------------------------

            if (muted) {

                song.pause();

                soundBtn.textContent =
                    "🔇";

                status.textContent =
                    "♪ Muted";

            }


            // -----------------------------
            // UNMUTED
            // -----------------------------

            else {

                soundBtn.textContent =
                    "🔊";


                if (
                    expression.textContent !== ""
                ) {

                    song.play().catch(() => {

                        status.textContent =
                            "♪ Unable to play audio";

                    });

                    status.textContent =
                        "♪ Now playing";

                }

            }

        }
    );


    // =========================================
    // SONG PLAYBACK
    // =========================================

    song.addEventListener(
        "play",
        () => {

            status.textContent =
                "♪ Now playing";

        }
    );


    // =========================================
    // SONG PAUSED
    // =========================================

    song.addEventListener(
        "pause",
        () => {

            if (
                song.currentTime > 0 &&
                !song.ended &&
                !muted
            ) {

                status.textContent =
                    "♪ Paused";

            }

        }
    );


    // =========================================
    // SONG FINISHED
    // =========================================

    song.addEventListener(
        "ended",
        () => {

            currentLyricIndex = -1;

            lyric.textContent = "";

            status.textContent =
                "♪ Finished";

        }
    );


    // =========================================
    // AUDIO ERROR
    // =========================================

    song.addEventListener(
        "error",
        () => {

            status.textContent =
                "⚠ song.mp3 not found";

        }
    );


    // =========================================
    // MOST IMPORTANT PART
    // =========================================
    //
    // Every time the MP3 playback position
    // changes, check the lyrics.
    //
    // This means the MP3 controls the lyrics,
    // NOT a separate timer.
    // =========================================

    song.addEventListener(
        "timeupdate",
        syncLyrics
    );


    // =========================================
    // INITIALIZE
    // =========================================

    updateDisplay();

});
