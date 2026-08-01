import type { HandlerEvent } from "@netlify/functions";
import { requireAdmin } from "./utils/requireAdmin";
import { getAuth } from "firebase-admin/auth";
import { getAdminDatabase, initAdmin } from "./utils/initAdmin";
import { IUserAdmin, UsersAdminMap } from "../../src/types/Quiz";

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
