import React, { useEffect } from "react";
import { Navigate, NavLink } from "react-router-dom";
import { loginGoogle, useIsAuthLoading, useUser } from "../../store/useUserStore";

export const PageMain = () => {
  const user = useUser();
  const isAuthLoading = useIsAuthLoading();

  useEffect(() => {
    document.title = "ANY QUIZ";
  }, []);

  if (user) {
    return <Navigate to="/createquiz" replace/>;
  }

  return (
    <>
      <div className='tests-container'>
        <NavLink to='/allquizzes'>
          <img className="main-image" src="open.png" alt="any-quiz" title="Перейти к списку всех тестов"/>
        </NavLink>
        <div className='noticeBlock'>
          <p className='noticeText'>Авторизуйтесь, чтобы начать создавать свои тесты...</p>
        </div>
        <button className='btn button-login ' onClick={loginGoogle} disabled={isAuthLoading}>
          {isAuthLoading ? "GOOGLE IN..." : "GOOGLE LOGIN"}
        </button>
        <NavLink className='link-nav link-all-quizzes' to={'/allquizzes'}>
          <span>Перейти к списку всех тестов</span>
        </NavLink>
      </div>
    </>
  );
}
