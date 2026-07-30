import React from "react";
import { useNavigate } from "react-router-dom";
import "./pageEmpty.css"

interface IPageEmptyProps {
  emptyReason: "quizDeleted" | "notExistPage" | "pageDevelopment" | "serviceWork" | "noCreatedQuizzes";
}

export const PageEmpty: React.FC<IPageEmptyProps> = ({emptyReason}) => {
  const navigate = useNavigate();
  const errorsPage = {
    quizDeleted: "Ошибка! Возможно, тест удалён!",
    notExistPage: "Ошибка! Данной страницы не существует!",
    pageDevelopment: "Ошибка! Данная страница ещё в разработке...\nПопробуйте, пожалуйста, позднее!",
    serviceWork: "Сервисные работы...",
    noCreatedQuizzes: "Здесь будет отображаться список созданных Вами тестов.\n\nВы ещё не создали ни одного теста."
  }

  return (
    <div className="page-empty-container">
      <p className='text-page-empty'>{errorsPage[emptyReason]}</p>
      {
        (emptyReason !== "serviceWork" && emptyReason !== "noCreatedQuizzes") &&
        <button className='btn button-to-main' onClick={() => {
          navigate("/")
        }}>ПЕРЕЙТИ НА ГЛАВНУЮ</button>
      }
      {
        (emptyReason === "noCreatedQuizzes") &&
        <button className='btn button-to-main' onClick={() => {
          navigate("/createquiz")
        }}>СОЗДАТЬ ТЕСТ</button>
      }
    </div>
  )
}
