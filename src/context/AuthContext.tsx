"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface LoginResponse {
  token: string;
  tokenType: string;
  username: string;
  role: string;
  expiresIn: number;
}

interface AuthContextType {
  username: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "http://localhost:8081/api/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("loginTime");

    setUsername(null);
    setRole(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    if (token && storedUsername && storedRole) {
      setUsername(storedUsername);
      setRole(storedRole);
    } else {
      logout();
    }

    setIsLoading(false);
  }, [logout]);

  const login = useCallback(
    async (loginUsername: string, password: string) => {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginUsername,
          password,
        }),
      });

      const data = (await response.json()) as LoginResponse;

      if (!response.ok) {
        throw new Error(
          (data as LoginResponse & { message?: string }).message ||
            "Invalid username or password."
        );
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("tokenType", data.tokenType);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);
      localStorage.setItem("expiresIn", String(data.expiresIn));
      localStorage.setItem("loginTime", String(Date.now()));

      setUsername(data.username);
      setRole(data.role);
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        username,
        role,
        isAuthenticated: Boolean(username && role),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}
