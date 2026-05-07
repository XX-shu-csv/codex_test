const modeLabels = {
  aurora: "Aurora Rain",
  storm: "Silent Storm",
  sunset: "Pocket Sunset",
  mist: "Morning Mist",
};

const buttons = document.querySelectorAll("[data-mode]");
const currentMode = document.querySelector("#current-mode");
const sidebarMode = document.querySelector("#sidebar-mode");

document.body.dataset.mode = "aurora";

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.dataset.mode;
    document.body.dataset.mode = mode;
    currentMode.textContent = modeLabels[mode];
    sidebarMode.textContent = modeLabels[mode];

    buttons.forEach((item) => item.classList.toggle("active", item.dataset.mode === mode));
  });
});

document.querySelector(".reserve-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button");
  button.textContent = "予約リストに追加済み";
  button.disabled = true;
});
