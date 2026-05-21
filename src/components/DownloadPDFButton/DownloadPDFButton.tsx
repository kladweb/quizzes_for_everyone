import React from "react";
import { usePDF } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { type IQuizPDFProps, TestPDF } from "../TestPDF/TestPDF";
import { getSafeFileName } from "../../utils/quizUtils";


export const DownloadPDFButton: React.FC<IQuizPDFProps> = ({quiz}) => {

  const [instance, updateInstance] = usePDF({document: <TestPDF quiz={quiz}/>});

  const handleDownload = async () => {
    const {pdf} = await import('@react-pdf/renderer');
    const blob = await pdf(<TestPDF quiz={quiz}/>).toBlob();
    saveAs(blob, `${getSafeFileName(quiz.title)}.pdf`);
  };

  return (
    <button
      className="btn button-create"
      onClick={handleDownload}
      disabled={instance.loading || !instance.blob}
    >
      {instance.loading ? 'Генерация PDF...' : 'Скачать тест в PDF'}
    </button>
  );
};
