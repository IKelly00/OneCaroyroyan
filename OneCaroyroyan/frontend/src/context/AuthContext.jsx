import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { ROLE_COLORS, ROLE_MENUS } from "../data/mockData";
import { authApi, getToken, setToken } from "../lib/api";

/*
 * AuthContext
 * ------------------------------------------------------------------
 * Now backed by the real Express/MySQL API instead of a bare
 * setCurrentRole(role) call. On mount, if a JWT is already sitting in
 * localStorage (oc_token — see src/lib/api.js) we validate it against
 * GET /api/auth/me so a page refresh doesn't bounce the user back to
 * /login. doLogin(username, password) now actually checks credentials
 * server-side (bcrypt-compared against users.password_hash) and the
 * role comes back from the database rather than a login-form <select>.
 * ------------------------------------------------------------------
 */

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, username, fullName, role } | null
  const [initializing, setInitializing] = useState(true);

  // On first load, if we have a stored token, verify it's still valid
  // and hydrate the session instead of forcing a fresh login.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setInitializing(false);
      return;
    }
    authApi
      .me()
      .then((me) =>
        setUser({
          id: me.id,
          userCode: me.user_code,
          fullName: me.full_name,
          username: me.username,
          role: me.role,
        })
      )
      .catch(() => setToken(null)) // token expired/invalid — clear it, fall back to /login
      .finally(() => setInitializing(false));
  }, []);

  const doLogin = async (username, password) => {
    const { token, user: loggedInUser } = await authApi.login(username, password);
    setToken(token);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const doLogout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => {
    const currentRole = user?.role || null;

    if (!currentRole) {
      return { currentRole: null, isAuthenticated: false, initializing, doLogin, doLogout };
    }
    const initials = currentRole
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2);

    return {
      currentRole,
      isAuthenticated: true,
      initializing,
      user,
      roleColor: ROLE_COLORS[currentRole] || "#1D4ED8",
      roleInitials: initials,
      navMenu: ROLE_MENUS[currentRole] || [],
      doLogin,
      doLogout,
    };
  }, [user, initializing]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth() must be used inside an <AuthProvider>");
  }
  return ctx;
}
