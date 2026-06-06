import React, { useState } from "react";
import { saveAs } from 'file-saver';
import { type IQuizPDFProps } from "../DocsPDF/QuizPDF";
import { getSafeFileName } from "../../../utils/quizUtils";
import { showToast } from "../../../store/useNoticeStore";
import { ToastType } from "../../../types/Quiz";
import "./downloadPDFQuizButton.css";

export const DownloadPDFQuizButton: React.FC<IQuizPDFProps> = ({quiz}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      const quizPDFModule = await import("../DocsPDF/QuizPDF");
      const pdfServiceModule = await import("../pdfService");
      const { QuizPDF } = quizPDFModule;
      const { generatePDF } = pdfServiceModule;
      const blob = await generatePDF(<QuizPDF quiz={quiz} />);

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
