export const getUsers = async () => {
  const response = await fetch(
    "/.netlify/functions/admin-get-users"
  );
  console.log(response);
  if (!response.ok && response.status !== 200) {
    throw new Error("Failed to get users");
  }
  return await response.json();
}

export const addTokensToUser = async () => {
  const response = await fetch("/.netlify/functions/admin-add-tokens", {
    method: "POST",
    body: JSON.stringify({kex: 5}),
  });
  if (!response.ok) {
    throw new Error("Failed add tokens");
  }
  return await response.json();
}
