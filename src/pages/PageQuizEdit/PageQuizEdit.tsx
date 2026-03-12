import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IQuizMeta, IQuizzes, Option, Question, ToastType } from "../../types/Quiz";
import { deleteUserQuiz, setIsLoading, useAllQuizzes, useIsLoading } from "../../store/useQuizzesStore";
import { useUser } from "../../store/useUserStore";
import { QuizLoaderExtraInfo } from "../../components/QuizLoaderExtraInfo/QuizLoaderExtraInfo";
import "./pageQuizEdit.css";
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

const optionsVar = ["a", "b", "c", "d", "e", "f"];

export const PageQuizEdit = () => {
  const params = useParams();
  const testId = params.testid;
  const user = useUser();
  const formError = useFormError();
  const quizzesAll: IQuizzes | null = useAllQuizzes();
  const [isCreatingNewTest, setIsCreatingNewTest] = useState(false);
  const quiz = useQuizDraft();
  const quizComplete = useQuizComplete();
  const isFormValid = Object.values(formError).every(e => !e);
  const isLoading = useIsLoading();
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState<boolean>(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);

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

  const handleDeleteQuestion = (question: Question) => {
    setIsModalConfirmOpen(true);
    setQuestionToDelete(question);
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

  const handlerConfirmDelete = (toDelete: boolean) => {
    if (!user || !questionToDelete) {
      return;
    }
    if (toDelete) {
      deleteQuestion(questionToDelete);
    }
    setIsModalConfirmOpen(false);
  }

  const handleQuestionEdit = (question: Question, value: string) => {
    if (!quiz) return;
    const newQuiz = {
      ...quiz,
      questions: quiz.questions?.map(q =>
        q.id === question.id
          ? {...q, question: value}
          : q
      )
    };
    validateField(question.id, value);
    setQuizDraft(newQuiz);
  };

  // const handleQuestionEdit = (question: Question, value: string) => {
  //   if (quiz) {
  //     console.log(value);
  //     question.question = value;
  //     const newQuestion = {...question};
  //     const newQuiz = {...quiz};
  //     validateField(question.id, value);
  //     setQuizDraft(newQuiz);
  //   }
  // }

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

  const addQuestion = () => {
    console.log('addQuestion');
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

  useEffect(() => {
    if (quiz) {
      return;
    }
    if (testId) {
      if (quizzesAll && (testId in quizzesAll)) {
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
      } else {
        setIsLoading(true);
        QuizStorageManager.loadQuizAndQuestions(testId)
          .then((quiz: IQuizMeta | undefined) => {
            // console.log(quiz);
            if (quiz) {
              setQuizDraft(quiz);
              return;
            }
          })
          .catch((error) => {
            console.log(error);
            showToast("Ошибка загрузки данных!", ToastType.ERROR);
          })
          .finally(() => {
            setIsLoading(false);
          })
        const quizTemplate: IQuizMeta = {
          testId: testId,
          createdBy: user?.uid ? user.uid : "",
          title: "",
          createdAt: Date.now(),
          access: "public",
          executionCount: 0,
          likeUsers: {},
          dislikeUsers: {},
          questions: [getQuestionTemplate()],
        }
        // console.log(quizTemplate);
        setQuizDraft(quizTemplate);
      }
    }
    return () => {
      clearCurrentQuiz();
    }
  }, []);

  // console.log(formError);
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
                onChange={(e) => handleChange("title", e.target.value.trim())}
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
                onChange={(e) => handleChange("description", e.target.value.trim())}
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
                          handleQuestionEdit={handleQuestionEdit}
                          handleOptionEdit={handleOptionEdit}
                          handleKeyDown={handleKeyDown}
                          handleCorrectCheck={handleCorrectCheck}
                          addOption={addOption}
                          deleteOption={deleteOption}
                          handleDeleteQuestion={handleDeleteQuestion}
                          explanationEdit={explanationEdit}
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
