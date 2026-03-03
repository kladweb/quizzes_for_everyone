import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { IQuizMeta, IQuizzes, Question } from "../../types/Quiz";
import { useAllQuizzes, useIsAllLoaded } from "../../store/useQuizzesStore";
import { useUser } from "../../store/useUserStore";
import "./pageQuizEdit.css";

export const PageQuizEdit = () => {
  const params = useParams();
  const testId = params.testid;
  const user = useUser();
  const isAllLoaded = useIsAllLoaded();
  const quizzesAll: IQuizzes | null = useAllQuizzes();
  const [quiz, setQUiz] = useState<IQuizMeta | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[] | null>(null);
  const [activeInput, setActiveInput] = useState<string>("");

  console.log(params);
  console.log(testId)

  useEffect(() => {
    if (testId && isAllLoaded && quizzesAll) {
      if (Object.keys(quizzesAll).includes(testId)) {
        setQUiz(quizzesAll[testId]);
      } else {
        const quizTemplate: IQuizMeta = {
          testId: testId,
          createdBy: user?.uid ? user.uid : "",
          title: "",
          createdAt: new Date(),
          access: "public",
          executionCount: 0,
          likeUsers: {},
          dislikeUsers: {}
        }
        setQUiz(quizTemplate);
      }
    }
  }, [testId]);

  return (
    <div className='quizContainer'>
      <div className='quiz-head-block'>
        {
          quiz &&
          <>
            <input
              className='quiz-edit edit-head'
              type="text"
              value={quiz.title}
              title="Название теста"
              onBlur={() => {
                setActiveInput(quiz.title);
              }}
              onChange={(e) => {
                quiz.title = e.target.value;
                setActiveInput(e.target.value);
              }}
            />
            <input
              className='quiz-edit edit-descr'
              type="text"
              value={quiz.description}
              title="Краткое описание теста"
              onBlur={() => {
                if (quiz?.description) {
                  setActiveInput(quiz.description);
                }
              }}
              onChange={(e) => {
                quiz.description = e.target.value;
                setActiveInput(e.target.value);
              }}
            />
          </>
        }
      </div>
    </div>
  )
}
