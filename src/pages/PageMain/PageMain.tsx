import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { loginGoogle, useIsAuthLoading, useUser } from "../../store/useUserStore";

export const PageMain = () => {
  const user = useUser();
  const isAuthLoading = useIsAuthLoading();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ANY QUIZ";
    if (user) {
      console.log("Ловушка 2");
      navigate("/createquiz");
    }
  }, [user?.uid]);

  return (
    <div className='tests-container'>
      <NavLink to='/allquizzes'>
        <img className="main-image" src="open.png" alt="any-quiz"/>
      </NavLink>
      <div className='noticeBlock'>
        <p className='noticeText'>Авторизуйтесь, чтобы начать создавать свои тесты...</p>
      </div>
      <button className='btn button-login ' onClick={loginGoogle} disabled={isAuthLoading}>
        {isAuthLoading ? "GOOGLE IN..." : "GOOGLE LOGIN"}
      </button>
    </div>
  );
}
