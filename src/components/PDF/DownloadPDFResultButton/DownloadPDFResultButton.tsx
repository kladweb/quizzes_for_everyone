import React, { useState } from "react";
import { saveAs } from 'file-saver';
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
      const [{ResultPDF}, {generatePDF}] = await Promise.all([
        import("../DocsPDF/ResultPDF"),
        import("../pdfService")
      ]);
      const blob = await generatePDF(
        <ResultPDF quiz={quiz} result={result}/>
      );
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
