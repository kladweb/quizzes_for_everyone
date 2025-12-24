import { useState } from "react";
import { setTheme } from "../../utils/theme";
import "./themeToggle.css";

export function ThemeToggle() {
  const [theme, setCurrentTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "light"
  );

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    setCurrentTheme(next);
  };

  return (
    <button
      className='theme-toggle'
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
