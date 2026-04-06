const escapeHtmlAttr = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const replaceMetaContent = (html: string, attrName: "property" | "name", attrValue: string, content: string): string => {
  const escapedContent = escapeHtmlAttr(content);
  const pattern = new RegExp(
    `<meta\\s+[^>]*${attrName}=["']${attrValue}["'][^>]*content=["'][^"']*["'][^>]*\\/?\\s*>`,
    "i"
  );
  return html.replace(
    pattern,
    (tag) => tag.replace(/content=["'][^"']*["']/i, `content="${escapedContent}"`)
  );
};

export default async (request: Request) => {
  try {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/quizzes\/(.+)/);

    if (!match) {
      return fetch(request);
    }

    const quizId = match[1];
    const apiRes = await fetch(
      `https://quizzes-for-everyone-default-rtdb.europe-west1.firebasedatabase.app/quizzesMeta/${quizId}.json`
    );

    if (!apiRes.ok) {
      return fetch(request);
    }

    const data = (await apiRes.json()) ?? {};
    const rawTitle = typeof data?.title === "string" ? data.title : "ANY QUIZ";
    const rawDescription =
      typeof data?.description === "string" ? data.description : "Create and share quizzes easily";

    const title = rawTitle.slice(0, 120).trim();
    const description = rawDescription.slice(0, 200).trim();

    const htmlRes = await fetch(new URL("/", request.url));
    let html = await htmlRes.text();

    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtmlAttr(title)} | ANY QUIZ</title>`);
    html = replaceMetaContent(html, "property", "og:title", title);
    html = replaceMetaContent(html, "property", "og:description", description);
    html = replaceMetaContent(html, "name", "twitter:title", title);
    html = replaceMetaContent(html, "name", "twitter:description", description);

    return new Response(html, {
      headers: {"content-type": "text/html; charset=utf-8"}
    });
  } catch {
    return fetch(request);
  }
};
