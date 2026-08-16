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

// ==========================================
// LYRICS
// ==========================================
// These are the lyrics you provided.
// The lyric speed is controlled separately
// from the MP3 so you can make them move faster.
const lyrics = [
    "Tell me, why are we wasting time",
    "On all your wasted cryin'",
    "When you should be with me instead?",
    "I know I can treat you better",
    "Better than he can"
];

// ==========================================
// LYRIC SPEED
// ==========================================
// Lower number = faster lyrics.
//
// 1000 = 1 second per line
// 750  = 0.75 second per line
// 500  = 0.5 second per line
// 300  = 0.3 second per line
// 200  = 0.2 second per line
//
// Change this value if you want them faster/slower.
const lyricSpeed = 500;


// ==========================================
// CALCULATOR DISPLAY
// ==========================================

function updateDisplay() {
    result.textContent = current || "0";
}


// ==========================================
// ADD INPUT
// ==========================================

function add(value) {
    const operators = "+-*/%";

    if (operators.includes(value)) {

        if (!current) {

            if (value === "-") {
                current = "-";
            } else {
                return;
            }

        } else if (operators.includes(current.slice(-1))) {

            current = current.slice(0, -1) + value;

        } else {

            current += value;
        }

    } else if (value === ".") {

        const lastNumber = current.split(/[+\-*/%]/).pop();

        if (lastNumber.includes(".")) {
            return;
        }

        current += lastNumber ? "." : "0.";

    } else {

        current += value;
    }

    updateDisplay();
}


// ==========================================
// DELETE
// ==========================================

function deleteLast() {

    current = current.slice(0, -1);

    updateDisplay();
}


// ==========================================
// CLEAR
// ==========================================

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


// ==========================================
// LYRIC ANIMATION
// ==========================================

function showLyric(text) {

    lyric.textContent = text;

    lyric.classList.remove("active");

    // Force browser to restart animation
    void lyric.offsetWidth;

    lyric.classList.add("active");
}


// ==========================================
// START LYRICS
// ==========================================

function startLyrics() {

    stopLyrics();

    if (lyrics.length === 0) {
        return;
    }

    lyricIndex = 0;

    showLyric(lyrics[lyricIndex]);

    /*
        IMPORTANT:

        This timer is completely independent
        from song.currentTime.

        This means changing lyricSpeed
        actually changes how fast the lyrics
        move.
    */

    lyricTimer = setInterval(() => {

        lyricIndex++;

        if (lyricIndex >= lyrics.length) {

            stopLyrics();

            return;
        }

        showLyric(lyrics[lyricIndex]);

    }, lyricSpeed);
}


// ==========================================
// STOP LYRICS
// ==========================================

function stopLyrics() {

    if (lyricTimer !== null) {

        clearInterval(lyricTimer);

        lyricTimer = null;
    }

    lyricIndex = 0;
}


// ==========================================
// CALCULATE / START SONG
// ==========================================

function calculate() {

    if (!current) {
        return;
    }

    // Don't start if expression ends with
    // an operator.
    if (/[+\-*/%.]$/.test(current)) {
        return;
    }

    // Show entered calculation.
    expression.textContent = `${current} =`;

    // We intentionally don't display the answer.
    result.textContent = "🎵";

    // Restart result animation.
    result.classList.remove("flash");

    void result.offsetWidth;

    result.classList.add("flash");

    // Reset lyric display.
    lyric.textContent = "";

    status.textContent = "♪ Now playing";

    // Restart audio.
    song.pause();
    song.currentTime = 0;

    // Start lyrics independently.
    startLyrics();

    // Play song.
    if (!muted) {

        song.play().catch(() => {

            status.textContent =
                "♪ Press 🔊 to enable audio";

        });

    }
}


// ==========================================
// CALCULATOR BUTTONS
// ==========================================

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

        } else {

            add(value);
        }
    });

});


// ==========================================
// KEYBOARD CONTROLS
// ==========================================

document.addEventListener("keydown", event => {

    // Numbers
    if (/^[0-9]$/.test(event.key)) {

        add(event.key);

    }

    // Operators
    else if ("+-*/%.".includes(event.key)) {

        add(event.key);

    }

    // Enter or =
    else if (
        event.key === "Enter" ||
        event.key === "="
    ) {

        event.preventDefault();

        calculate();
    }

    // Backspace
    else if (event.key === "Backspace") {

        deleteLast();
    }

    // Escape
    else if (event.key === "Escape") {

        clearCalculator();
    }

});


// ==========================================
// SOUND BUTTON
// ==========================================

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

            song.play().catch(() => {});

            startLyrics();

            status.textContent = "♪ Now playing";
        }
    }
});


// ==========================================
// AUDIO EVENTS
// ==========================================

song.addEventListener("ended", () => {

    stopLyrics();

    status.textContent = "♪ Finished";
});


// ==========================================
// OPTIONAL: AUDIO ERROR
// ==========================================

song.addEventListener("error", () => {

    status.textContent =
        "⚠ Unable to load song.mp3";

});


// ==========================================
// INITIAL STATE
// ==========================================

updateDisplay();

    showLyric(lyrics[currentIndex].text);
});
