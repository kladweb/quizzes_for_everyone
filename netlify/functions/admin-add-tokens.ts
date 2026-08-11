import type { HandlerEvent } from "@netlify/functions";
import { requireAdmin } from "./utils/requireAdmin";
import { initAdmin } from "./utils/initAdmin";
import { getDatabase } from "firebase/database";

export const handler = async (event: HandlerEvent) => {

  try {
    initAdmin();
    await requireAdmin(event);
    console.log("УСПЕХ 4");
    const db = getDatabase();

    return {
      statusCode: 200,
      body: JSON.stringify({
        toket: 10,
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
