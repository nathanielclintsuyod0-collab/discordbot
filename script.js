const result = document.getElementById("result");
const expression = document.getElementById("expression");
const lyric = document.getElementById("lyric");
const status = document.getElementById("status");
const song = document.getElementById("song");
const soundBtn = document.getElementById("soundBtn");

let current = "";
let muted = false;
let lyricTimer = null;

// ==============================
// LYRICS
// ==============================
// time = seconds into the MP3
const lyrics = [
    { time: 0.0, text: "Tell me, why are we wasting time" },
    { time: 1.5, text: "On all your wasted cryin'" },
    { time: 3.0, text: "When you should be with me instead?" },
    { time: 4.8, text: "I know I can treat you better" },
    { time: 6.2, text: "Better than he can" }
];


// ==============================
// CALCULATOR
// ==============================

function updateDisplay() {
    result.textContent = current || "0";
}

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

    song.pause();
    song.currentTime = 0;

    stopLyrics();

    updateDisplay();
}


// ==============================
// LYRIC DISPLAY
// ==============================

function showLyric(text) {

    lyric.textContent = text;

    // Restart animation
    lyric.classList.remove("active");

    void lyric.offsetWidth;

    lyric.classList.add("active");
}


// ==============================
// START LYRIC SYNC
// ==============================

function startLyrics() {

    stopLyrics();

    if (lyrics.length === 0) {
        return;
    }

    let index = 0;

    showLyric(lyrics[0].text);

    lyricTimer = setInterval(() => {

        if (song.paused || song.ended) {
            return;
        }

        const currentTime = song.currentTime;

        while (
            index + 1 < lyrics.length &&
            currentTime >= lyrics[index + 1].time
        ) {

            index++;

            showLyric(lyrics[index].text);
        }

    }, 20);
}


// ==============================
// STOP LYRIC SYNC
// ==============================

function stopLyrics() {

    if (lyricTimer !== null) {

        clearInterval(lyricTimer);

        lyricTimer = null;
    }
}


// ==============================
// CALCULATE / PLAY SONG
// ==============================

function calculate() {

    if (!current) {
        return;
    }

    // Prevent incomplete calculations
    if (/[+\-*/%.]$/.test(current)) {
        return;
    }

    expression.textContent = `${current} =`;

    // Instead of showing the answer
    result.textContent = "🎵";

    // Animation
    result.classList.remove("flash");

    void result.offsetWidth;

    result.classList.add("flash");

    lyric.textContent = "";

    status.textContent = "♪ Now playing";

    // Restart song
    song.currentTime = 0;

    // Start lyrics
    startLyrics();

    // Play audio
    if (!muted) {

        song.play().catch(() => {

            status.textContent =
                "♪ Press 🔊 to enable audio";

        });
    }
}


// ==============================
// CALCULATOR BUTTONS
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

        } else {

            add(value);
        }
    });
});


// ==============================
// KEYBOARD
// ==============================

document.addEventListener("keydown", event => {

    // Numbers
    if (/^[0-9]$/.test(event.key)) {

        add(event.key);

    }

    // Operators
    else if ("+-*/%.".includes(event.key)) {

        add(event.key);

    }

    // Enter / =
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


// ==============================
// SOUND BUTTON
// ==============================

soundBtn.addEventListener("click", () => {

    muted = !muted;

    if (muted) {

        song.pause();

        soundBtn.textContent = "🔇";

        status.textContent = "♪ Muted";

    } else {

        soundBtn.textContent = "🔊";

        if (expression.textContent) {

            song.play().catch(() => {});

            status.textContent = "♪ Now playing";
        }
    }
});


// ==============================
// AUDIO EVENTS
// ==============================

song.addEventListener("play", () => {

    startLyrics();
});


song.addEventListener("pause", () => {

    stopLyrics();
});


song.addEventListener("ended", () => {

    stopLyrics();

    status.textContent = "♪ Finished";
});


// ==============================
// SEEKING
// ==============================

song.addEventListener("seeked", () => {

    if (song.paused) {
        return;
    }

    let currentIndex = 0;

    for (let i = 0; i < lyrics.length; i++) {

        if (song.currentTime >= lyrics[i].time) {

            currentIndex = i;

        } else {

            break;
        }
    }

    showLyric(lyrics[currentIndex].text);
});
