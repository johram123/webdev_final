"use client";

import Link from "next/link";
import { useAuth } from "../_authUtils/supabase_auth";
import { useEffect } from "react";

export default function Menu() {
  const { user, session } = useAuth();

  async function insertUser() {
    const formattedName = user.email.split("@")[0];
    console.log("Access token:", session?.access_token);

    await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ username: formattedName }),
    });
  }

  useEffect(() => {
    insertUser();
  }, []);

  return (
    <main>
      <h1>Welcome {user?.email}</h1>
      <h1>Menu</h1>
      <div>
        <Link href="/menu/profile">Profile</Link>
      </div>
      <div>
        <Link href="/find_lobby">Find Lobbies</Link>
      </div>
    </main>
  );
}
