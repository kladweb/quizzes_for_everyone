import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { loginGoogle, useIsAuthLoading, useUser } from "../../store/useUserStore";
import { clearCurrentQuiz } from "../../store/useCurrentCreatingQuiz";
import { Skeleton } from "../../components/Skeleton/Skeleton";

export const PageMain = () => {
  const navigate = useNavigate();
  const user = useUser();
  const isAuthLoading = useIsAuthLoading();
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  useEffect(() => {
    document.title = "ANY QUIZ";
  }, []);

  const createQuiz = () => {
    clearCurrentQuiz();
    navigate("/createquiz");
  }

  const takeQuiz = () => {
    navigate("/allquizzes");
  }

  return (
    <div className='tests-container'>
      {!isImgLoaded && <Skeleton height={"67cqw"} className={"main-image"}/>}
      <NavLink to='/allquizzes'>
        <img
          className={`main-image${isImgLoaded ? "" : " hidden"}`}
          src="/open.png"
          alt="any-quiz"
          title="Перейти к списку всех тестов"
          onLoad={() => setIsImgLoaded(true)}
          onError={() => setIsImgLoaded(true)}
        />
      </NavLink>
      {
        user ?
          <div className='noticeBlock'>
            <p className='noticeText'>Что Вы хотите сделать?</p>
            <button className='btn button-main' onClick={createQuiz}>Создать новый тест</button>
            <button className='btn button-main' onClick={takeQuiz}>Пройти тест</button>
          </div> :
          <div className='noticeBlock'>
            <p className='noticeText'>Авторизуйтесь, чтобы начать создавать свои тесты...</p>
            <button className='btn button-login ' onClick={loginGoogle} disabled={isAuthLoading}>
              {isAuthLoading ? "GOOGLE IN..." : "GOOGLE LOGIN"}
            </button>
          </div>
      }
      <NavLink className='link-nav link-all-quizzes' to={'/allquizzes'}>
        <span>Перейти к списку всех тестов</span>
      </NavLink>
    </div>
  );
}
