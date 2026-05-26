import React, { useState } from "react";
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { type IQuizPDFProps, QuizPDF } from "../DocsPDF/QuizPDF";
import { getSafeFileName } from "../../../utils/quizUtils";
import { showToast } from "../../../store/useNoticeStore";
import { ToastType } from "../../../types/Quiz";
import "./downloadPDFQuizButton.css";

export const DownloadPDFQuizButton: React.FC<IQuizPDFProps> = ({quiz}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const blob = await pdf(<QuizPDF quiz={quiz}/>).toBlob();
      saveAs(blob, `${getSafeFileName(quiz.title)}.pdf`);
    } catch (error) {
      console.error("Ошибка генерации PDF:", error);
      showToast("Ошибка генерации PDF. Попробуйте позже...", ToastType.ERROR);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      className="btn getPdf-btn"
      onClick={handleDownload}
      disabled={isGenerating}
    >
      <img src="/images/pdfIcon.png" alt="get pdf" title="Сохранить pdf версию теста"/>
    </button>
  );
};
