import { api, storeUser } from "../../lib/api-client";

export async function loginWithPassword({ username, password }) {
  const res = await api.post("/api/user/login?turnstile=", { username, password });
  const payload = res.data;
  if (!payload?.success) throw new Error(payload?.message || "Login failed");
  if (payload?.data?.require_2fa) throw new Error("2FA required is not implemented yet in web-v2");
  storeUser(payload.data);
  return payload.data;
}

export async function fetchCurrentUser() {
  const res = await api.get("/api/user/self");
  const payload = res.data;
  if (!payload?.success) throw new Error(payload?.message || "Failed to fetch current user");
  storeUser(payload.data);
  return payload.data;
}
