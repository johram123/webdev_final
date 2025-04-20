"use client";
import { AuthProvider } from "./supabase_auth";
import ProtectedRoute from "./protected_route";

export default function ClientRoot({ children }) {
  return (
    <AuthProvider>
      <ProtectedRoute>{children}</ProtectedRoute>
    </AuthProvider>
  );
}
