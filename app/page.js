"use client";

import { useAuth } from "./_authUtils/supabase_auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { gitHubSignIn, user, loading } = useAuth();
  const router = useRouter();

  async function handleSignIn() {
    await gitHubSignIn();
  }

  useEffect(() => {
    if (user) {
      console.log("User is logged in:", user);
      router.push("/menu");
    }
  }, [user]);

  return (
    !loading &&
    !user && (
      <main>
        <h1>Drop the handkerchief</h1>

        <div>
          <button onClick={handleSignIn}>Sign in with Github</button>
        </div>
      </main>
    )
  );
}
