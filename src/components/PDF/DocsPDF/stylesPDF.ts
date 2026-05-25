import { StyleSheet } from "@react-pdf/renderer";

export const stylesGen = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 55,
    paddingLeft: 50,
    paddingRight: 30,
    fontSize: 10,
    fontFamily: 'Roboto',
  },
  header: {
    fontSize: 16,
    marginBottom: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  questionNote: {
    marginBottom: 4,
    fontSize: 8,
    color: '#777',
  },
  questionText: {
    fontWeight: 'bold',
  },
  optionRow: {
    position: 'relative',
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

export const stylesQuiz = StyleSheet.create({
  description: {
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  question: {
    marginBottom: 18,
  },
});

export const stylesQResult = StyleSheet.create({
  userName: {
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  answer: {
    marginBottom: 10,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderRadius: 5,
  },
  answerCorrect: {
    borderStyle: 'solid',
    borderColor: "#2e7d32",
  },
  answerWrong: {
    borderStyle: 'dashed',
    borderColor: "#d32f2f",
  },
  optionItalic: {
    fontStyle: 'italic',
  },
  explanation: {
    fontSize: 9,
  }
});

