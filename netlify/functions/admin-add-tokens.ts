import type { HandlerEvent } from "@netlify/functions";
import { requireAdmin } from "./utils/requireAdmin";
import { initAdmin } from "./utils/initAdmin";
import { getDatabase } from "firebase/database";

export const handler = async (event: HandlerEvent) => {

  console.log(event);

  // try {
  //   initAdmin();
  //   const db = getDatabase();
  //
  //
  // } catch (e) {
  //   console.error(e);
  // }
  return {
    statusCode: 200,
    body: JSON.stringify({
      toket: 10,
    }),
  };
}
