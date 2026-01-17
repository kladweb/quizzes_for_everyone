import React, {useEffect} from "react";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";
import "./header.css"
import {initUser, useUser} from "../../store/useUserStore";

export const Header: React.FC = () => {
  const user = useUser();

  useEffect(
    () => {
      initUser();
    }, [user?.uid]);

  return (
    <header className="header-container">
      <ThemeSwitch/>
    </header>
  );
};
