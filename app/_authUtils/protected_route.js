"use client";
import { useAuth } from "./supabase_auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      console.log("User:", user);
      router.push("/");
    }
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;

  return children;
}
