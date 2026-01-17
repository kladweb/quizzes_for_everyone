import React, { useEffect, useState } from "react";
import { child, get, ref, set } from "firebase/database";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, database } from "../../firebase/firebase";
import { QuizLoader } from "../../components/QuizLoader/QuizLoader";
import { Quiz } from "../../types/Quiz";
import { LinkQuiz } from "../../components/LinkQuiz/LinkQuiz";
import { TestList } from "../../components/TestList/TestList";
import { QuizStorageManager } from "../../utils/QuizStorageManager";
import "./pageMain.css";
import { loadUserQuizzes, useIsLoading, useMyQuizzes } from "../../store/useMyQuizzesStore";

interface IUser {
  uid: string;
  email: string | null;
}

export const PageMain: React.FC = () => {
  const provider = new GoogleAuthProvider();
  const [user, setUser] = useState<IUser | null>(null);
  const [isNotice, setIsNotice] = useState(true);
  const [currentTestId, setCurrentTestId] = useState<string | null>(null);
  const [isCreatingNewTest, setIsCreatingNewTest] = useState(false);
  // const [testList, setTestList] = useState<Quiz[]>([]);
  // const [loadingMyTests, setLoadingMyTests] = useState(false);
  const testList = useMyQuizzes();
  const loadingMyTests = useIsLoading();


  const initUser = () => {
    onAuthStateChanged(auth, (getUser) => {
      if (getUser) {
        const user: IUser = {
          uid: getUser.uid,
          email: getUser.email,
        };
        setUser(user);
      }
    });
  }

  useEffect(
    () => {
      if (user) {
        // getQuizzes(user.uid);
        loadUserQuizzes(user.uid);
      }
      initUser();
      // loadTests();
      console.log('init');
    }, [user?.uid]);


  const createTest = () => {
    console.log('Creating test...');
    if (user) {
      setCurrentTestId(null);
      setIsCreatingNewTest(true);
    } else {
      setIsNotice(false);
      setTimeout(() => setIsNotice(true), 2000);
    }
  }

  const loginGoogle = function () {
    signInWithPopup(auth, provider)
      .then((result) => {
        const getUser = auth.currentUser as IUser;
        const user: IUser = {
          uid: getUser.uid,
          email: getUser.email,
        };
        return user.uid;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const logoutGoogle = function () {
    signOut(auth).then(() => {
      console.log('Sign-out successful', auth.currentUser);
      setUser(null);
    }).catch((error) => {
      console.log('Sign-out error', error);
    });
  }

  // const saveQuiz = async (quiz: Quiz) => {
  //   // console.log(typeof (quiz));
  //   if (user) {
  //     await set(ref(database, `tests/${quiz.testId}/test`), JSON.stringify(quiz));
  //     const idList = testList.map(item => item.testId);
  //     await set(ref(database, `users/${user.uid}`), JSON.stringify([...idList, quiz.testId]));
  //     setCurrentTestId(quiz.testId);
  //     setTestList([quiz, ...testList]);
  //   }
  //   setIsLoadCurrenTest(false)
  //   console.log("Data loaded! )");
  // }
  //
  // const deleteTest = async (testId: string) => {
  //   const IdsArray = testList.map(quiz => quiz.testId);
  //   let index = IdsArray.indexOf(testId);
  //   if (index !== -1) {
  //     IdsArray.splice(index, 1);
  //     const newTestList = [...testList];
  //     newTestList.splice(index, 1);
  //     setTestList(newTestList);
  //     setCurrentTestId(null);
  //   }
  //   if (user) {
  //     const promise1 = set(ref(database, `tests/${testId}`), null);
  //     const promise2 = set(ref(database, `users/${user.uid}`), JSON.stringify(IdsArray));
  //     Promise.all([promise1, promise2])
  //       .then(() => {
  //         QuizStorageManager.removeRecentStat(testId);
  //         console.log("Данные успешно изменены!")
  //       })
  //       .catch((error) => {
  //         console.log("Ошибка удаления: ", error);
  //       })
  //   }
  // }

  return (
    <>
      <div className='tests-container'>
        {
          (user) ?
            <button className='btn button-login' onClick={logoutGoogle}>LOGOUT</button> :
            <button className='btn button-login ' onClick={loginGoogle}>GOOGLE LOGIN</button>
        }
        <>
          <button className='btn button-create' onClick={createTest}>Создать новый тест</button>
          <div className={`noticeBlock${(isNotice ? " close" : "")}`}>
            <p className='noticeText'>Сначала нужно войти в систему!</p>
            <p className='noticeText'>Нажните кнопку GOOGLE LOGIN!</p>
          </div>
        </>
        {
          (user && isCreatingNewTest) ?
            <QuizLoader
              // onQuizLoad={saveQuiz}
              userUID={user.uid}
              setCurrentTestId={setCurrentTestId}
              setIsCreatingNewTest={setIsCreatingNewTest}
            /> :
            null
        }
        {
          (currentTestId) ?
            <LinkQuiz
              testId={currentTestId}
            /> :
            null
        }
      </div>
      {
        user ?
          <TestList
            testList={testList}
            userUID={user.uid}
            // deleteTest={deleteTest}
            // loadingMyTests={loadingMyTests}
          />
          :
          null
      }
    </>
  );
};
