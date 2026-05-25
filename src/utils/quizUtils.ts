import { ref, set } from "firebase/database";
import { nanoid } from "nanoid";
import { database } from "../firebase/firebase";
import { showToast } from "../store/useNoticeStore";
import { type IQuizMeta, ToastType } from "../types/Quiz";
import { QuizStorageManager } from "./QuizStorageManager";
import { CAT_LABELS_RU_EXT } from "../variables/quizData";
import React from "react";

export const handleCopy = async (currentLink: string, setCopied: (copied: boolean) => void) => {
  try {
    await navigator.clipboard.writeText(currentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

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

export function prepareQuiz(raw: string, userUID: string): IQuizMeta {
  const quiz: IQuizMeta = JSON.parse(raw);

  quiz.testId = nanoid(12);
  quiz.createdBy = userUID;
  quiz.createdAt = Date.now();
  quiz.modifiedAt = Date.now();

  if (!quiz.title || !Array.isArray(quiz.questions)) {
    throw new Error("Неверный формат файла.");
  }

  quiz.questions.forEach((q, idx) => {
    if (!q.id) throw new Error(`Question ${idx + 1} missing id`);
    if (!Array.isArray(q.options)) {
      throw new Error(`Question ${idx + 1} missing options`);
    }
    if (!Array.isArray(q.correctAnswers)) {
      throw new Error(`Question ${idx + 1} missing correctAnswers`);
    }
  });
  return quiz;
}

export const filterQuizzes = (
  quizzes: IQuizMeta[],
  category?: string,
  includePrivate = false
) => {
  return quizzes
    .filter(q => includePrivate || q.access !== "private")
    .filter(q => !category || q.category === category);
};

export const getUniqueCategories = (quizzes: IQuizMeta[]): string[] => {
  const sorted = Array.from(
    new Set(
      quizzes
        .map(q => q.category)
        .filter((c): c is string => Boolean(c))
    )
  ).sort((a, b) =>
    CAT_LABELS_RU_EXT[a].localeCompare(CAT_LABELS_RU_EXT[b], "ru"));
  return ["all", ...sorted];
};

export const checkCategory = (e: React.MouseEvent<HTMLElement>, category?: string) => {
  if (category) {
    e.preventDefault();
  }
}

export const getSafeFileName = (title: string | undefined, maxLength: number = 30): string => {
  if (!title || title.trim() === '') {
    return 'quiz';
  }
  let cleanTitle = title
    .replace(/[^a-zA-Z0-9а-яА-ЯёЁ _-]/g, '_')
    .replace(/_{2,}/g, '_')
    .trim();
  if (cleanTitle.length <= maxLength) {
    return cleanTitle;
  }
  let truncated = cleanTitle.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  if (lastSpaceIndex > 8) {
    truncated = truncated.substring(0, lastSpaceIndex);
  }
  return truncated.trim();
};

