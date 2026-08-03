import { UsersAdminMap } from "../types/Quiz";

const TIME_PERIOD = 2592000000; //30 days;

export interface IUsersExtraInfo {
  countAllUsers: number;
  countUsersReg: number;
  countUsersVisited: number;
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
