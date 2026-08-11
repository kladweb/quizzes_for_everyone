import React from "react";
import { NavLink, useMatch } from "react-router-dom";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";
import { type IUser, loginGoogle, logoutGoogle, useIsAuthLoading, useRole, useUser } from "../../store/useUserStore";
import { TokenBadge } from "../TokenBadge/TokenBadge";
import "./header.css"
import { addTokensToUser } from "../../api/adminActions";

export const Header: React.FC = () => {
  const isQuizPage = useMatch("/quizzes/:testid");
  const user: IUser | null = useUser();
  const isAuthLoading = useIsAuthLoading();
  const role = useRole();

  return (
    <header className="header-container">
      <NavLink className='link-logo' to={'/'}>
        <img className="logo-image" src="/images/Logo_v3.png" alt="logo"/>
        <h1>ANY QUIZ</h1>
      </NavLink>
      <button onClick={async () => {
        const ttt = await addTokensToUser();
        console.log(ttt);
      }}>
        TEST
      </button>
      <div className="nav-container">
        <nav className="navbar">
          {
            role === "admin" &&
            <NavLink className='link-nav link-admin' to={'/admin'}>
              <span>admin</span>
            </NavLink>
          }
          <NavLink className='link-nav' to={'/allquizzes'}>
            <span>ВСЕ ТЕСТЫ</span>
          </NavLink>
          {
            user &&
            <NavLink className='link-nav' to={'/myquizzes'}>
              <span>МОИ ТЕСТЫ</span>
            </NavLink>
          }
        </nav>
        {
          user &&
          <TokenBadge/>
        }
        <div className="login-theme">
          {
            !isQuizPage &&
            <>
              {
                user ?
                  <button className='btn button-login' onClick={logoutGoogle}>LOGOUT</button> :
                  <button className='btn button-login ' onClick={loginGoogle} disabled={isAuthLoading}>
                    {isAuthLoading ? "..." : "LOGIN"}
                  </button>
              }
            </>
          }
          <ThemeSwitch/>
        </div>
      </div>
    </header>
  );
};
