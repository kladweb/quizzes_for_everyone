import React, { useEffect, useState } from "react";
import "./modalConfirm.css"
import type { Quiz } from "../../types/Quiz";

interface IModalConfirmProps {
  isModalConfirmOpen: boolean;
  quizToDelete: Quiz;
  modalQuestion: string;
  handlerConfirmDelete: (testId: string, toDeleteQuiz: boolean) => void;
}

export const ModalConfirm: React.FC<IModalConfirmProps> = (
  {
    isModalConfirmOpen,
    quizToDelete,
    modalQuestion,
    handlerConfirmDelete
  }) => {

  return (
    <div className={`modal-confirm ${isModalConfirmOpen ? 'is-active' : ''}`}>
      <div className="modal-content">
        <h2>{modalQuestion}</h2>
        <button className="btn btn-modal" onClick={() => handlerConfirmDelete(quizToDelete.testId, false)}>НЕТ</button>
        <button className="btn btn-modal" onClick={() => handlerConfirmDelete(quizToDelete.testId, true)}>ДА</button>
      </div>
    </div>
  )
}
