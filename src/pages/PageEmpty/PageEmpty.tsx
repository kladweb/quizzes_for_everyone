import React from "react";
import {useNavigate} from "react-router-dom";
import "./pageEmpty.css"

interface IPageEmptyProps {
  emptyReason: "quizDeleted" | "notExistPage" | "pageDevelopment";
}

export const PageEmpty: React.FC<IPageEmptyProps> = ({emptyReason}) => {
  const navigate = useNavigate();
  const errorsPage = {
    quizDeleted: "Ошибка! Возможно, тест удалён!",
    notExistPage: "Ошибка! Данной страницы не существует!",
    pageDevelopment: "Ошибка! Данная страница ещё в разработке...\nПопробуйте, пожалуйста, позднее!"
  }

  const goToMain = () => {
    navigate("/");
  }

  return (
    <div className="page-empty-container">
      <p className='text-page-empty'>{errorsPage[emptyReason]}</p>
      <button className='btn button-to-main' onClick={goToMain}>ПЕРЕЙТИ НА ГЛАВНУЮ</button>
    </div>
  )
}