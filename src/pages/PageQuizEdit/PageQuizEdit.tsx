import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { IQuizMeta, IQuizzes, Question } from "../../types/Quiz";
import { useAllQuizzes, useIsAllLoaded } from "../../store/useQuizzesStore";
import { useUser } from "../../store/useUserStore";
import "./pageQuizEdit.css";
import { QuizLoaderExtraInfo } from "../../components/QuizLoaderExtraInfo/QuizLoaderExtraInfo";
import {
  clearCurrentQuiz,
  setIsValidate,
  setQuizDraft,
  useIsValidate,
  useQuizDraft
} from "../../store/useCurrentCreatingQuiz";
import { QuizStorageManager } from "../../utils/QuizStorageManager";
import { showToast } from "../../store/useNoticeStore";

export const PageQuizEdit = () => {
  const params = useParams();
  const testId = params.testid;
  const user = useUser();
  const isAllLoaded = useIsAllLoaded();
  const quizzesAll: IQuizzes | null = useAllQuizzes();
  const [isCreatingNewTest, setIsCreatingNewTest] = useState(false);
  const quiz = useQuizDraft();
  // const [isEditValidate, setIsEditValidate] = useState(true);
  const isEditValidate: boolean = useIsValidate().title;


  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
    }
  };

  const handleChange = <K extends keyof IQuizMeta>(key: K, value: IQuizMeta[K]) => {
    if (quiz) {
      setQuizDraft({...quiz, [key]: value});
    }
    if (key === 'title' && value === '') {
      setIsValidate("title", false);
    }
    if (key === 'title' && value !== '') {
      setIsValidate("title", true);
    }
  };

  const loadQuizAndQuestions = async () => {
    if (testId) {
      const quizPromise = await Promise.all([QuizStorageManager.fetchCurrentQuiz(testId), QuizStorageManager.fetchQuestions(testId)]);
      const quiz = quizPromise[0];
      const questions = quizPromise[1];
      if (quiz && questions) {
        quiz.questions = quizPromise[1];
      } else {
        return;
      }
      return quiz;
    }
  }

  useEffect(() => {
    if (testId && isAllLoaded && quizzesAll) {
      if (testId in quizzesAll) {
        setQuizDraft(quizzesAll[testId]);
        return;
      }
    }
    if (testId && !quiz) {
      loadQuizAndQuestions()
        .then((quiz: IQuizMeta | undefined) => {
          // console.log(quiz);
          if (quiz) {
            setQuizDraft(quiz);
            return;
          }
        })
        .catch((error) => {
          console.log(error);
          showToast("Ошибка загрузки данных!", "error");
        });
      const quizTemplate: IQuizMeta = {
        testId: testId,
        createdBy: user?.uid ? user.uid : "",
        title: "",
        createdAt: Date.now(),
        access: "public",
        executionCount: 0,
        likeUsers: {},
        dislikeUsers: {}
      }
      setQuizDraft(quizTemplate);
    }
    return () => {
      clearCurrentQuiz();
    }
  }, [testId, isAllLoaded, user]);

  return (
    <div className='quizContainer'>
      <div className='quiz-head-block'>
        {
          (quiz && user) &&
          <>
            <input
              className='quiz-edit edit-head'
              name="title"
              type="text"
              value={quiz.title ? quiz.title : ""}
              title="Название теста"
              placeholder={quiz?.title ? "" : "Название теста"}
              required
              onChange={(e) => handleChange("title", e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {
              !isEditValidate && <p className='title-error'>Поле не может быть пустым!</p>
            }
            <input
              className='quiz-edit edit-descr'
              name="description"
              type="text"
              value={quiz?.description ? quiz.description : ""}
              title="Краткое описание теста"
              placeholder={quiz.description ? "" : "Краткое описание теста"}
              onChange={(e) => handleChange("description", e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <QuizLoaderExtraInfo userUID={user.uid} setIsCreatingNewTest={setIsCreatingNewTest}/>
          </>
        }
      </div>
    </div>
  )
}
