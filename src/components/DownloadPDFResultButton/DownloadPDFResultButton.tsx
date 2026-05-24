import React, { useState } from "react";
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { type IQuizPDFResultProps, TestPDFResult } from "../TestPDF/TestPDF";
import { getSafeFileName } from "../../utils/quizUtils";
import "./downloadPDFResultButton.css";

export const DownloadPDFResultButton: React.FC<IQuizPDFResultProps> = ({quiz, result}) => {

  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      const blob = await pdf(
        <TestPDFResult quiz={quiz} result={result}/>
      ).toBlob();

      saveAs(blob, `${getSafeFileName(quiz.title)}_result.pdf`);
    } catch (error) {
      console.error("Ошибка генерации PDF:", error);
      // Здесь можно добавить toast с ошибкой
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      className="result-button qetResult"
      onClick={handleDownload}
      disabled={isGenerating}
    >
      Сохранить результат в pdf-файл
    </button>
  );
};

// import React from "react";
// import { usePDF } from '@react-pdf/renderer';
// import { saveAs } from 'file-saver';
// import { type IQuizPDFResultProps, TestPDF, TestPDFResult } from "../TestPDF/TestPDF";
// import { getSafeFileName } from "../../utils/quizUtils";
// import "./downloadPDFResultButton.css";
//
// export const DownloadPDFResultButton: React.FC<IQuizPDFResultProps> = ({quiz, result}) => {
//
//   const [instance, updateInstance] = usePDF({document: <TestPDFResult quiz={quiz} result={result}/>});
//
//   const handleDownload = async () => {
//     const {pdf} = await import('@react-pdf/renderer');
//     const blob = await pdf(<TestPDFResult quiz={quiz} result={result}/>).toBlob();
//     saveAs(blob, `${getSafeFileName(quiz.title)}.pdf`);
//   };
//
//   return (
//     <button
//       className="result-button qetResult"
//       onClick={handleDownload}
//       disabled={instance.loading || !instance.blob}
//     >
//       Сохранить результат в pdf-файл
//     </button>
//   );
// };
