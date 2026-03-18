"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthContext } from "@/contexts/AuthContext";

export function useAuth() {
  const router = useRouter();
  const { setUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async ({ email, password }) => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      document.cookie = `accessToken=${data.data.accessToken}; path=/; max-age=86400`;
      setUser(data.data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    document.cookie = "accessToken=; path=/; max-age=0";
    setUser(null);
    router.push("/login");
  };

  return { login, logout, isLoading, error };
}
