import React from "react";
import "./pageEmpty.css"

interface IPageEmptyProps {
  emptyReason: "quizDeleted" | "notExistPage" | "pageDevelopment";
}

export const PageEmpty: React.FC<IPageEmptyProps> = ({emptyReason}) => {

  const errorsPage = {
    quizDeleted: "Ошибка! Возможно, тест удалён!",
    notExistPage: "Ошибка! Данной страницы не существует!",
    pageDevelopment: "Ошибка! Данная страница ещё в разработке...\nПопробуйте, пожалуйста, позднее!"
  }

  return (
    <div className="page-empty-container">
      <p className='text-page-empty'>{errorsPage[emptyReason]}</p>
    </div>
  )
}