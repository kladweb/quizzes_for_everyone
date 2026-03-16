import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { IQuizMeta, IQuizzes, Option, Question } from "../../types/Quiz";
import { ToastType } from "../../types/Quiz";
import { setIsLoading, useAllQuizzes, useIsLoading } from "../../store/useQuizzesStore";
import { useUser } from "../../store/useUserStore";
import { QuizLoaderExtraInfo } from "../../components/QuizLoaderExtraInfo/QuizLoaderExtraInfo";
import {
  clearCurrentQuiz, resetFormError,
  setQuizDraft,
  useFormError, useQuizComplete,
  useQuizDraft,
  validateField
} from "../../store/useCurrentCreatingQuiz";
import { QuizStorageManager } from "../../utils/QuizStorageManager";
import { showToast } from "../../store/useNoticeStore";
import { QuestionEdit } from "../../components/QuestionEdit/QuestionEdit";
import { LinkQuiz } from "../../components/LinkQuiz/LinkQuiz";
import { ModalConfirm } from "../../components/ModalConfirm/ModalConfirm";
import { useQuizEditor } from "../../hooks/useQuizEditor";
import "./pageQuizEdit.css";

export const PageQuizEdit = () => {
  const params = useParams();
  const testId = params.testid;
  const user = useUser();
  const formError = useFormError();
  const quizzesAll: IQuizzes | null = useAllQuizzes();
  const [isCreatingNewTest, setIsCreatingNewTest] = useState(false);
  const quiz = useQuizDraft();
  const quizComplete = useQuizComplete();
  const {addQuestion, deleteQuestion, getQuestionTemplate} = useQuizEditor();
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState<boolean>(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
    }
  };

  const handleChange = <K extends keyof IQuizMeta>(key: K, value: string) => {
    if (quiz) {
      setQuizDraft({...quiz, [key]: value});
    }
    validateField(key, value);
  };

  const handleDeleteQuestion = (question: Question) => {
    if (!question) return;
    let isQuestionFields = true;
    if (question.question || question.explanation) {
      isQuestionFields = false;
    } else {
      question.options.forEach((option) => {
        if (option.text) {
          isQuestionFields = false;
        }
      });
    }
    if (!isQuestionFields) {
      setIsModalConfirmOpen(true);
      setQuestionToDelete(question);
    } else {
      deleteQuestion(question);
    }
  }

  const handlerConfirmDelete = (toDelete: boolean) => {
    if (!user || !questionToDelete) {
      return;
    }
    if (toDelete) {
      deleteQuestion(questionToDelete);
    }
    setIsModalConfirmOpen(false);
  }

  const loadQuizAsTemplate = (testId: string) => {
    const quizTemplate: IQuizMeta = {
      testId: testId,
      createdBy: user?.uid ? user.uid : "",
      title: "",
      createdAt: Date.now(),
      category: "",
      lang: "русский",
      access: "public",
      executionCount: 0,
      likeUsers: {},
      dislikeUsers: {},
      questions: [getQuestionTemplate()],
    }
    // console.log(quizTemplate);
    setQuizDraft(quizTemplate);
  }

  useEffect(() => {
    if (quiz || !testId) return;

    if (quizzesAll && testId && (testId in quizzesAll)) {
      const quizCurrent = quizzesAll[testId];
      if (!quizCurrent.questions) {
        QuizStorageManager.fetchQuestions(quizCurrent.testId)
          .then((data) => {
            const quizWithQuestions = {
              ...quizCurrent,
              questions: data
            };
            // quizCurrent.questions = data;
            setQuizDraft(quizWithQuestions);
            return;
          })
          .catch((err) => {
            showToast(err, ToastType.ERROR);
          });
      } else {
        setQuizDraft(quizCurrent);
        return;
      }
    }
    setIsLoading(true);
    QuizStorageManager.loadQuizAndQuestions(testId)
      .then((quiz: IQuizMeta | undefined) => {
        if (quiz) {
          setQuizDraft(quiz);
          return;
        } else {
          loadQuizAsTemplate(testId);
        }
      })
      .catch((error) => {
        console.log(error);
        showToast("Ошибка загрузки данных!", ToastType.ERROR);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      clearCurrentQuiz();
      resetFormError();
    }
  }, []);

  return (
    <>
      {
        (quiz && user) ?
          <div className='quizContainer'>
            <div className='quiz-head-block'>
              <input
                className='quiz-edit edit-head'
                name="title"
                type="text"
                value={quiz.title ? quiz.title : ""}
                title="Название теста"
                placeholder={quiz?.title ? "" : "Название теста"}
                required
                onChange={(e) => handleChange("title", e.target.value)}
                // onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              {
                formError.title && <p className='title-error'>Поле не может быть пустым!</p>
              }
              <input
                className='quiz-edit edit-descr'
                name="description"
                type="text"
                value={quiz?.description ? quiz.description : ""}
                title="Краткое описание теста"
                placeholder={quiz.description ? "" : "Краткое описание теста"}
                onChange={(e) => handleChange("description", e.target.value)}
                // onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              {
                quiz.questions &&
                <>
                  {
                    quiz.questions.map((question: Question) => (
                        <QuestionEdit
                          key={question.id}
                          question={question}
                          handleKeyDown={handleKeyDown}
                          handleDeleteQuestion={handleDeleteQuestion}
                          isOnlyOneQuestion={quiz.questions ? quiz.questions.length > 1 : false}
                        />
                      )
                    )
                  }
                </>
              }
              <button className="btn button-create add-question" onClick={addQuestion}>Добавить вопрос</button>
              <QuizLoaderExtraInfo userUID={user.uid} setIsCreatingNewTest={setIsCreatingNewTest}/>
            </div>
          </div>
          :
          <>
            {
              (quizComplete) &&
              <div className="tests-container">
                <LinkQuiz testId={quizComplete.testId}/>
              </div>
            }
          </>
      }
      <ModalConfirm
        isModalConfirmOpen={isModalConfirmOpen}
        modalQuestion={`Вы действительно хотите удалить вопрос без возможности восстановления?`}
        handlerConfirmDelete={handlerConfirmDelete}
      />
    </>
  )
}
