"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../_authUtils/supabase_auth";
import { useLobbiesRealtime } from "../lib/lobbiesRealtime";

export default function LobbyList() {
  const [loading, setLoading] = useState(true);
  const [lobbies, setLobbies] = useState([]);
  const { session } = useAuth();

  console.log("Current Lobbies : ", lobbies);

  async function getLobbies() {
    const response = await fetch("/api/lobbies", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    const data = await response.json();
    setLobbies(data);
    setLoading(false);
  }

  useLobbiesRealtime(setLobbies);

  useEffect(() => {
    getLobbies();
  }, []);

  return loading ? (
    <div>
      <h1>Loading...</h1>
    </div>
  ) : (
    <div>
      {lobbies.map((lobby) =>
        lobby && lobby.id ? <li key={lobby.id}>{lobby.lobby_name}</li> : null
      )}
    </div>
  );
}
