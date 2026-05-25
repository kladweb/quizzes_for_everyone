import React, { useState } from "react";
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { ResultPDF } from "../DocsPDF/ResultPDF";
import { type IQuizPDFResultProps } from "../DocsPDF/QuizPDF";
import { getSafeFileName } from "../../../utils/quizUtils";
import { showToast } from "../../../store/useNoticeStore";
import { ToastType } from "../../../types/Quiz";
import "./downloadPDFResultButton.css";

export const DownloadPDFResultButton: React.FC<IQuizPDFResultProps> = ({quiz, result}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      const blob = await pdf(<ResultPDF quiz={quiz} result={result}/>).toBlob();
      saveAs(blob, `${getSafeFileName(quiz.title)}_result.pdf`);
    } catch (error) {
      console.error("Ошибка генерации PDF:", error);
      showToast("Ошибка генерации PDF. Возможно, Ваши результаты устарели.", ToastType.ERROR);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      className="qetResult"
      onClick={handleDownload}
      disabled={isGenerating}
    >
      Сохранить результат в pdf-файл
    </button>
  );
};
