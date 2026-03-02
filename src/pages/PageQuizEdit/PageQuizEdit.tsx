import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { IQuizMeta, IQuizzes } from "../../types/Quiz";
import { useAllQuizzes, useIsAllLoaded } from "../../store/useQuizzesStore";

export const PageQuizEdit = () => {
  const params = useParams();
  const testId = params.testid;
  const isAllLoaded = useIsAllLoaded();
  const quizzesAll: IQuizzes | null = useAllQuizzes();
  const [quiz, setQUiz] = useState<IQuizMeta | null>(null);

  console.log(params);
  console.log(testId)

  useEffect(() => {
    if (testId && quizzesAll) {
      setQUiz(quizzesAll[testId]);
    }
  }, [params, isAllLoaded]);

  return (
    <div className='quizContainer'>
      <div className='quiz-head-block'>
        {
          quiz && <input className='quiz-head' type="text" value={quiz.title}/>
        }
      </div>
    </div>
  )
}
