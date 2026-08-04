import { IQuizzes, IStatisticsAll, UsersAdminMap } from "../types/Quiz";

const TIME_PERIOD = 2592000000; //30 days;

export interface IUsersExtraInfo {
  countAllUsers: number;
  countUsersReg: number;
  countUsersVisited: number;
}

export interface IQuizzesAdminInfo {
  countAllQuizzes: number,
  countLastCreatedQuizzes: number,
}

export interface IQuizzesStatInfo {
  countUsersPassedQuizzes: number,
  countUnknownPassedQuizzes: number,
}

export const getUsersExtraInfo = (users: UsersAdminMap) => {
  const usersExtraInfo = {
    countAllUsers: Object.keys(users).length,
    countUsersReg: 0,
    countUsersVisited: 0,
  };
  const dateNow = new Date();
  Object.values(users).forEach((user) => {
    if (Number(dateNow) - Number(user.registrationDate) < TIME_PERIOD) {
      usersExtraInfo.countUsersReg++;
    }
    if (Number(dateNow) - Number(user.lastVisitedDate) < TIME_PERIOD) {
      usersExtraInfo.countUsersVisited++;
    }
  });
  return usersExtraInfo;
}

export const getQuizzesAdminInfo = (quizzes: IQuizzes) => {
  const quizzesAdminInfo: IQuizzesAdminInfo = {
    countAllQuizzes: Object.keys(quizzes).length,
    countLastCreatedQuizzes: 0,
  }
  const dateNow = Number(new Date());
  Object.values(quizzes).forEach((quiz) => {
    if (dateNow - Number(quiz.createdAt) < TIME_PERIOD) {
      quizzesAdminInfo.countLastCreatedQuizzes++;
    }
  });
  return quizzesAdminInfo;
}

export const getQuizzesStatInfo = (statisticsAll: IStatisticsAll) => {
  const quizzesStatInfo: IQuizzesStatInfo = {
    countUsersPassedQuizzes: 0,
    countUnknownPassedQuizzes: 0,
  }
  const dateNow = Number(new Date());

  Object.values(statisticsAll).forEach((statisticsQuiz) => {
    Object.values(statisticsQuiz).forEach((statistics) => {
      if (dateNow - Number(statistics.finishedAt) < TIME_PERIOD) {
        quizzesStatInfo.countUsersPassedQuizzes++;
        if (!statistics.userUid.includes("user")) {
          quizzesStatInfo.countUnknownPassedQuizzes++;
        }
      }
    })
  })

  return quizzesStatInfo;
}
