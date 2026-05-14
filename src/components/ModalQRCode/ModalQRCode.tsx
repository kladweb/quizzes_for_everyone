import React from "react";
import { QRCode } from "react-qr-code";
import "./modalQRCode.css";

interface IModalQRCodeProps {
  url: string;
  setQrCodeToShow: (quizCode: string | null) => void;
}

export const ModalQRCode: React.FC<IModalQRCodeProps> = ({url, setQrCodeToShow}) => {
  // const root = document.documentElement;
  // const value = getComputedStyle(root).getPropertyValue('--color-selected-bg').trim();
  return (
    <div
      className="modal-QRCode"
      onClick={() => setQrCodeToShow(null)}
    >
      <div className="qr-code">
        <QRCode value={url}/>
      </div>
    </div>
  )
}
