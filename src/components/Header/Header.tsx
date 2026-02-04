import React, { useEffect } from "react";
import { NavLink, useMatch } from "react-router-dom";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";
import { initUser, loginGoogle, logoutGoogle, useIsAuthLoading, useUser } from "../../store/useUserStore";
import { loadAllQuizzes, loadUserQuizzes } from "../../store/useQuizzesStore";
import "./header.css"

export const Header: React.FC = () => {
  const isQuizPage = useMatch("/quizzes/:testid");
  const user = useUser();
  const isAuthLoading = useIsAuthLoading();

  useEffect(
    () => {
      initUser();
      loadAllQuizzes();
    }, []);

  useEffect(
    () => {
      if (user) {
        loadUserQuizzes(user.uid);
      }
    }, [user?.uid]);

  console.log(isAuthLoading);
  return (
    <header className="header-container">
      <NavLink className='link-logo' to={'/'}>
        <img className="logo-image" src="/images/Logo_v3.png" alt="logo"/>
        <h1>ANY QUIZ</h1>
      </NavLink>
      <div>
        <nav className="navbar">
          <NavLink className='link-nav' to={'/allquizzes'}>
            <span>ALL QUIZZES</span>
          </NavLink>
          {
            user &&
            <NavLink className='link-nav' to={'/myquizzes'}>
              <span>MY QUIZZES</span>
            </NavLink>
          }
        </nav>
        {
          !isQuizPage &&
          <>
            {
              user ?
                <button className='btn button-login' onClick={logoutGoogle}>LOGOUT</button> :
                <button className='btn button-login ' onClick={loginGoogle} disabled={isAuthLoading}>
                  {isAuthLoading ? "GOOGLE IN..." : "GOOGLE LOGIN"}
                </button>
            }
          </>
        }
        <ThemeSwitch/>
      </div>
    </header>
  );
};
