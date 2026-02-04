import { useEffect } from "react";
import { loadAllQuizzes, useAllQuizzes, useIsAllLoaded } from "../../store/useQuizzesStore";
import { TestsList } from "../../components/TestsList/TestsList";

export const PageAllQuizzes = () => {
  const isAllLoaded = useIsAllLoaded();
  const testsList = useAllQuizzes();

  useEffect(
    () => {
      if (isAllLoaded) {
        console.log("All Quizzes already loaded");
        return;
      }
      console.log('loadAllQuizzes');
      loadAllQuizzes();
    }, []);


  return (
    <div className='tests-container'>
      <h2 className="test-list-name">ТЕСТЫ</h2>
      <TestsList testsList={testsList}/>
    </div>
  )
}
