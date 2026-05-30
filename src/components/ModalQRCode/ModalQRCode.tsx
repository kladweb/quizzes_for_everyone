import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCode } from "react-qr-code";
import "./modalQRCode.css";

interface IModalQRCodeProps {
  url: string;
  qrCodeToShow: string | null;
  setQrCodeToShow: (quizCode: string | null) => void;
}

export const ModalQRCode: React.FC<IModalQRCodeProps> = ({url, qrCodeToShow, setQrCodeToShow}) => {
  return (
    <AnimatePresence>
      {qrCodeToShow &&
        <motion.div
          className="modal-container"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{ ease: "easeInOut", duration: 0.5 }}
        >
          <div
            className="modal-QRCode"
            onClick={() => setQrCodeToShow(null)}
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
