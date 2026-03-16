import React from "react";
import { useQuizDraft, setQuizDraft, resetFormError, validateField } from "../store/useCurrentCreatingQuiz";
import { Option, Question, ToastType } from "../types/Quiz";
import { showToast } from "../store/useNoticeStore";

const optionsVar = ["a", "b", "c", "d", "e", "f"];

export const useQuizEditor = () => {
  const quiz = useQuizDraft();

  const getQuestionTemplate = (questionNumber: number = 0) => {
    const questionId: string = questionNumber ? "q" + questionNumber : "q1";
    const newQuestion: Question = {
      id: questionId,
      question: "",
      options: [{id: questionId + "_a", text: ""}, {id: questionId + "_b", text: ""}],
      correctAnswers: [questionId + "_a"],
      explanation: ""
    }
    return newQuestion;
  }

  const addQuestion = () => {
    if (!quiz) return;
    const questions = quiz.questions ? quiz.questions : [];
    const newQuiz = {
      ...quiz,
      questions: [...questions, getQuestionTemplate(quiz.questions ? quiz.questions.length + 1 : 0)],
    };
    console.log(newQuiz);
    resetFormError();
    setQuizDraft(newQuiz);
  }

  const handleQuestionEdit = (question: Question, value: string) => {
    if (!quiz) return;
    const newQuiz = {
      ...quiz,
      questions: quiz.questions?.map(q =>
        q.id === question.id
          ? {...q, question: value ? value : ""}
          : q
      )
    };
    validateField(question.id, value);
    setQuizDraft(newQuiz);
  };

  const handleOptionEdit = (option: Option, value: string) => {
    if (!quiz) return;
    const newQuiz = {
      ...quiz,
      questions: quiz.questions?.map(q => ({
        ...q,
        options: q.options.map(o =>
          o.id === option.id
            ? {...o, text: value}
            : o
        )
      }))
    };
    validateField(option.id, value);
    setQuizDraft(newQuiz);
  };

  const explanationEdit = (question: Question, value: string) => {
    if (!quiz) return;
    const newQuiz = {
      ...quiz,
      questions: quiz.questions?.map(q =>
        q.id === question.id
          ? {...q, explanation: value}
          : q
      )
    };
    setQuizDraft(newQuiz);
  }

  const handleCorrectCheck = (e: React.ChangeEvent<HTMLInputElement>, option: Option, question: Question) => {
    if (!quiz) return;
    const correctAnswers: string[] = [...question.correctAnswers];
    if (e.target.checked) {
      correctAnswers.push(option.id);
    } else {
      if (correctAnswers.length <= 1) {
        showToast("Должен быть хотя бы один правильный вариант!", ToastType.WARNING)
        return;
      }
      let index = correctAnswers.indexOf(option.id);
      if (index !== -1) {
        correctAnswers.splice(index, 1);
      }
    }
    const newQuiz = {
      ...quiz,
      questions: quiz.questions?.map(q =>
        q.id === question.id
          ? {...q, correctAnswers: correctAnswers}
          : q
      )
    };
    setQuizDraft(newQuiz);
  }

  const addOption = (question: Question) => {
    if (!quiz) return;
    const optionName = optionsVar[question.options.length];
    const newQuiz = {
      ...quiz,
      questions: quiz.questions?.map(q => {
        if (q.id !== question.id) return q;

        return {
          ...q,
          options: [
            ...q.options,
            {
              id: `${question.id}_${optionName}`,
              text: ""
            }
          ]
        };
      })
    };
    setQuizDraft(newQuiz);
  };

  const deleteOption = (question: Question) => {
    if (quiz) {
      validateField(question.options[question.options.length - 1].id, "ok");
      question.options.pop();
      const newQuiz = {...quiz};
      resetFormError();
      setQuizDraft(newQuiz);
    }
  }

  const deleteQuestion = (question: Question) => {
    if (!quiz || !quiz.questions) return;
    const questions: Question[] = [...quiz.questions];
    const lastQuestion = questions[questions.length - 1];
    questions.forEach((q: Question, i: number) => {
      if (q.id === question.id) {
        lastQuestion.id = question.id;
        questions.splice(i, 1, lastQuestion);
      }
    });
    questions.pop();
    const newQuiz = {
      ...quiz,
      questions: questions
    };
    resetFormError();
    setQuizDraft(newQuiz);
  }

  return {
    addQuestion,
    deleteQuestion,
    handleQuestionEdit,
    handleOptionEdit,
    handleCorrectCheck,
    addOption,
    deleteOption,
    explanationEdit,
    getQuestionTemplate
  };
};
