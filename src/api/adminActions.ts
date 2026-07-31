export async function getUsers() {
  const response = await fetch(
    "/.netlify/functions/admin-get-users"
  );

  if (!response.ok) {
    throw new Error("Failed to get users");
  }

  return await response.json();
}
