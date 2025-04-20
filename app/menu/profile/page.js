"use client";

import { useAuth } from "../../_authUtils/supabase_auth";
import { useEffect } from "react";

export default function Profile() {
  const { user, signOut } = useAuth();

  return (
    <main>
      <h1>Welcome {user?.email}</h1>
      <h1>Profile</h1>
      <div>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    </main>
  );
}
