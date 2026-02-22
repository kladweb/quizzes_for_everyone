import React, { useEffect, useRef, useState } from "react";
import { child, get, ref, set } from "firebase/database";
import { type IStatistics } from "../../types/Quiz";
import { RecentQuizzes } from "../RecentQuizzes/RecentQuizzes";
import "./quizResultView.css";
import { database } from "../../firebase/firebase";
import { useGuestUserId, useUser } from "../../store/useUserStore";

interface QuizResultViewProps {
  result: IStatistics;
  onReset: () => void;
}

export const QuizResultView: React.FC<QuizResultViewProps> = ({result, onReset}) => {
  const myRef = useRef<HTMLDivElement>(null);
  const userUid = useUser()?.uid;
  const guestUser = useGuestUserId();
  const userId = userUid ? userUid : guestUser;
  const [isLiked, setIsLiked] = useState(2);

  const handlerLike = async () => {
    setIsLiked(1);
    await set(ref(database, `quizzesMeta/${result.testId}/likeUsers/${userId}`), true);
    await set(ref(database, `quizzesMeta/${result.testId}/dislikeUsers/${userId}`), null);
    setTimeout(() => setIsLiked(2), 2200);
  }

  const handlerDisLike = async () => {
    setIsLiked(1);
    await set(ref(database, `quizzesMeta/${result.testId}/dislikeUsers/${userId}`), true);
    await set(ref(database, `quizzesMeta/${result.testId}/likeUsers/${userId}`), null);
    setTimeout(() => setIsLiked(2), 2200);
  }

  const getVotedUsers = async () => {
    const dbRef = ref(database);
    const snapshotLiked = await get(child(dbRef, `quizzesMeta/${result.testId}/likeUsers`));
    const snapshotDisliked = await get(child(dbRef, `quizzesMeta/${result.testId}/dislikeUsers`));
    // if (!snapshot.exists()) {
    //   throw new Error('No such liked users found!');
    // }
    let likeUsers: string[] = snapshotLiked.val();
    let dislikeUsers: string[] = snapshotDisliked.val();
    likeUsers = likeUsers ? Object.keys(likeUsers) : [];
    dislikeUsers = dislikeUsers ? Object.keys(dislikeUsers) : [];

    return [...likeUsers, ...dislikeUsers];
  }

  useEffect(() => {
    setTimeout(() => {
      if (myRef.current) {
        myRef.current.scrollIntoView({behavior: 'smooth'});
      }
    }, 100)
  }, [myRef]);

  useEffect(() => {
    getVotedUsers()
      .then((likedUsers) => {
        if (userUid && likedUsers.includes(userUid)) {
          (likedUsers.includes(userUid))
          setIsLiked(2);
          return;
        }
        if (guestUser && likedUsers.includes(guestUser)) {
          setIsLiked(2);
          return;
        }
        setIsLiked(0);
      })
  }, []);

  return (
    <div ref={myRef} className="result-wrapper">
      <div className="result-card">
        <h2 className="result-title">Тест выполнен!</h2>
        <h3 className="result-subtitle">{result.title}</h3>
        <p className="result-text">
          <strong>Верных ответов:</strong> {result.correctCount} ✓
        </p>
        <p className="result-text">
          <strong>Неверных/частично верных ответов:</strong> {result.incorrectCount} ✗
        </p>
        <p className="result-text result-text--total">
          <strong>Общий итог:</strong> {result.totalScore.toFixed(2)} / {result.answers.length}
        </p>
        <p className="result-percent">
          Ваш результат: {Math.round((result.totalScore / result.answers.length) * 100)}%
        </p>
        <button className="result-button" onClick={onReset}>
          Пройти тест ещё раз
        </button>
      </div>
      {
        (isLiked !== 2) &&
        <div className="like-card">
          {
            !isLiked ?
              <>
                <h4 className="quiz-rate">Оцените, пожалуйста, тест</h4>
                <button className='btn-like' onClick={handlerDisLike}>
                  <img className="img-btn-like img-dislike" src="/images/Like-quiz.png" alt="dislike"/>
                </button>
                <button className='btn-like' onClick={handlerLike}>
                  <img className="img-btn-like" src="/images/Like-quiz.png" alt="like"/>
                </button>
              </>
              :
              <p className="thanks-like">Спасибо за обратную связь!</p>
          }
        </div>
      }
      <RecentQuizzes currentTestId={result.testId}/>
    </div>
  );
}
