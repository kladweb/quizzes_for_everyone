import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCode } from "react-qr-code";
import "./modalQRCode.css";

interface IModalQRCodeProps {
  url: string;
  setQrCodeToShow: (quizCode: string | null) => void;
}

export const ModalQRCode: React.FC<IModalQRCodeProps> = ({url, setQrCodeToShow}) => {
  const [showModal, setShowModal] = useState(true);

  return (
    <AnimatePresence onExitComplete={() => {
      setQrCodeToShow(null);
    }}>
      {showModal &&
        <motion.div
          className="modal-container"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{ease: "easeInOut", duration: 0.5}}
        >
          <div
            className="modal-QRCode"
            onClick={() => setShowModal(false)}
          >
            <div className="qr-code">
              <QRCode value={url}/>
            </div>
          </div>
        </motion.div>
      }
    </AnimatePresence>
  )
}
