import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_SERVER_URL || "",
  headers: {
    "Cache-Control": "no-store",
  },
});

export function setApiUserHeader(user) {
  const userId = user?.id ?? -1;
  api.defaults.headers["New-API-User"] = userId;
}

export function getStoredUser() {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function storeUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
  setApiUserHeader(user);
}

export function clearStoredUser() {
  localStorage.removeItem("user");
  setApiUserHeader(null);
}

setApiUserHeader(getStoredUser());
