const result = document.getElementById("result");
const expression = document.getElementById("expression");
const lyric = document.getElementById("lyric");
const status = document.getElementById("status");
const song = document.getElementById("song");
const soundBtn = document.getElementById("soundBtn");

let current = "";
let muted = false;
let lyricTimer = null;

// These are the lyrics you provided.
// Adjust the timestamps to match the exact timing of your audio.
const lyrics = [
  { time: 0.0, text: "Tell me, why are we wasting time" },
  { time: 1.5, text: "On all your wasted cryin'" },
  { time: 3.0, text: "When you should be with me instead?" },
  { time: 4.8, text: "I know I can treat you better" },
  { time: 6.2, text: "Better than he can" }
];

function updateDisplay() {
  result.textContent = current || "0";
}

function add(value) {
  const operators = "+-*/%";

  if (operators.includes(value)) {
    if (!current) {
      if (value === "-") current = "-";
      else return;
    } else if (operators.includes(current.at(-1))) {
      current = current.slice(0, -1) + value;
    } else {
      current += value;
    }
  } else if (value === ".") {
    const lastNumber = current.split(/[+\-*/%]/).pop();

    if (lastNumber.includes(".")) return;

    current += lastNumber ? "." : "0.";
  } else {
    current += value;
  }

  updateDisplay();
}

function clearCalculator() {
  current = "";
  expression.textContent = "";
  lyric.textContent = "";
  status.textContent = "";
  song.pause();
  song.currentTime = 0;
  clearInterval(lyricTimer);
  updateDisplay();
}

function deleteLast() {
  current = current.slice(0, -1);
  updateDisplay();
}

function startLyrics() {
  clearInterval(lyricTimer);

  if (!lyrics.length) return;

  let index = 0;
  lyric.textContent = lyrics[0].text;
  lyric.classList.remove("active");
  void lyric.offsetWidth;
  lyric.classList.add("active");

  lyricTimer = setInterval(() => {
    const time = song.currentTime;

    while (
      index + 1 < lyrics.length &&
      time >= lyrics[index + 1].time
    ) {
      index++;

      lyric.textContent = lyrics[index].text;
      lyric.classList.remove("active");
      void lyric.offsetWidth;
      lyric.classList.add("active");
    }

    if (song.ended) {
      clearInterval(lyricTimer);
      status.textContent = "";
    }
  }, 60);
}

function calculate() {
  if (!current || /[+\-*/%.]$/.test(current)) return;

  expression.textContent = `${current} =`;
  result.textContent = "🎵";
  result.classList.remove("flash");
  void result.offsetWidth;
  result.classList.add("flash");

  lyric.textContent = "";
  status.textContent = "♪ Now playing";

  song.currentTime = 0;
  startLyrics();

  if (!muted) {
    song.play().catch(() => {
      status.textContent = "♪ Press 🔊 to enable audio";
    });
  }
}

document.querySelectorAll(".key").forEach(button => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === "clear") clearCalculator();
    else if (action === "delete") deleteLast();
    else if (action === "equals") calculate();
    else add(value);
  });
});

document.addEventListener("keydown", event => {
  if (/^[0-9]$/.test(event.key)) add(event.key);
  else if ("+-*/%.".includes(event.key)) add(event.key);
  else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  } else if (event.key === "Backspace") {
    deleteLast();
  } else if (event.key === "Escape") {
    clearCalculator();
  }
});

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

song.addEventListener("ended", () => {
  clearInterval(lyricTimer);
  status.textContent = "♪ Finished";
});
