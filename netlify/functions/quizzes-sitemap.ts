import type { Handler } from "@netlify/functions";
import { getAdminDatabase, initAdmin } from "./utils/initAdmin";
import type { IQuizMeta } from "../../src/types/Quiz";

const SITE_URL = "https://anyquiz.net";
const MIN_RATING = 10;

const escapeXml = (value: string): string => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

export const handler: Handler = async () => {
  try {
    initAdmin();

    const db = getAdminDatabase();

    const snapshot = await db
      .ref("quizzesMeta")
      .once("value");

    const quizzesMeta = snapshot.val() as Record<string, IQuizMeta> | null;

    const quizzes = Object.values(quizzesMeta ?? {});

    const urls = quizzes
      .filter((quiz) => {
        const rating = Object.keys(quiz.likeUsers ?? {}).length;

        return (
          quiz.access === "public" &&
          rating >= MIN_RATING
        );
      })
      .map((quiz) => {
        const lastModified = quiz.modifiedAt ?? quiz.createdAt;

        return `
  <url>
    <loc>${SITE_URL}/quizzes/${encodeURIComponent(quiz.testId)}</loc>
    <lastmod>${new Date(lastModified).toISOString()}</lastmod>
  </url>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml; charset=UTF-8",
        "Cache-Control": "public, max-age=259200",
      },
      body: xml,
    };
  } catch (error) {
    console.error("Failed to generate quizzes sitemap:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/xml; charset=UTF-8",
      },
      body: `<?xml version="1.0" encoding="UTF-8"?>
<error>Sitemap generation failed</error>`,
    };
  }
};
