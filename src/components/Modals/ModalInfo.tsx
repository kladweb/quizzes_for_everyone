import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./modals.css"

interface IModalInfo {
  isModalInfoOpen: boolean;
  modalInfo: string;
  handlerClose: () => void;
}

export const ModalInfo: React.FC<IModalInfo> = (
  {
    isModalInfoOpen,
    modalInfo,
    handlerClose
  }) => {

  return (
    <AnimatePresence>
      {isModalInfoOpen &&
        <motion.div
          className="modal-container"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{ease: "easeInOut", duration: 0.4}}
        >
          <div
            className="modal-confirm"
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <p>{modalInfo}</p>
              <button className="btn btn-modal" onClick={handlerClose}>OK</button>
            </div>
          </div>
        </motion.div>
      }
    </AnimatePresence>
  )
}
