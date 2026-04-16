const minutesEl = document.querySelector("#minutes");
const secondsEl = document.querySelector("#seconds");
const form = document.querySelector("#time-form");
const durationInput = document.querySelector("#duration");
const startPauseBtn = document.querySelector("#start-pause");
const resetBtn = document.querySelector("#reset");
const statusEl = document.querySelector("#status");
const quickButtons = document.querySelectorAll("[data-minutes]");
const panel = document.querySelector(".timer-panel");
const alarm = document.querySelector("#alarm");

let totalSeconds = 5 * 60;
let remainingSeconds = totalSeconds;
let timerId = null;
let isRunning = false;

function formatTime(value) {
  return String(value).padStart(2, "0");
}

function updateDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  minutesEl.textContent = formatTime(minutes);
  secondsEl.textContent = formatTime(seconds);
  document.title = `${formatTime(minutes)}:${formatTime(seconds)} 倒數計時器`;
}

function setStatus(message) {
  statusEl.textContent = message;
}

function stopTimer() {
  window.clearInterval(timerId);
  timerId = null;
  isRunning = false;
  startPauseBtn.textContent = "開始";
}

function setDuration(minutes) {
  const safeMinutes = Math.min(Math.max(Number(minutes) || 1, 1), 999);
  totalSeconds = safeMinutes * 60;
  remainingSeconds = totalSeconds;
  durationInput.value = safeMinutes;
  panel.classList.remove("finished");
  stopTimer();
  updateDisplay();
  setStatus(`已設定 ${safeMinutes} 分鐘。`);
}

function finishTimer() {
  stopTimer();
  remainingSeconds = 0;
  updateDisplay();
  panel.classList.remove("finished");
  void panel.offsetWidth;
  panel.classList.add("finished");
  setStatus("時間到。");
  alarm.currentTime = 0;
  alarm.play().catch(() => {
    setStatus("時間到。");
  });
}

function tick() {
  if (remainingSeconds <= 1) {
    finishTimer();
    return;
  }

  remainingSeconds -= 1;
  updateDisplay();
}

function startTimer() {
  if (remainingSeconds <= 0) {
    remainingSeconds = totalSeconds;
  }

  isRunning = true;
  startPauseBtn.textContent = "暫停";
  setStatus("倒數中。");
  timerId = window.setInterval(tick, 1000);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  setDuration(durationInput.value);
});

quickButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setDuration(button.dataset.minutes);
  });
});

startPauseBtn.addEventListener("click", () => {
  if (isRunning) {
    stopTimer();
    setStatus("已暫停。");
    return;
  }

  startTimer();
});

resetBtn.addEventListener("click", () => {
  remainingSeconds = totalSeconds;
  panel.classList.remove("finished");
  stopTimer();
  updateDisplay();
  setStatus("已重設。");
});

updateDisplay();
