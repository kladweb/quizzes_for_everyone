import React, { useEffect, useState } from "react";
import { child, get, ref, set } from "firebase/database";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, database } from "../firebase/firebase";
import { QuizLoader } from "../components/QuizLoader/QuizLoader";
import "./pageMain.css";
import { Quiz } from "../types/Quiz";
import { LinkQuiz } from "../components/LinkQuiz/LinkQuiz";

interface IUser {
  uid: string;
  email: string | null;
}

export const PageMain: React.FC = () => {
  const provider = new GoogleAuthProvider();
  const [user, setUser] = useState<IUser | null>(null);
  const [isNotice, setIsNotice] = useState(true);
  const [currentTestId, setCurrentTestId] = useState<string | null>(null);

  const initUser = () => {
    onAuthStateChanged(auth, (getUser) => {
      if (getUser) {
        const user: IUser = {
          uid: getUser.uid,
          email: getUser.email,
        };
        setUser(user);
        // console.log(user);
      }
    });
  }

  useEffect(
    () => {
      initUser();
    }, []);

  const createTest = () => {
    console.log('Creating test...');
    setIsNotice(false);
    setTimeout(() => setIsNotice(true), 2000);
  }

  const loginGoogle = function () {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("result: ", result);
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

  const saveQuiz = async (quiz: Quiz) => {
    // console.log(typeof (quiz));
    await set(ref(database, `tests/${quiz.testId}`), JSON.stringify(quiz));
    setCurrentTestId(quiz.testId);
    console.log("Данные вроде как загружены! )");
  }

  return (
    <div className='loaderContainer'>
      {
        (user) ?
          <button className='buttonMain buttonLogin' onClick={logoutGoogle}>LOGOUT</button> :
          <>
            <button className='buttonMain buttonCreate' onClick={createTest}>Создать новый тест</button>
            <button className='buttonMain buttonLogin' onClick={loginGoogle}>GOOGLE LOGIN</button>
            <div className={`noticeBlock${(isNotice ? " close" : "")}`}>
              <p className='noticeText'>Сначала нужно войти в систему!</p>
              <p className='noticeText'>Нажните кнопку GOOGLE LOGIN!</p>
            </div>
          </>
      }
      {
        (user) ?
          <QuizLoader onQuizLoad={saveQuiz} userUID={user.uid}/> : null
      }
      {
        (currentTestId) ?
          <LinkQuiz
            testId={currentTestId}
          /> :
          null
      }
    </div>
  );
};
