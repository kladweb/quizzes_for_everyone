import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initTheme } from "./utils/theme";
import { registerFonts } from "./components/TestPDF/fonts";

initTheme();
registerFonts();

const container = document.getElementById("root");
if (!container) throw new Error("Root container missing in index.html");
createRoot(container).render(
  <StrictMode>
    <App/>
  </StrictMode>,
);
