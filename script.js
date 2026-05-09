const MIN_NUMBER = 2;
const MAX_NUMBER = 999;

const setupForm = document.querySelector("#setup-form");
const maxNumberInput = document.querySelector("#max-number");
const stepButtons = document.querySelectorAll("[data-step]");
const formMessage = document.querySelector("#form-message");
const drawSurface = document.querySelector("#draw-surface");
const statusText = document.querySelector("#status-text");
const resultNumber = document.querySelector("#result-number");
const tapHint = document.querySelector("#tap-hint");
const remainingCount = document.querySelector("#remaining-count");
const drawnCount = document.querySelector("#drawn-count");
const maxCount = document.querySelector("#max-count");
const resetButton = document.querySelector("#reset-button");
const restartButton = document.querySelector("#restart-button");
const historySummary = document.querySelector("#history-summary");
const historyList = document.querySelector("#history-list");
const settingsSheet = document.querySelector("#settings-sheet");
const historySheet = document.querySelector("#history-sheet");
const helpSheet = document.querySelector("#help-sheet");
const settingsButtons = document.querySelectorAll("#settings-toggle, #settings-shortcut");
const historyToggle = document.querySelector("#history-toggle");
const helpToggle = document.querySelector("#help-toggle");
const closeSheetButtons = document.querySelectorAll("[data-close-sheet]");

let maxNumber = null;
let availableNumbers = [];
let drawnNumbers = [];
let isComplete = false;

function validateMaxNumber(value) {
  const trimmedValue = String(value).trim();
  const number = Number(trimmedValue);

  if (!trimmedValue) {
    return { valid: false, message: "最大の数字を入力してください。" };
  }

  if (!/^\d+$/.test(trimmedValue)) {
    return { valid: false, message: "小数ではなく整数を入力してください。" };
  }

  if (!Number.isInteger(number)) {
    return { valid: false, message: "小数ではなく整数を入力してください。" };
  }

  if (number < MIN_NUMBER || number > MAX_NUMBER) {
    return { valid: false, message: `${MIN_NUMBER}〜${MAX_NUMBER}の整数を入力してください。` };
  }

  return { valid: true, number };
}

function shuffleNumbers(limit) {
  const numbers = Array.from({ length: limit }, (_, index) => index + 1);

  for (let index = numbers.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [numbers[index], numbers[randomIndex]] = [numbers[randomIndex], numbers[index]];
  }

  return numbers;
}

function resetActiveDrawIfNeeded() {
  if (maxNumber !== null || drawnNumbers.length > 0) {
    resetDraw();
  }
}

function stepMaxNumber(direction) {
  const currentNumber = Number(maxNumberInput.value);
  const baseNumber = Number.isFinite(currentNumber) ? Math.trunc(currentNumber) : MIN_NUMBER;
  const nextNumber = Math.min(MAX_NUMBER, Math.max(MIN_NUMBER, baseNumber + direction));

  maxNumberInput.value = String(nextNumber);
  resetActiveDrawIfNeeded();
  maxNumberInput.focus();
}

function closeSheets() {
  [settingsSheet, historySheet, helpSheet].forEach((sheet) => sheet.classList.add("hidden"));
}

function toggleSheet(sheet) {
  const isOpen = !sheet.classList.contains("hidden");
  closeSheets();

  if (!isOpen) {
    sheet.classList.remove("hidden");
  }
}

function startDraw(limit) {
  maxNumber = limit;
  availableNumbers = shuffleNumbers(limit);
  drawnNumbers = [];
  isComplete = false;

  maxNumberInput.value = String(limit);
  formMessage.textContent = "準備できました。大きなエリアをタップしてください。";
  formMessage.dataset.state = "success";
  drawSurface.disabled = false;
  resetButton.disabled = false;
  restartButton.classList.add("hidden");

  statusText.textContent = "準備完了";
  resultNumber.textContent = "--";
  tapHint.textContent = "タップして次の数字を表示";
  closeSheets();

  renderState();
}

function drawNextNumber() {
  if (!maxNumber || isComplete || availableNumbers.length === 0) {
    return;
  }

  const nextNumber = availableNumbers.pop();
  drawnNumbers.push(nextNumber);

  statusText.textContent = `${drawnNumbers.length}番目`;
  resultNumber.textContent = String(nextNumber);

  if (availableNumbers.length === 0) {
    completeDraw();
  } else {
    tapHint.textContent = "もう一度タップして次へ";
  }

  renderState();
}

function completeDraw() {
  isComplete = true;
  drawSurface.disabled = true;
  statusText.textContent = "完了";
  tapHint.textContent = "すべて表示しました。もう一度はじめる場合は確認ボタンを押してください。";
  restartButton.classList.remove("hidden");
}

function resetDraw() {
  maxNumber = null;
  availableNumbers = [];
  drawnNumbers = [];
  isComplete = false;

  drawSurface.disabled = true;
  resetButton.disabled = true;
  restartButton.classList.add("hidden");
  formMessage.textContent = "2〜999の整数を入力してください。";
  formMessage.dataset.state = "";
  statusText.textContent = "数字を入力して開始";
  resultNumber.textContent = "--";
  tapHint.textContent = "開始すると、この大きなエリアをタップして抽選できます";

  renderState();
}

function renderState() {
  remainingCount.textContent = String(availableNumbers.length);
  drawnCount.textContent = String(drawnNumbers.length);
  maxCount.textContent = maxNumber ? String(maxNumber) : "未設定";
  historyList.innerHTML = "";

  if (drawnNumbers.length === 0) {
    historySummary.textContent = "まだありません";
    return;
  }

  historySummary.textContent = `${drawnNumbers.length}件`;

  drawnNumbers.forEach((number, index) => {
    const item = document.createElement("li");
    item.innerHTML = `<span>${index + 1}番目</span><strong>${number}</strong>`;
    historyList.prepend(item);
  });
}

setupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const result = validateMaxNumber(maxNumberInput.value);

  if (!result.valid) {
    formMessage.textContent = result.message;
    formMessage.dataset.state = "error";
    maxNumberInput.focus();
    return;
  }

  startDraw(result.number);
});

maxNumberInput.addEventListener("input", () => {
  resetActiveDrawIfNeeded();
});

stepButtons.forEach((button) => {
  button.addEventListener("click", () => {
    stepMaxNumber(Number(button.dataset.step));
  });
});

settingsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    toggleSheet(settingsSheet);
  });
});

historyToggle.addEventListener("click", () => {
  toggleSheet(historySheet);
});

helpToggle.addEventListener("click", () => {
  toggleSheet(helpSheet);
});

closeSheetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(`#${button.dataset.closeSheet}`).classList.add("hidden");
  });
});

drawSurface.addEventListener("click", drawNextNumber);

resetButton.addEventListener("click", () => {
  resetDraw();
  maxNumberInput.focus();
});

restartButton.addEventListener("click", () => {
  const result = validateMaxNumber(maxNumberInput.value);
  startDraw(result.valid ? result.number : maxNumber);
});

renderState();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
