import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import React from "react";
import { IQuizMeta, Question } from "../../types/Quiz";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 50,
    paddingRight: 30,
    fontSize: 10,
    fontFamily: 'Roboto',
  },
  header: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  question: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  option: {
    marginLeft: 15,
    marginTop: 5,
    fontWeight: 'normal',
  },
});

export interface IQuizPDFProps {
  quiz: IQuizMeta;
}

export const TestPDF: React.FC<IQuizPDFProps> = ({quiz}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>{quiz.title}</Text>
      {
        quiz.description && <Text style={styles.description}>{quiz.description}</Text>
      }
      {quiz.questions?.map((q: Question, index) => (
        <View key={q.id} wrap={false} style={styles.question}>
          <Text>
            {index + 1}) {q.question}
          </Text>
          {
            q.correctAnswers.length > 1 ?
              <>
                {q.options.map((option, i) => (
                  <Text key={option.id} style={styles.option}>
                    ☐ {option.text}
                  </Text>
                ))}
              </> :
              <>
                {q.options.map((option, i) => (
                  <Text key={option.id} style={styles.option}>
                    ○ {option.text}
                  </Text>
                ))}
              </>
          }

        </View>
      ))}
    </Page>
  </Document>
);
