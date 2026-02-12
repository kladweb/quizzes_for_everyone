import React from "react";
import "./modalConfirm.css"

interface IModalConfirmProps {
  isModalConfirmOpen: boolean;
  modalQuestion: string;
  handlerConfirmDelete: (toDelete: boolean) => void;
}

export const ModalConfirm: React.FC<IModalConfirmProps> = (
  {
    isModalConfirmOpen,
    modalQuestion,
    handlerConfirmDelete
  }) => {

  return (
    <div
      className={`modal-confirm ${isModalConfirmOpen ? 'is-active' : ''}`}
      onClick={() => handlerConfirmDelete(false)}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{modalQuestion}</h2>
        <button className="btn btn-modal" onClick={() => handlerConfirmDelete(false)}>НЕТ</button>
        <button className="btn btn-modal" onClick={() => handlerConfirmDelete(true)}>ДА</button>
      </div>
    </div>
  )
}
