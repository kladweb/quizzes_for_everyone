import { useNotice, useShowToastError, useShowToastInfo } from "../store/useNoticeStore";
import { child, get, ref, set } from "firebase/database";
import { database } from "../firebase/firebase";
import { IQuizMeta } from "../types/Quiz";

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

export const toggleLike = async (quiz: IQuizMeta, userUID: string | undefined, setLikesCount: (likesCount: number) => void) => {
  if (!userUID) {
    useShowToastError("Нужно залогиниться или пройти тест !");
    return;
  }
  const likeUsers: { [userUID: string]: boolean } = quiz.likeUsers ? quiz.likeUsers : {};
  const disLikeUsers: { [userUID: string]: boolean } = quiz.dislikeUsers ? quiz.dislikeUsers : {};
  const likeUsersArr: string[] = Object.keys(likeUsers);
  const disLikeUsersArr: string[] = Object.keys(disLikeUsers);

  if (likeUsersArr.includes(userUID)) {
    await set(ref(database, `quizzesMeta/${quiz.testId}/likeUsers/${userUID}`), null);
    quiz.likeUsers = likeUsers;
    delete quiz.likeUsers[userUID];
    setLikesCount(Object.keys(quiz.likeUsers).length);
  } else {
    await set(ref(database, `quizzesMeta/${quiz.testId}/likeUsers/${userUID}`), true);
    quiz.likeUsers = likeUsers;
    quiz.likeUsers[userUID] = true;
    setLikesCount(Object.keys(quiz.likeUsers).length);
    if (disLikeUsersArr.includes(userUID)) {
      await set(ref(database, `quizzesMeta/${quiz.testId}/dislikeUsers/${userUID}`), null);
    }
  }
}


