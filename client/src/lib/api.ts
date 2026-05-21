import { clearToken, getToken } from "./auth";

const API_BASE = import.meta.env.VITE_API_BASE ?? "https://opsnest-mfmu.onrender.com";

export async function apiRequest(
  path: string,
  options: RequestInit = {},
  allowAuth = true,
) {
  const headers = new Headers(options.headers || {});
  const hasBody = options.body !== undefined && options.body !== null;

  if (allowAuth) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const body =
    hasBody && typeof options.body !== "string"
      ? JSON.stringify(options.body)
      : options.body;

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      clearToken();
    }
    throw new Error(data?.message || "Request failed");
  }

  return data;
}
