import React, { useEffect, useState } from "react";
import { child, get, ref, set } from "firebase/database";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, database } from "../../firebase/firebase";
import { QuizLoader } from "../../components/QuizLoader/QuizLoader";
import "./pageMain.css";
import { Quiz } from "../../types/Quiz";
import { LinkQuiz } from "../../components/LinkQuiz/LinkQuiz";
import { TestList } from "../../components/TestList/TestList";

interface IUser {
  uid: string;
  email: string | null;
}

export const PageMain: React.FC = () => {
  const provider = new GoogleAuthProvider();
  const [user, setUser] = useState<IUser | null>(null);
  const [isNotice, setIsNotice] = useState(true);
  const [currentTestId, setCurrentTestId] = useState<string | null>(null);
  const [testList, setTestList] = useState<Quiz[]>([]);
  const [loadingMyTests, setLoadingMyTests] = useState(true);
  const [isLoadCurrenTest, setIsLoadCurrenTest] = useState(false);

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


  const loadTests = () => {
    if (!user) {
      return;
    }
    const dbRef = ref(database, `users/${user.uid}`);
    get(dbRef).then((snapshot) => {
      if (snapshot.exists()) {
        const quizIds = JSON.parse(snapshot.val());
        // setQuizIds([...quizIds]);
        loadQuizzes([...quizIds])
          .then((value) => {
            setTestList([...value.map(item => JSON.parse(item))]);
            setLoadingMyTests(false);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        console.log("No collection available");
        console.log("или данные отсутствуют");
      }
    }).catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoadingMyTests(false);
      });
  }

  const loadQuizzes = async (ids: string[]) => {
    const dbRef = ref(database);
    const promises = ids.map(id =>
      get(child(dbRef, `tests/${id}/test`)).then(s => s.val())
    );
    return Promise.all(promises);
  };

  useEffect(
    () => {
      initUser();
      loadTests();
      console.log('init');
    }, [user?.uid]);


  const createTest = () => {
    console.log('Creating test...');
    if (user) {
      setIsLoadCurrenTest(true);
    } else {
      setIsNotice(false);
      setTimeout(() => setIsNotice(true), 2000);
    }
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
    if (user) {
      await set(ref(database, `tests/${quiz.testId}/test`), JSON.stringify(quiz));
      const idList = testList.map(item => item.testId);
      await set(ref(database, `users/${user.uid}`), JSON.stringify([...idList, quiz.testId]));
      setCurrentTestId(quiz.testId);
      setTestList([...testList, quiz]);
    }
    setIsLoadCurrenTest(false)
    console.log("Данные вроде как загружены! )");
  }

  const deleteTest = async (testId: string) => {
    const IdsArray = testList.map(quiz => quiz.testId);
    let index = IdsArray.indexOf(testId);
    if (index !== -1) {
      IdsArray.splice(index, 1);
      const newTestList = [...testList];
      newTestList.splice(index, 1);
      setTestList(newTestList);
      setCurrentTestId(null);
    }
    if (user) {
      const promise1 = set(ref(database, `tests/${testId}`), null);
      const promise2 = set(ref(database, `users/${user.uid}`), JSON.stringify(IdsArray));
      Promise.all([promise1, promise2])
        .then(() => {
          console.log("Данные успешно изменены!")
        })
        .catch((error) => {
          console.log("Ошибка удаления: ", error);
        })
    }
  }

  return (
    <>
      <div className='loaderContainer'>
        {
          (user) ?
            <button className='buttonMain buttonLogin' onClick={logoutGoogle}>LOGOUT</button> :
            <button className='buttonMain buttonLogin' onClick={loginGoogle}>GOOGLE LOGIN</button>
        }
        <>
          <button className='buttonMain buttonCreate' onClick={createTest}>Создать новый тест</button>
          <div className={`noticeBlock${(isNotice ? " close" : "")}`}>
            <p className='noticeText'>Сначала нужно войти в систему!</p>
            <p className='noticeText'>Нажните кнопку GOOGLE LOGIN!</p>
          </div>
        </>
        {
          (user && isLoadCurrenTest) ?
            <QuizLoader onQuizLoad={saveQuiz} userUID={user.uid}/> : null
        }
        {
          (currentTestId && !isLoadCurrenTest) ?
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
            deleteTest={deleteTest}
            loadingMyTests={loadingMyTests}
          />
          :
          null
      }
    </>
  );
};
