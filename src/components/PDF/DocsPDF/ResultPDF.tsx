import React from "react";
import { Document, Page, Text, View } from '@react-pdf/renderer';
import type { IQuizMeta, IStatistics, Question } from "../../../types/Quiz";
import { stylesGen, stylesQResult, stylesQuiz } from "./stylesPDF";
import {
  Checkbox, CheckboxChecked, CorrectMark, IncorrectMark, RadioButton,
  RadioButtonChecked
} from "./SvgComponents";
import { formatScore } from "../../../utils/formatters";

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
        <View>
          <View style={stylesGen.optionRow}>
            <Text style={stylesGen.option}>{`Верных ответов: ${result.correctCount}`}</Text>
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
              <Text style={{fontWeight: 'bold'}}>{` ${result.score}%`}</Text>
            </Text>
          </View>
        </View>
        <Text style={{textAlign: "center", marginBottom: 10}}>Ваши ответы:</Text>
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
                const isChecked = result.answers[q.id].selectedOptionIds.includes(option.id);
                const isCorrect = result.answers[q.id].correctOptionIds.includes(option.id);
                if (isCheckbox && isChecked) {
                  return (
                    <View key={option.id} style={stylesGen.optionRow}>
                      {
                        isCorrect ? <CorrectMark style={stylesQResult.svgFirstMark}/> :
                          <IncorrectMark style={stylesQResult.svgFirstMark}/>
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
                        isCorrect && <CorrectMark style={stylesQResult.svgFirstMark}/>
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
                        isCorrect ? <CorrectMark style={stylesQResult.svgFirstMark}/> :
                          <IncorrectMark style={stylesQResult.svgFirstMark}/>
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
                        isCorrect && <CorrectMark style={stylesQResult.svgFirstMark}/>
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
