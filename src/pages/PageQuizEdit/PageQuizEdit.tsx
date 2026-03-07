import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { IQuizMeta, IQuizzes, Option, Question } from "../../types/Quiz";
import { updateQuiz, useAllQuizzes } from "../../store/useQuizzesStore";
import { useUser } from "../../store/useUserStore";
import { QuizLoaderExtraInfo } from "../../components/QuizLoaderExtraInfo/QuizLoaderExtraInfo";
import "./pageQuizEdit.css";
import {
  clearCurrentQuiz,
  validateField,
  useFormError,
  setQuizDraft,
  useQuizDraft
} from "../../store/useCurrentCreatingQuiz";
import { QuizStorageManager } from "../../utils/QuizStorageManager";
import { showToast } from "../../store/useNoticeStore";
import { QuestionEdit } from "../../components/QuestionEdit/QuestionEdit";
import { Loader } from "../../components/Loader/Loader";

const optionsVar = ["a", "b", "c", "d", "e", "f"];

export const PageQuizEdit = () => {
  const params = useParams();
  const testId = params.testid;
  const user = useUser();
  const formError = useFormError();
  const quizzesAll: IQuizzes | null = useAllQuizzes();
  const [isCreatingNewTest, setIsCreatingNewTest] = useState(false);
  const quiz = useQuizDraft();
  const isFormValid = Object.values(formError).every(e => !e);

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

  // const addOption = (question: Question) => {
  //   const optionName = optionsVar[question.options.length];
  //   if (quiz) {
  //     const newQuiz = {...quiz};
  //     newQuiz.questions?.forEach((quest) => {
  //       if (quest.id === question.id) {
  //         quest.options.push(
  //           {
  //             id: `${question.id}_${optionName}`,
  //             text: ""
  //           }
  //         );
  //       }
  //     })
  //     setQuizDraft(newQuiz);
  //   }
  // }

  const deleteOption = (question: Question) => {
    if (quiz) {
      validateField(question.options[question.options.length - 1].id, "ok");
      question.options.pop();
      const newQuiz = {...quiz};
      setQuizDraft(newQuiz);
    }
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

  // const handleOptionEdit = (option: Option, value: string) => {
  //   if (quiz) {
  //     option.text = value;
  //     const newQuiz = {...quiz};
  //     validateField(option.id, value);
  //     setQuizDraft(newQuiz);
  //   }
  // }

  // const deleteOption = (question: Question, option: Option) => {
  //   if (quiz) {
  //     question.options.splice(question.options.indexOf(option), 1);
  //     const newQuiz = {...quiz};
  //     setQuizDraft(newQuiz);
  //   }
  // }

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
              showToast(err, "error");
            });
        } else {
          setQuizDraft(quizCurrent);
          return;
        }
      } else {
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
          dislikeUsers: {},
          questions: []
        }
        setQuizDraft(quizTemplate);
      }
    }
    return () => {
      clearCurrentQuiz();
    }
  }, []);

  return (
    <div className='quizContainer'>
      <div className='quiz-head-block'>
        {
          (quiz && user) ?
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
                          handleQuestionEdit={handleQuestionEdit}
                          handleOptionEdit={handleOptionEdit}
                          handleKeyDown={handleKeyDown}
                          addOption={addOption}
                          deleteOption={deleteOption}
                        />
                      )
                    )
                  }
                </>
              }
              <QuizLoaderExtraInfo userUID={user.uid} setIsCreatingNewTest={setIsCreatingNewTest}/>
            </> :
            <Loader/>
        }
      </div>
    </div>
  )
}
