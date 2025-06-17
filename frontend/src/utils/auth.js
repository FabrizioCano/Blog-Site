const API_URL = import.meta.env.VITE_API_URL;
export function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function getUserIdFromToken() {
  const token = localStorage.getItem('access');
  const payload = parseJwt(token);
  return payload?.user_id || null;
}


async function refreshToken() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) {
    console.log("No refresh token in localStorage");
    return null;
  }

  const res = await fetch(`${API_URL}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    console.log("Refresh token failed", res.status);
    return null;
  }

  const data = await res.json();
  console.log("New access token from refresh:", data.access);
  localStorage.setItem("access", data.access);
  return data.access;
}


export async function authFetch(url, options = {}) {
  let access = localStorage.getItem("access");
  console.log("authFetch token:", access);

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 401) return response;

  console.log("Token expired, refreshing...");
  access = await refreshToken();

  if (!access) {
    console.warn("No se pudo refrescar token");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/login";
    return response;
  }

  console.log("Token refreshed:", access);

  localStorage.setItem("access", access);

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
    },
  });
}
