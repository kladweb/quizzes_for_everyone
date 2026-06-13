import React, { lazy, Suspense, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { QRCode } from "react-qr-code";
import { clearCurrentQuiz, useQuizComplete } from "../../store/useCurrentCreatingQuiz";
import "./linkQuiz.css";

const ModalQRCodeLazy = lazy(() =>
  import("../ModalQRCode/ModalQRCodeLazy").then((module) => ({
    default: module.ModalQRCodeLazy,
  })));

export const LinkQuiz: React.FC<{ testId: string }> = ({testId}) => {
  const navigate = useNavigate();
  const quizComplete = useQuizComplete();
  const [copied, setCopied] = useState(false);
  const currentLink = `${window.location.origin}/quizzes/${testId}`;
  const [qrCodeToShow, setQrCodeToShow] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCreateNewTest = () => {
    clearCurrentQuiz();
    navigate("/createquiz");
  }

  return (
    <div className='link-block'>
      <h2 className="test-load-info">
        Тест
        <br/>
        <span>{`"${quizComplete?.title}"`}</span>
        <br/>
        успешно сохранён!
      </h2>
      <h4 className='link-head'>Ваша ссылка на страницу с тестом:</h4>
      <NavLink className='link-body' to={currentLink}>{currentLink}</NavLink>
      <p className="link-info">Кликните по ссылке для перехода к выполнению теста.</p>
      <p className="link-info">Или скопируйте ссылку в буфер для того чтобы ею поделиться.</p>
      <button
        className={`btn btn-link-copy ${copied ? " btn-link-copy--copied" : ""}`}
        onClick={handleCopy}
      >
        {copied ? 'Скопировано!' : 'Копировать ссылку на тест в буфер'}
      </button>
      <button className="btn button-qrcode" onClick={() => setQrCodeToShow(testId)}>
        <QRCode value={currentLink} size={100}/>
      </button>
      <button className="btn btn-link-create" onClick={handleCreateNewTest}>Создать ещё один тест</button>
      {qrCodeToShow &&
        <Suspense fallback={null}>
          <ModalQRCodeLazy
            url={`https://any-quiz.netlify.app/quizzes/${qrCodeToShow}`}
            qrCodeToShow={qrCodeToShow}
            setQrCodeToShow={setQrCodeToShow}
          />
        </Suspense>
      }
    </div>
  )
}
