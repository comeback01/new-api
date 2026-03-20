import { useEffect, useMemo, useState } from "react";
import { clearStoredUser, getStoredUser } from "../../lib/api-client";
import { fetchCurrentUser, loginWithPassword } from "./api";

export function useAuth() {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const existing = getStoredUser();
    if (!existing) {
      setBootstrapped(true);
      return;
    }
    fetchCurrentUser()
      .then((data) => setUser(data))
      .catch(() => {
        clearStoredUser();
        setUser(null);
      })
      .finally(() => setBootstrapped(true));
  }, []);

  async function login(credentials) {
    setLoading(true);
    try {
      const data = await loginWithPassword(credentials);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearStoredUser();
    setUser(null);
  }

  return useMemo(() => ({ user, loading, bootstrapped, login, logout }), [user, loading, bootstrapped]);
}
