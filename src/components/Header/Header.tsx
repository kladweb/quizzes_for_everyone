import React, {useEffect} from "react";
import {NavLink} from "react-router-dom";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";
import {initUser, loginGoogle, logoutGoogle, useUser} from "../../store/useUserStore";
import {loadUserQuizzes} from "../../store/useMyQuizzesStore";
import "./header.css"

export const Header: React.FC = () => {
  const user = useUser();
  console.log(location.pathname);


  useEffect(
    () => {
      console.log("INIT...");
      initUser();
      if (user) {
        loadUserQuizzes(user.uid);
      }
    }, [user?.uid]);

  return (
    <header className="header-container">
      <NavLink className='link-logo' to={'/createquiz'}>
        <img className="logo-image" src="../../../public/images/Logo_v3.png" alt="logo"/>
        <h1>ANY QUIZ</h1>
      </NavLink>
      <div>
        {
          (user) ?
            <button className='btn button-login' onClick={logoutGoogle}>LOGOUT</button> :
            <button className='btn button-login ' onClick={loginGoogle}>GOOGLE LOGIN</button>
        }
        <ThemeSwitch/>
      </div>
    </header>
  );
};
