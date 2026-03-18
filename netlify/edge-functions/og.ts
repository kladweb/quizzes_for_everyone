export default async (request: Request) => {
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

  const title = data?.title ?? "ANY QUIZ";
  const description = (data?.description ?? "Create and share quizzes easily").slice(0, 200);

  const htmlRes = await fetch(new URL("/", request.url));
  let html = await htmlRes.text();

  html = html.replace(
    `<meta property="og:title" content="Create any quiz for everyone"/>`,
    `<meta property="og:title" content="${title}"/>`
  );

  html = html.replace(
    `<meta property="og:description" content="Create and share quizzes easily"/>`,
    `<meta property="og:description" content="${description}"/>`
  );

  html = html.replace(
    `<title>ANY QUIZ</title>`,
    `<title>${title} | ANY QUIZ</title>`
  );

  return new Response(html, {
    headers: {"content-type": "text/html"}
  });
};
