// The theme switch: light, dark, or the system's setting. The choice was applied before the first paint by the
// script in <head>; this marks the current one and changes it.
const root = document.documentElement;
const choices = document.querySelectorAll("[data-theme-choice]");

function mark() {
  const current = root.dataset.theme ?? "";
  choices.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.themeChoice === current)));
}

choices.forEach((b) =>
  b.addEventListener("click", () => {
    const choice = b.dataset.themeChoice;
    if (choice) root.dataset.theme = choice;
    else delete root.dataset.theme;
    try {
      if (choice) localStorage.setItem("theme", choice);
      else localStorage.removeItem("theme");
    } catch {}
    mark();
  }),
);
mark();

const counter = document.querySelector("[data-count]");
let clicks = 0;
counter?.addEventListener("click", () => {
  clicks += 1;
  counter.textContent = `Clicked ${clicks} ${clicks === 1 ? "time" : "times"}`;
});
