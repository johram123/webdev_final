"use client";
import { useAuth } from "../../../_authUtils/supabase_auth";
import { useState, useEffect } from "react";

export default function CurrentLobby({ params }) {
  const { session, user } = useAuth();
  const [enemyPlayer, setEnemyPlayer] = useState(null);
  const [lobbyName, setLobbyName] = useState("");
  const formattedName = user.email.split("@")[0];

  async function getPlayers() {
    const { lobbyId } = await params;
    const res = await fetch(`/api/lobbies/${lobbyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    const result = await res.json();
    console.log("Current Lobby Players:", result);

    for (const player of result) {
      if (player.user_id !== user.id) {
        setEnemyPlayer(player);
        setLobbyName(player.lobby_name);
        break;
      }
    }
  }

  useEffect(() => {
    getPlayers();
  }, []);

  return (
    <div>
      <h1>Current Lobby</h1>
      <p>Lobby ID: {lobbyName} </p>
      <p>
        Enemy Player:{" "}
        {enemyPlayer ? enemyPlayer.username : "Waiting for opponent..."}
      </p>
      <p>You: {formattedName}</p>
    </div>
  );
}
