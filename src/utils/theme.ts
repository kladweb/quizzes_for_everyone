export type Theme = "light" | "dark";

export function setTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

export function initTheme() {
  const savedTheme = localStorage.getItem("theme") as Theme | null;

  if (savedTheme) {
    setTheme(savedTheme);
    return;
  }

  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  setTheme(prefersDark ? "dark" : "light");
}
