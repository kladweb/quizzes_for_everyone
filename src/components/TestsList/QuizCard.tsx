import React, { useState, memo, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { IQuizMeta } from "../../types/Quiz";
import { handleCopy, toggleLike } from "../../utils/quizUtils";
import { Statistics } from "../Statistics/Statistics";
import { showToast } from "../../store/useNoticeStore";
import "./quizCard.css"

interface ITestCardProps {
  quiz: IQuizMeta;
  dateFormatter: Intl.DateTimeFormat;
  openStatistic?: (testId: string) => void;
  userUID?: string;
  isShowStatistics?: boolean;
  handlerDeleteQuiz?: (quiz: IQuizMeta) => void;
}

export const QuizCard: React.FC<ITestCardProps> = memo(
  ({quiz, openStatistic, dateFormatter, userUID, isShowStatistics, handlerDeleteQuiz}) => {
    const currentLink = `${window.location.origin}/quizzes/${quiz.testId}`;
    const [copied, setCopied] = useState(false);
    const [likesCount, setLikesCount] = useState<number>(quiz.likeUsers ? Object.keys(quiz.likeUsers).length : 0);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
      if (userUID && quiz.likeUsers) {
        setIsLiked(Object.keys(quiz.likeUsers).includes(userUID))
      }
    }, [likesCount]);

    return (
      <div className='test-item' key={quiz.testId}>
        <div className='test-content'>
          <h3 className='test-name'>{quiz.title}</h3>
        </div>
        <div className="quiz-container-info">
          <div className="info-item">Категория: <span>{quiz.category}</span></div>
          <div className="info-item">Язык вопросов: <span>{quiz.lang}</span></div>
          <div className="quiz-feedback-info" title="Скольким людям тест понравился">
            <div className={`action-info btn-like-act${isLiked ? " isLiked" : ""}`} role="button"
                 onClick={() => toggleLike(quiz, userUID, setLikesCount)}>
              <img className={`img-like${isLiked ? " img-liked" : " img-noliked"}`} src="/images/Like-quiz.png"
                   alt="like"/>
              <span>{likesCount}</span>
            </div>
            <div className="action-info" title="Сколько раз тест пройден">
              <img className="img-like" src="/images/Arrow-quiz.png" alt="like"/>
              <span>{quiz.executionCount}</span>
            </div>
          </div>
          <div className="info-item">Создан: <span>{dateFormatter.format(quiz.createdAt)}</span></div>
        </div>
        <div>
        </div>
        {
          openStatistic &&
          <div className='test-buttons-block'>
            <button className='button-test' onClick={() => openStatistic(quiz.testId)}>Статистика</button>
            <button className='button-test' onClick={() => {
              showToast("Эта возможность пока не реализована.", "info");
            }}>Редактировать
            </button>
            {
              (userUID && handlerDeleteQuiz) &&
              // <button className='button-test' onClick={() => deleteUserQuiz(quiz.testId, userUID)}>Удалить</button>
              <button className='button-test'
                      onClick={() => handlerDeleteQuiz(quiz)}>
                Удалить
              </button>
            }
          </div>
        }
        <div className='test-buttons-block'>
          <button
            className={`btn quiz-link-copy ${copied ? " quiz-link-copy--copied" : ""}`}
            onClick={() => handleCopy(currentLink, setCopied)}
          >
            {copied ? 'Скопировано!' : 'Копировать ссылку'}
          </button>
          <NavLink className="link-open-test" to={`/quizzes/${quiz.testId}`}>
            <span>Открыть</span>
          </NavLink>
        </div>
        {
          isShowStatistics && <Statistics testId={quiz.testId}/>
        }
      </div>
    )
  }, (oldProps: ITestCardProps, nextProps: ITestCardProps) => {
    return (
      oldProps.quiz === nextProps.quiz &&
      oldProps.userUID === nextProps.userUID &&
      oldProps.isShowStatistics === nextProps.isShowStatistics
    )
  });
