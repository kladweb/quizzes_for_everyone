import React, { useState } from "react";
import { QuizCard } from "./QuizCard";
import { useIsLoading } from "../../store/useQuizzesStore";
import { Loader } from "../Loader/Loader";
import { useUser } from "../../store/useUserStore";
import { IQuizMeta } from "../../types/Quiz";

interface ITestsListProps {
  testsList: IQuizMeta[],
}

export const TestsList: React.FC<ITestsListProps> = ({testsList}) => {
  const isLoading = useIsLoading();
  const user = useUser();
  const locale = navigator.languages?.[0] || navigator.language;
  const formatter = new Intl.DateTimeFormat(locale);
  const [quizIdStatistics, setQuizIdStatistics] = useState<string | null>(null);

  const openStatistic = (testId: string) => {
    if (quizIdStatistics !== testId) {
      setQuizIdStatistics(testId);
    } else {
      setQuizIdStatistics(null);
    }
  }

  return (
    <div className='test-list-block'>
      {
        (isLoading) ? <Loader/> :
          <>
            {testsList.map((quiz: IQuizMeta) => (
              <QuizCard
                key={quiz.testId}
                quiz={quiz}
                openStatistic={openStatistic}
                dateFormatter={formatter}
                userUID={user?.uid}
              />)
            )}
          </>
      }
    </div>
  )
}
