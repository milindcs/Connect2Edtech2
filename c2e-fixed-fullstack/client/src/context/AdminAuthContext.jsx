import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/axios";

const AdminAuthContext = createContext(null);

const TOKEN_KEY = "c2e_admin_token";
const INFO_KEY = "c2e_admin_info";


// ======================================================================
// SAFE STORAGE
// ======================================================================

function getStoredAdmin() {
  try {
    const raw = localStorage.getItem(INFO_KEY);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch (error) {
    console.warn("Invalid admin information found in localStorage.");

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


// ======================================================================
// PROVIDER
// ======================================================================

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(getStoredAdmin);
  const [token, setToken] = useState(getStoredToken);
  const [loading, setLoading] = useState(false);


  // ====================================================================
  // LOGIN
  // ====================================================================

  const login = useCallback(async (email, password) => {
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      if (!data?.token) {
        throw new Error(
          "Authentication token was not returned by the server."
        );
      }

      localStorage.setItem(TOKEN_KEY, data.token);

      if (data.admin) {
        localStorage.setItem(
          INFO_KEY,
          JSON.stringify(data.admin)
        );
      } else {
        localStorage.removeItem(INFO_KEY);
      }

      setToken(data.token);
      setAdmin(data.admin || null);

      return data;
    } finally {
      setLoading(false);
    }
  }, []);


  // ====================================================================
  // LOGOUT
  // ====================================================================

  const logout = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(INFO_KEY);

    setToken(null);
    setAdmin(null);

    try {
      await api.post("/auth/logout");
    } catch {
      // Local logout has already completed.
    }
  }, []);


  // ====================================================================
  // MULTI-TAB SYNCHRONIZATION
  // ====================================================================

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === TOKEN_KEY) {
        if (event.newValue) {
          setToken(event.newValue);
          setAdmin(getStoredAdmin());
        } else {
          setToken(null);
          setAdmin(null);
        }
      }

      if (event.key === INFO_KEY) {
        setAdmin(getStoredAdmin());
      }
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);


  // ====================================================================
  // CONTEXT VALUE
  // ====================================================================

  const value = {
    admin,
    token,
    isAuthenticated: Boolean(token),
    loading,
    login,
    logout,
  };


  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}


// ======================================================================
// HOOK
// ======================================================================

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error(
      "useAdminAuth must be used within an AdminAuthProvider"
    );
  }

  return context;
}