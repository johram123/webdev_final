"use client";

import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "../_authUtils/supabase_auth";
import { useState } from "react";
import LobbyList from "../components/lobby_list";

export default function FindLobby() {
  const [showCreateLobby, setShowCreateLobby] = useState(false);
  const { session } = useAuth();
  const [lobbyName, setLobbyName] = useState("");

  const ButtonWithIcon = () => (
    <Button>
      <Plus />
      Create a Lobby
    </Button>
  );

  async function createLobby(event) {
    event.preventDefault();

    await fetch("/api/lobbies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ name: lobbyName }),
    });
  }

  return showCreateLobby ? (
    <div>
      <h1>Create a Lobby</h1>
      <form onSubmit={createLobby}>
        <input
          type="text"
          placeholder="Lobby Name"
          required
          onChange={(e) => setLobbyName(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
      <button onClick={() => setShowCreateLobby(false)}>Cancel</button>
    </div>
  ) : (
    <main>
      <h1>Find a Lobby</h1>
      <div onClick={() => setShowCreateLobby(true)}>
        <ButtonWithIcon />
      </div>
      <div>
        <h1>Available Lobbies</h1>
        <LobbyList />
      </div>
    </main>
  );
}
