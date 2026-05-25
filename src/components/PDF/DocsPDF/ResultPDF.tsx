import React from "react";
import { Document, Page, Text, View } from '@react-pdf/renderer';
import type { IQuizMeta, IStatistics, Question } from "../../../types/Quiz";
import { stylesGen, stylesQResult, stylesQuiz } from "./stylesPDF";
import {
  Checkbox, CheckboxChecked, CorrectMark, IncorrectMark, RadioButton,
  RadioButtonChecked
} from "./SvgComponents";

export interface IQuizPDFResultProps {
  quiz: IQuizMeta;
  result: IStatistics;
}

export const ResultPDF: React.FC<IQuizPDFResultProps> = ({quiz, result}) => {

  return (
    <Document>
      <Page size="A4" style={stylesGen.page}>
        <Text style={stylesGen.header}>{`Результаты теста: "${quiz.title}"`}</Text>
        <Text style={stylesQResult.userName}>{`Исполнитель: ${result.userName}`}</Text>
        <View style={stylesQuiz.question}>
          <View style={stylesGen.optionRow}>
            <Text style={stylesGen.option}>{`Верных ответов: ${result.correctCount}`}</Text>
            <CorrectMark/>
          </View>
          <Text style={[stylesGen.optionRow, stylesGen.option]}>
            {`Неверных/частично верных ответов: ${result.incorrectCount}`}
          </Text>
          <Text style={[stylesGen.optionRow, stylesGen.option]}>
            {`Общий итог: ${result.totalScore.toFixed(2)} / ${result.maxScore}`}
          </Text>
          <Text style={[stylesGen.optionRow, stylesGen.option]}>{`Ваш результат: ${result.score}%`}</Text>
        </View>


        {quiz.questions?.map((q: Question, index) => {
          const isCheckbox = q.correctAnswers.length > 1;
          const isQuestionCorrect = result.answers[q.id].isCorrect;
          return (
            <View key={q.id} wrap={false}
                  style={[stylesQResult.answer,
                    isQuestionCorrect ? stylesQResult.answerCorrect : stylesQResult.answerWrong]}>
              <Text style={stylesGen.questionText}>
                {index + 1}) {q.question}
              </Text>
              {
                isCheckbox &&
                <Text style={stylesGen.questionNote}>
                  (несколько вариантов ответов)
                </Text>
              }
              {q.options.map((option, i) => {
                console.log(result.answers);

                const isChecked = result.answers[q.id].selectedOptionIds.includes(option.id);
                const isCorrect = result.answers[q.id].correctOptionIds.includes(option.id);

                if (isCheckbox && isChecked) {
                  return (
                    <View key={option.id} style={stylesGen.optionRow}>
                      {
                        isCorrect ? <CorrectMark/> : <IncorrectMark/>
                      }
                      <CheckboxChecked/>
                      <Text style={stylesGen.option}>
                        {option.text}
                      </Text>
                    </View>
                  );
                }

                if (isCheckbox) {
                  return (
                    <View key={option.id} style={stylesGen.optionRow}>
                      {
                        isCorrect && <CorrectMark/>
                      }
                      <Checkbox/>
                      <Text style={stylesGen.option}>
                        {option.text}
                      </Text>
                    </View>
                  );
                }

                if (!isCheckbox && isChecked) {
                  return (
                    <View key={option.id} style={stylesGen.optionRow}>
                      {
                        isCorrect ? <CorrectMark/> : <IncorrectMark/>
                      }
                      <RadioButtonChecked/>
                      <Text style={stylesGen.option}>
                        {option.text}
                      </Text>
                    </View>
                  );
                }

                if (!isCheckbox) {
                  return (
                    <View key={option.id} style={stylesGen.optionRow}>
                      {
                        isCorrect && <CorrectMark/>
                      }
                      <RadioButton/>
                      <Text style={stylesGen.option}>
                        {option.text}
                      </Text>
                    </View>
                  );
                }

              })}
              {
                q?.explanation &&
                <View style={stylesGen.optionRow}>
                  <Text style={[stylesGen.option, stylesQResult.explanation]}>
                    <Text style={stylesQResult.optionItalic}>Объяснение: </Text>
                    {q.explanation}
                  </Text>
                </View>
              }
            </View>
          )
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
  )
};
