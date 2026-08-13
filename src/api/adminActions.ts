import { auth } from "../firebase/firebase";

export const adminFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = await auth.currentUser?.getIdToken();

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUsers = async () => {
  const response = await adminFetch("/.netlify/functions/admin-get-users");
  if (!response.ok && response.status !== 200) {
    throw new Error("Failed to get users");
  }
  return await response.json();
}

interface IAddTokensProps {
  userUID: string;
  tokensAmount: number;
}

export const addTokensToUser = async (userUID: string, tokensAmount: number) => {
  if (!userUID || !tokensAmount) {
    throw new Error("Not enough data!");
  }
  if (tokensAmount > 100) {
    throw new Error("Too many tokens!");
  }
  const response = await adminFetch("/.netlify/functions/admin-add-tokens", {
    method: "POST",
    body: JSON.stringify({userUID, tokensAmount}),
  });
  if (!response.ok) {
    throw new Error("Failed add tokens");
  }
  return await response.json();
}
