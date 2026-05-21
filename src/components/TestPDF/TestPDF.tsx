import React from "react";
import { Svg, Rect, Circle, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { IQuizMeta, Question } from "../../types/Quiz";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,      // вернули обратно
    paddingBottom: 55,   // чуть больше места снизу
    paddingLeft: 50,
    paddingRight: 30,
    fontSize: 10,
    fontFamily: 'Roboto',
  },
  header: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  questionText: {
    fontWeight: 'bold',
  },
  question: {
    marginBottom: 18,
  },
  questionNote: {
    marginBottom: 4,
    fontSize: 8,
    color: '#777',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    minHeight: 16,
  },
  option: {
    marginLeft: 4,
    marginTop: 1,
    fontWeight: 'normal',
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 50,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 9,
    color: '#777',
    borderTop: '0.5px solid #ddd',
    paddingTop: 8,
  },
  footerTitle: {
    maxWidth: '75%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
});

export interface IQuizPDFProps {
  quiz: IQuizMeta;
}

const Checkbox = () => (
  <View style={{width: 20, alignItems: 'center'}}>
    <Svg width={12} height={12} viewBox="0 0 22 22">
      <Rect
        x="1.5"
        y="1.5"
        width="17"
        height="17"
        rx="3"
        fill="#ffffff"
        fillOpacity={0}
        stroke="#1f2a44"
        strokeWidth="1.2"
      />
    </Svg>
  </View>
);

const RadioButton = () => (
  <View style={{width: 20, alignItems: 'center'}}>
    <Svg width={12} height={12} viewBox="0 0 22 22">
      <Circle
        cx="11"
        cy="11"
        r="9"
        fill="#ffffff"
        fillOpacity={0}
        stroke="#1f2a44"
        strokeWidth="1.2"
      />
    </Svg>
  </View>
);

export const TestPDF: React.FC<IQuizPDFProps> = ({quiz}) => (
  <Document>
    {/*<Document pageLayout="singlePage">*/}
    <Page size="A4" style={styles.page}>
      {/* Основное содержание */}
      <Text style={styles.header}>{quiz.title}</Text>
      {quiz.description && <Text style={styles.description}>{quiz.description}</Text>}
      {quiz.questions?.map((q: Question, index) => (
        <View key={q.id} wrap={false} style={styles.question}>
          <Text style={styles.questionText}>
            {index + 1}) {q.question}
          </Text>
          {
            q.correctAnswers.length > 1 &&
            <Text style={styles.questionNote}>
              (несколько вариантов ответов)
            </Text>
          }
          {q.options.map((option, i) => (
            <View key={option.id} style={styles.optionRow}>
              {q.correctAnswers.length > 1 ? <Checkbox/> : <RadioButton/>}
              <Text style={styles.option}>
                {option.text}
              </Text>
            </View>
          ))}
        </View>
      ))}

      <View style={styles.footer} fixed>
        <Text style={styles.footerTitle}>
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
