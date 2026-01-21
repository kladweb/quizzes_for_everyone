import React, {useEffect} from "react";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";
import "./header.css"
import {initUser, loginGoogle, logoutGoogle, useUser} from "../../store/useUserStore";

export const Header: React.FC = () => {
  const user = useUser();

  useEffect(
    () => {
      initUser();
    }, [user?.uid]);

  return (
    <header className="header-container">
      {
        (user) ?
          <button className='btn button-login' onClick={logoutGoogle}>LOGOUT</button> :
          <button className='btn button-login ' onClick={loginGoogle}>GOOGLE LOGIN</button>
      }
      <ThemeSwitch/>
    </header>
  );
};
