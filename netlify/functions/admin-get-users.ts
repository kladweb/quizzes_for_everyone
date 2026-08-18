import type { HandlerEvent } from "@netlify/functions";
import { getAuth } from "firebase-admin/auth";
import { requireAdmin } from "./utils/requireAdmin";
import { getAdminDatabase, initAdmin } from "./utils/initAdmin";
import type { UsersAdminMap } from "../../src/types/Quiz";

export const handler = async (event: HandlerEvent) => {

  try {
    initAdmin();
    await requireAdmin(event);

    const users = await getAuth().listUsers();
    const db = getAdminDatabase();
    const usersSnapshot = await db.ref("users").once("value");
    const usersFirebase = usersSnapshot.val() || {};

    const usersAdmin = users.users.reduce((acc, user) => {
      const userData = usersFirebase[user.uid];
      acc[user.uid] = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        quizzesCount: userData?.quizIds ? Object.keys(userData.quizIds).length : 0,
        tokensDailyCount: userData?.tokens ? userData.tokens.dailyCount : 0,
        tokensExtraCount: userData?.tokens ? userData.tokens.extraCount : 0,
        tokensCurrentCount: userData?.tokens ?
          userData.tokens.dailyCount + userData.tokens.extraCount - userData.tokens.usedToday
          :
          0,
        tokensPlan: userData?.tokens ? usersFirebase[user.uid].tokens.plan : 'none',
        registrationDate: userData?.userDatesInfo?.registration ?
          userData.userDatesInfo.registration : 0,
        lastVisitedDate: userData?.userDatesInfo?.lastVisited ?
          userData.userDatesInfo.lastVisited : 0,
        lastCreatedQuizDate: userData?.userDatesInfo?.lastCreatedQuiz ?
          userData.userDatesInfo.lastCreatedQuiz : 0,
        lastPassedQuizDate: userData?.userDatesInfo?.lastPassedQuiz ?
          userData.userDatesInfo.lastPassedQuiz : 0,
      };
      return acc;
    }, {} as UsersAdminMap);

    return {
      statusCode: 200,
      body: JSON.stringify(usersAdmin),
    };
  } catch (e) {
    console.error(e);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to load users",
      }),
    };
  }
}
