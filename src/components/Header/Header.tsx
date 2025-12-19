import React from "react";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import "./header.css"

export const Header: React.FC = () => {

  return (
    <header className="header-container">
      <ThemeToggle/>
    </header>
  );
};
