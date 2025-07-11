"use client";

import { PAGE_URLS } from "@/constants/PAGE_URLS";
import { API } from "@/lib/api";
import { GetAuthMeResType } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import type React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthContextType = {
  user: GetAuthMeResType | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<GetAuthMeResType | null>(null);
  const isAuthenticated = useMemo(() => !!token && !!user, [token, user]);
  const router = useRouter();

  // API hooks
  const {
    usePostAuthLogin,
    usePostAuthRegister,
    useGetAuthMe,
    usePostAuthLogout,
  } = API.AUTH;

  const loginMutation = usePostAuthLogin();
  const registerMutation = usePostAuthRegister();
  const logoutMutation = usePostAuthLogout();

  const {
    data: userData,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useGetAuthMe({
    enabled: !!token && isInitialized,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const localUserData = JSON.parse(localStorage.getItem("user") || "null");

    if (storedToken) {
      setToken(storedToken);
    }

    if (userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } else if (localUserData) {
      setUser(localUserData);
    }

    setIsInitialized(true);
  }, [userData]);

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password });

      setToken(result.token);
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      // Refetch user data
      refetchUser();
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const result = await registerMutation.mutateAsync({
        email,
        password,
        name,
      });

      setToken(result.token);
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      // Refetch user data
      refetchUser();
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await logoutMutation.mutateAsync({});
        router.push(PAGE_URLS.HOME);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  const isLoading =
    loginMutation.isPending ||
    registerMutation.isPending ||
    isUserLoading ||
    !isInitialized;

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        token,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
