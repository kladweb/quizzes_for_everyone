import { showToast } from "../store/useNoticeStore";
import { ref, set } from "firebase/database";
import { database } from "../firebase/firebase";
import { type IQuizMeta, ToastType } from "../types/Quiz";
import { QuizStorageManager } from "./QuizStorageManager";

export const handleCopy = async (currentLink: string, setCopied: (copied: boolean) => void) => {
  try {
    await navigator.clipboard.writeText(currentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

export const handlerDeleteQuiz = (
  testId: string,
  userUID: string,
  setIsModalConfirmOpen: (isModalConfirmOpen: boolean) => void) => {
}

export const toggleLike = async (
  quiz: IQuizMeta,
  userUID: string | undefined,
  guestUserId: string | null,
  setLikesCount: (likesCount: number) => void
) => {
  const userID = userUID ? userUID : (guestUserId ? guestUserId : null);
  if (!userID) {
    return;
  }

  let quizzes = QuizStorageManager.getRecentAllStat();
  // console.log(quiz);
  // console.log(quizzes);
  let isAllowLiked = false;
  quizzes?.forEach((q) => {
    if (q.testId === quiz.testId) {
      isAllowLiked = true;
    }
  });

  if (!userUID && !isAllowLiked) {
    showToast("Чтобы поставить оценку, нужно залогиниться или пройти этот тест.", ToastType.WARNING);
    return;
  }

  const likeUsers: { [userID: string]: boolean } = quiz.likeUsers ? quiz.likeUsers : {};
  const disLikeUsers: { [userID: string]: boolean } = quiz.dislikeUsers ? quiz.dislikeUsers : {};
  const likeUsersArr: string[] = Object.keys(likeUsers);
  const disLikeUsersArr: string[] = Object.keys(disLikeUsers);

  if (likeUsersArr.includes(userID)) {
    await set(ref(database, `quizzesMeta/${quiz.testId}/likeUsers/${userID}`), null);
    quiz.likeUsers = likeUsers;
    delete quiz.likeUsers[userID];
    setLikesCount(Object.keys(quiz.likeUsers).length);
  } else {
    await set(ref(database, `quizzesMeta/${quiz.testId}/likeUsers/${userID}`), true);
    quiz.likeUsers = likeUsers;
    quiz.likeUsers[userID] = true;
    setLikesCount(Object.keys(quiz.likeUsers).length);
    if (disLikeUsersArr.includes(userID)) {
      await set(ref(database, `quizzesMeta/${quiz.testId}/dislikeUsers/${userID}`), null);
    }
  }
}


