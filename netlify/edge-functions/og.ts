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

const replaceCanonical = (html: string, href: string): string => {
  const escapedHref = escapeHtmlAttr(href);
  return html.replace(
    /<link\s+[^>]*rel=["']canonical["'][^>]*href=["'][^"']*["'][^>]*\/?\s*>/i,
    (tag) => tag.replace(/href=["'][^"']*["']/i, `href="${escapedHref}"`)
  );
};

const replaceOgUrl = (html: string, url: string): string => {
  return replaceMetaContent(html, "property", "og:url", url);
};

const isAssetAvailable = async (assetUrl: URL): Promise<boolean> => {
  try {
    const response = await fetch(assetUrl);
    if (!response.ok) return false;

    const contentType = (response.headers.get("content-type") ?? "").toLowerCase();
    return contentType.startsWith("image/");
  } catch {
    return false;
  }
};

const resolveOgImageUrl = async (request: Request, category?: string): Promise<string> => {
  const base = new URL(request.url).origin;
  const normalizedCategory = (category ?? "").trim().toLowerCase();
  const candidates = [
    normalizedCategory ? `/images/og/${normalizedCategory}.jpg` : "",
    normalizedCategory ? `/images/og/${normalizedCategory}.jpeg` : "",
    normalizedCategory ? `/images/og/${normalizedCategory}.png` : "",
    "/images/og/default.jpg"
  ].filter(Boolean);

  for (const candidate of candidates) {
    const candidateUrl = new URL(candidate, base);
    const exists = await isAssetAvailable(candidateUrl);
    if (exists) {
      return candidateUrl.toString();
    }
  }

  return new URL("/images/og/default.jpg", base).toString();
};

export default async (request: Request) => {
  try {
    const url = new URL(request.url);

    const isHomePage = url.pathname === "/";
    const isAllQuizzesPage = url.pathname === "/allquizzes";
    const quizMatch = url.pathname.match(/^\/quizzes\/([^/]+)\/?$/);
    const isQuizPage = Boolean(quizMatch);

    if (!isHomePage && !isAllQuizzesPage && !isQuizPage) {
      return fetch(request);
    }

    let title = "Создавайте и проходите тесты";
    let description =
      "ANY QUIZ - платформа для создания, публикации и прохождения тестов онлайн. Делитесь тестами и проверяйте" +
      " знания бесплатно.";
    let ogImageUrl = new URL("/open.png", url.origin).toString();

    if (isAllQuizzesPage) {
      title = "Все квизы";
      description = "Каталог публичных тестов ANY QUIZ. Находите интересные тесты и проходите их онлайн.";
    }

    if (isQuizPage && quizMatch) {
      const quizId = quizMatch[1];
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

      title = rawTitle.slice(0, 120).trim();
      description = rawDescription.slice(0, 200).trim();
      ogImageUrl = await resolveOgImageUrl(request, data?.category);
    }

    const canonicalUrl = `${url.origin}${url.pathname}`;
    const htmlRes = await fetch(new URL("/index.html", request.url));
    let html = await htmlRes.text();

    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtmlAttr(title)} | ANY QUIZ</title>`);
    html = replaceMetaContent(html, "name", "description", description);
    html = replaceMetaContent(html, "property", "og:title", title);
    html = replaceMetaContent(html, "property", "og:description", description);
    html = replaceOgUrl(html, canonicalUrl);
    html = replaceMetaContent(html, "property", "og:image", ogImageUrl);
    html = replaceMetaContent(html, "name", "twitter:title", title);
    html = replaceMetaContent(html, "name", "twitter:description", description);
    html = replaceMetaContent(html, "name", "twitter:image", ogImageUrl);
    html = replaceCanonical(html, canonicalUrl);

    return new Response(html, {
      headers: {"content-type": "text/html; charset=utf-8"}
    });
  } catch {
    return fetch(request);
  }
};
