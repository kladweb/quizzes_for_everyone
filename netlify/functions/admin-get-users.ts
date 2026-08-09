import type { HandlerEvent } from "@netlify/functions";
import { requireAdmin } from "./utils/requireAdmin";
import { getAuth } from "firebase-admin/auth";
import { getAdminDatabase, initAdmin } from "./utils/initAdmin";
import { type UsersAdminMap } from "../../src/types/Quiz";

export const handler = async (event: HandlerEvent) => {

  await requireAdmin(event);

  try {
    initAdmin();

    const users = await getAuth().listUsers();
    const db = getAdminDatabase();
    const usersSnapshot = await db.ref("users").once("value");
    const usersFirebase = usersSnapshot.val() || {};

    const usersAdmin = users.users.reduce((acc, user) => {
      acc[user.uid] = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        quizzesCount: usersFirebase[user.uid]?.quizIds ? Object.keys(usersFirebase[user.uid].quizIds).length : 0,
        tokensDailyCount: usersFirebase[user.uid]?.tokens ? usersFirebase[user.uid].tokens.dailyCount : 0,
        tokensCurrentCount: usersFirebase[user.uid]?.tokens ? usersFirebase[user.uid].tokens.dailyCount -
          usersFirebase[user.uid].tokens.usedToday : 0,
        tokensPlan: usersFirebase[user.uid]?.tokens ? usersFirebase[user.uid].tokens.plan : 'none',
        registrationDate: usersFirebase[user.uid]?.userDatesInfo?.registration ?
          usersFirebase[user.uid].userDatesInfo.registration : 0,
        lastVisitedDate: usersFirebase[user.uid]?.userDatesInfo?.lastVisited ?
          usersFirebase[user.uid].userDatesInfo.lastVisited : 0,
        lastCreatedQuizDate: usersFirebase[user.uid]?.userDatesInfo?.lastCreatedQuiz ?
          usersFirebase[user.uid].userDatesInfo.lastCreatedQuiz : 0,
        lastPassedQuizDate: usersFirebase[user.uid]?.userDatesInfo?.lastPassedQuiz ?
          usersFirebase[user.uid].userDatesInfo.lastPassedQuiz : 0,
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
