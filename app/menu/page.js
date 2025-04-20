"use client";

import Link from "next/link";
import { useAuth } from "../_authUtils/supabase_auth";
import { useEffect } from "react";

export default function Menu() {
  const { user, signOut } = useAuth();

  return (
    <main>
      <h1>Welcome {user?.email}</h1>
      <h1>Menu</h1>
      <div>
        <Link href="/menu/profile">Profile</Link>
      </div>
    </main>
  );
}
