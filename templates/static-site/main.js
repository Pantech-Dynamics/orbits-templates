// The theme switch remembers its choice; with none, the system's setting wins.
const root = document.documentElement;
const saved = (() => {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
})();
if (saved) root.dataset.theme = saved;

document.querySelector(".theme")?.addEventListener("click", () => {
  const dark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
  try {
    localStorage.setItem("theme", root.dataset.theme);
  } catch {}
});

const counter = document.querySelector("[data-count]");
let clicks = 0;
counter?.addEventListener("click", () => {
  clicks += 1;
  counter.textContent = `Clicked ${clicks} ${clicks === 1 ? "time" : "times"}`;
});
