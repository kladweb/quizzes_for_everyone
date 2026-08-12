import type { HandlerEvent } from "@netlify/functions";
import { requireAdmin } from "./utils/requireAdmin";
import { getAdminDatabase, initAdmin } from "./utils/initAdmin";
import { db } from "./utils/firebaseClientServer";
import { child, get, ref, update } from "firebase/database";


export const handler = async (event: HandlerEvent) => {

  try {
    initAdmin();
    await requireAdmin(event);

    const tokenPackage = JSON.parse(event.body);
    console.log(tokenPackage);
    // const usersSnapshot = await db.ref("users").once("value");
    const jobRef = ref(db, `users/${tokenPackage.userUID}/tokens`);

    try {
      const snapshot = await get(child(jobRef, `extraCount`));
      if (!snapshot.exists()) {
        return new Error('No such quiz found!');
      }
      const currentUserTokens = snapshot.val();
      console.log("currentUserTokens:", currentUserTokens);


      await update(jobRef, {
        dailyCount: currentUserTokens + tokenPackage.tokensAmount,
      })
    } catch (error) {
      console.error(error);
      return {
        statusCode: 403,
        body: JSON.stringify({
          error: "UNKNOWN_ERROR",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Tokens have been sent!",
      }),
    };

  } catch (e) {
    console.error(e);
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: "Unauthorized",
      }),
    };
  }
}
