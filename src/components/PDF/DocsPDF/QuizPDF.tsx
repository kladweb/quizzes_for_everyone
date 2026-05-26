import React from "react";
import { Document, Page, Text, View } from '@react-pdf/renderer';
import type { IQuizMeta, IStatistics, Question } from "../../../types/Quiz";
import { stylesGen, stylesQuiz } from "./stylesPDF";
import { Checkbox, RadioButton } from "./SvgComponents";

export interface IQuizPDFProps {
  quiz: IQuizMeta;
}

export interface IQuizPDFResultProps {
  quiz: IQuizMeta;
  result: IStatistics;
}

export const QuizPDF: React.FC<IQuizPDFProps> = ({quiz}) => (
  <Document>
    <Page size="A4" style={stylesGen.page}>
      <Text style={stylesGen.header}>{quiz.title}</Text>
      {quiz.description && <Text style={stylesQuiz.description}>{quiz.description}</Text>}
      {quiz.questions?.map((q: Question, index) => (
        <View key={q.id} wrap={false} style={stylesQuiz.question}>
          <Text style={stylesGen.questionText}>
            {index + 1}) {q.question}
          </Text>
          {
            q.correctAnswers.length > 1 &&
            <Text style={stylesGen.questionNote}>
              (несколько вариантов ответов)
            </Text>
          }
          {q.options.map((option, i) => (
            <View key={option.id} style={stylesGen.optionRow}>
              {q.correctAnswers.length > 1 ? <Checkbox/> : <RadioButton/>}
              <Text style={stylesGen.option}>
                {option.text}
              </Text>
            </View>
          ))}
        </View>
      ))}

      <View style={stylesGen.footer} fixed>
        <Text style={stylesGen.footerTitle}>
          {quiz.title}
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
