"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../_authUtils/supabase_auth";
import { useLobbiesRealtime } from "../lib/lobbiesRealtime";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LobbyList() {
  const [loading, setLoading] = useState(true);
  const [lobbies, setLobbies] = useState([]);
  const { session, user } = useAuth();
  const username = user?.email.split("@")[0];
  const router = useRouter();
  useLobbiesRealtime(setLobbies);

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

  async function joinLobby(lobbyId) {
    const res = await fetch(`/api/lobbies/${lobbyId}`, {
      method: "POST",
      body: JSON.stringify({ forceJoin: false, username }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    const result = await res.json();

    if (result.alreadyInLobby) {
      const confirm = window.confirm(
        "You're already in a lobby. Leave it and join this one?"
      );
      if (confirm) {
        await fetch(`/api/lobbies/${lobbyId}`, {
          method: "POST",
          body: JSON.stringify({ forceJoin: true, username }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
        });
        router.push(`/lobby/${lobbyId}`);
      }
    } else {
      router.push(`/lobby/${lobbyId}`);
    }
  }

  useEffect(() => {
    getLobbies();
  }, []);

  return loading ? (
    <div>
      <h1>Loading...</h1>
    </div>
  ) : (
    <div className="flex flex-col ">
      {lobbies.length === 0 ? (
        <div className="">
          <h1 className="">No lobbies available</h1>
        </div>
      ) : (
        <div>
          {lobbies.map((lobby) => (
            <li
              key={lobby.id}
              className="bg-gray-800 m-4 p-4 w-1/5 h-44 list-none flex-col relative "
            >
              <div className="h-9/12 ml-4 flex items-center text-xl rounded-lg">
                {lobby.lobby_name}
              </div>
              <div className="absolute bottom-4 right-5 ">
                <Button
                  className="w-12 bg-green-300"
                  onClick={() => joinLobby(lobby.id)}
                >
                  Join
                </Button>
              </div>
            </li>
          ))}
        </div>
      )}
    </div>
  );
}
