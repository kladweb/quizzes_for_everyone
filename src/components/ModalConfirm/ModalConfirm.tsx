import React, { useEffect, useState } from "react";
import "./modalConfirm.css"

interface IModalConfirmProps {
  isModalConfirmOpen: boolean;
  setIsModalConfirmOpen: (isModalConfirmOpen: boolean) => void;
}

export const ModalConfirm: React.FC<IModalConfirmProps> = (
  {
    isModalConfirmOpen,
    setIsModalConfirmOpen
  }) => {


  return (
    <div className={`modal-confirm ${isModalConfirmOpen ? 'is-active' : ''}`}>
      <div className="modal-content">
        <h2>{"text"}</h2>
        <button className="btn btn-modal" onClick={() => setIsModalConfirmOpen(false)}>НЕТ</button>
        <button className="btn btn-modal">ДА</button>
      </div>
    </div>
  )
}
