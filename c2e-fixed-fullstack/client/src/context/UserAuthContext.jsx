import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/axios";

const UserAuthContext = createContext(null);

const TOKEN_KEY = "c2e_user_token";
const INFO_KEY = "c2e_user_info";

function getStoredUser() {
  try {
    const raw = localStorage.getItem(INFO_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Invalid user information found in localStorage.");
    localStorage.removeItem(INFO_KEY);
    return null;
  }
}

function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(getStoredToken);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/user/login", {
        email,
        password,
      });

      if (!data?.token) {
        throw new Error(
          "Authentication token was not returned by the server."
        );
      }

      localStorage.setItem(TOKEN_KEY, data.token);

      if (data.user) {
        localStorage.setItem(INFO_KEY, JSON.stringify(data.user));
      } else {
        localStorage.removeItem(INFO_KEY);
      }

      setToken(data.token);
      setUser(data.user || null);

      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/user/register", {
        name,
        email,
        password,
      });

      if (!data?.token) {
        throw new Error(
          "Authentication token was not returned by the server."
        );
      }

      localStorage.setItem(TOKEN_KEY, data.token);

      if (data.user) {
        localStorage.setItem(INFO_KEY, JSON.stringify(data.user));
      } else {
        localStorage.removeItem(INFO_KEY);
      }

      setToken(data.token);
      setUser(data.user || null);

      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(INFO_KEY);

    setToken(null);
    setUser(null);

    try {
      await api.post("/auth/user/logout");
    } catch {
      // Local logout has already completed.
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === TOKEN_KEY) {
        if (event.newValue) {
          setToken(event.newValue);
          setUser(getStoredUser());
        } else {
          setToken(null);
          setUser(null);
        }
      }

      if (event.key === INFO_KEY) {
        setUser(getStoredUser());
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    loading,
    login,
    register,
    logout,
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);

  if (!context) {
    throw new Error(
      "useUserAuth must be used within a UserAuthProvider"
    );
  }

  return context;
}
