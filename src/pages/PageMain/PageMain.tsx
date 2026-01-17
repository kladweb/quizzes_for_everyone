import React, { useEffect, useState } from "react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { QuizLoader } from "../../components/QuizLoader/QuizLoader";
import { LinkQuiz } from "../../components/LinkQuiz/LinkQuiz";
import { TestList } from "../../components/TestList/TestList";
import { loadUserQuizzes, useMyQuizzes } from "../../store/useMyQuizzesStore";
import "./pageMain.css";

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
  const testList = useMyQuizzes();

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
              userUID={user.uid}
              setCurrentTestId={setCurrentTestId}
              setIsCreatingNewTest={setIsCreatingNewTest}
            /> :
            null
        }
        {
          currentTestId ? <LinkQuiz testId={currentTestId}/> : null
        }
      </div>
      {
        user ? <TestList testList={testList} userUID={user.uid}/> : null
      }
    </>
  );
};
