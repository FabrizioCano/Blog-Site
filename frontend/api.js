// src/api.js
const BASE_URL = import.meta.env.VITE_API_URL

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/accounts/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function register(username, email, password1, password2) {
  const res = await fetch(`${BASE_URL}/accounts/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password1, password2 }),
  });
  return res.json();
}
