import React from "react";
import "./header.css"
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";

export const Header: React.FC = () => {

  return (
    <header className="header-container">
      <ThemeSwitch/>
    </header>
  );
};
