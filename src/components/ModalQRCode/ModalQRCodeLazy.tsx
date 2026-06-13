import React, { useEffect, useState, type ComponentType } from "react";

interface IModalQRCodeProps {
  url: string;
  qrCodeToShow: string | null;
  setQrCodeToShow: (quizCode: string | null) => void;
}

type ModalQRCodeComponent = ComponentType<IModalQRCodeProps>;

export const ModalQRCodeLazy: React.FC<IModalQRCodeProps> = (props) => {
  const [ModalQRCode, setModalQRCode] = useState<ModalQRCodeComponent | null>(null);

  useEffect(() => {
    if (!props.qrCodeToShow || ModalQRCode) {
      return;
    }

    void import("./ModalQRCode").then((module) => {
      setModalQRCode(() => module.ModalQRCode);
    });
  }, [props.qrCodeToShow, ModalQRCode]);

  if (!ModalQRCode) {
    return null;
  }

  return <ModalQRCode {...props}/>;
};
