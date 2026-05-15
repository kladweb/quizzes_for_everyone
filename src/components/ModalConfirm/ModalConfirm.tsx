import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <AnimatePresence>
      {isModalConfirmOpen &&
        <motion.div
          className="modal-container"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{ease: "easeInOut", duration: 0.4}}
        >
          <div
            className={`modal-confirm`}
            onClick={() => handlerConfirmDelete(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{modalQuestion}</h2>
              <button className="btn btn-modal" onClick={() => handlerConfirmDelete(true)}>ДА</button>
              <button className="btn btn-modal" onClick={() => handlerConfirmDelete(false)}>НЕТ</button>
            </div>
          </div>
        </motion.div>
      }
    </AnimatePresence>
  )
}
