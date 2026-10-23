import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { IQuizMeta, IStatistics, Question, } from "../../../types/Quiz";
import { stylesGen, stylesQResult, } from "./stylesPDF";
import {
  Checkbox, CheckboxChecked, CorrectMark, IncorrectMark, RadioButton,
  RadioButtonChecked,
} from "./SvgComponents";
import { formatScore } from "../../../utils/formatters";
import { PDFFormattedText } from "./PDFFormattedText";

export interface IQuizPDFResultProps {
  quiz: IQuizMeta;
  result: IStatistics;
}

export const ResultPDF: React.FC<IQuizPDFResultProps> = ({
                                                           quiz,
                                                           result,
                                                         }) => {
  return (
    <Document>
      <Page size="A4" style={stylesGen.page}>
        <Text style={stylesGen.header}>
          {`Результаты теста: "${quiz.title}"`}
        </Text>

        <Text style={stylesQResult.userName}>
          {`Исполнитель: ${result.userName}`}
        </Text>

        <View>
          <View style={stylesGen.optionRow}>
            <Text style={stylesGen.option}>
              {`Верных ответов: ${result.correctCount}`}
            </Text>
            <CorrectMark/>
          </View>

          <View style={stylesGen.optionRow}>
            <Text style={stylesGen.option}>
              {`Неверных/частично верных ответов: ${result.incorrectCount}`}
            </Text>
            <IncorrectMark/>
          </View>

          <View style={stylesGen.optionRow}>
            <Text style={stylesGen.option}>
              {`Общий итог: ${formatScore(result.totalScore)} / ${result.maxScore}`}
            </Text>
          </View>

          <View style={stylesGen.optionRow}>
            <Text style={stylesGen.option}>
              Ваш результат:
              <Text style={{fontWeight: "bold"}}>
                {` ${result.score}%`}
              </Text>
            </Text>
          </View>
        </View>

        <Text style={{textAlign: "center", marginBottom: 10}}>
          Ваши ответы:
        </Text>

        {quiz.questions?.map((q: Question, index) => {
          const answer = result.answers[q.id];

          const isCheckbox = q.correctAnswers.length > 1;
          const isQuestionCorrect = answer.isCorrect;

          return (
            <View
              key={q.id}
              wrap={false}
              style={[
                stylesQResult.answer,
                isQuestionCorrect
                  ? stylesQResult.answerCorrect
                  : stylesQResult.answerWrong,
              ]}
            >
              <PDFFormattedText
                text={`${index + 1}) ${q.question}`}
                style={stylesGen.questionText}
              />

              {isCheckbox && (
                <Text style={stylesGen.questionNote}>
                  (несколько вариантов ответов)
                </Text>
              )}

              {q.options.map((option) => {
                const isChecked =
                  answer.selectedOptionIds.includes(option.id);

                const isCorrect =
                  answer.correctOptionIds.includes(option.id);

                if (isCheckbox && isChecked) {
                  return (
                    <View
                      key={option.id}
                      style={stylesGen.optionRow}
                    >
                      {isCorrect ? (
                        <CorrectMark
                          style={stylesQResult.svgFirstMark}
                        />
                      ) : (
                        <IncorrectMark
                          style={stylesQResult.svgFirstMark}
                        />
                      )}

                      <CheckboxChecked/>

                      <PDFFormattedText
                        text={option.text}
                        style={stylesGen.option}
                      />
                    </View>
                  );
                }

                if (isCheckbox) {
                  return (
                    <View
                      key={option.id}
                      style={stylesGen.optionRow}
                    >
                      {isCorrect && (
                        <CorrectMark
                          style={stylesQResult.svgFirstMark}
                        />
                      )}

                      <Checkbox/>

                      <PDFFormattedText
                        text={option.text}
                        style={stylesGen.option}
                      />
                    </View>
                  );
                }

                if (isChecked) {
                  return (
                    <View
                      key={option.id}
                      style={stylesGen.optionRow}
                    >
                      {isCorrect ? (
                        <CorrectMark
                          style={stylesQResult.svgFirstMark}
                        />
                      ) : (
                        <IncorrectMark
                          style={stylesQResult.svgFirstMark}
                        />
                      )}

                      <RadioButtonChecked/>

                      <PDFFormattedText
                        text={option.text}
                        style={stylesGen.option}
                      />
                    </View>
                  );
                }

                return (
                  <View
                    key={option.id}
                    style={stylesGen.optionRow}
                  >
                    {isCorrect && (
                      <CorrectMark
                        style={stylesQResult.svgFirstMark}
                      />
                    )}

                    <RadioButton/>

                    <PDFFormattedText
                      text={option.text}
                      style={stylesGen.option}
                    />
                  </View>
                );
              })}

              {q.explanation && (
                <View
                  style={{
                    marginTop: 6,
                    marginLeft: 24,
                    maxWidth: "95%",
                    flexDirection: "column",
                  }}
                >
                  <Text style={[stylesGen.option, stylesQResult.explanation]}>
                    <Text style={stylesQResult.optionItalic}>
                      Объяснение:{" "}
                    </Text>
                  </Text>

                  <PDFFormattedText
                    text={q.explanation}
                    style={[
                      stylesGen.option,
                      stylesQResult.explanation,
                    ]}
                  />
                </View>
              )}
            </View>
          );
        })}

        <View style={stylesGen.footer} fixed>
          <Text style={stylesGen.footerTitle}>
            {`Результаты теста: "${quiz.title}"`}
          </Text>

          <Text
            render={({pageNumber, totalPages}) =>
              `Страница ${pageNumber} из ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};
