
import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface FormattedTextProps {
  text: string;
}

interface FormulaProps {
  math: string;
  block?: boolean;
}

const Formula: React.FC<FormulaProps> = ({ math, block = false }) => {
  try {
    const html = katex.renderToString(math, {
      displayMode: block,
      throwOnError: false,
      trust: false,
    });

    return (
      <span
        className={block ? "formattedTextBlock" : undefined}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return (
      <span className="formula-error">
        {block ? `\\[${math}\\]` : `\\(${math}\\)`}
      </span>
    );
  }
};

export const FormattedText: React.FC<FormattedTextProps> = ({ text }) => {
  const parts = text.split(/(\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("\\[") && part.endsWith("\\]")) {
          return (
            <div key={index} className="formattedTextBlock">
              <Formula math={part.slice(2, -2)} block />
            </div>
          );
        }

        if (part.startsWith("\\(") && part.endsWith("\\)")) {
          return <Formula key={index} math={part.slice(2, -2)} />;
        }

        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
};
