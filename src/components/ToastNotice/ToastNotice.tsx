import React, { useEffect, useState } from "react";
import "./toastNotice.css";
import { useNotice, type Toast } from "../../store/useNoticeStore";

interface IToastProps {
  toast: Toast;
}

const Toast: React.FC<IToastProps> = ({toast}) => {
  const [show, setShow] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setShow("show");
    }, 50);
    setTimeout(() => {
      setShow("");
    }, 3000);
  }, [toast]);

  return (
    <div className={`toast toast-${toast.type} ${show}`}>{toast.message}</div>
  )
}

export const ToastNotice = () => {
  const notices: Toast[] = useNotice();

  return (
    <>
      {
        notices.length ?
          <div id="toast-container">
            {
              notices.map((notice: Toast) => <Toast key={notice.id} toast={notice}/>)
            }
          </div>
          :
          null
      }
    </>
  )
}
