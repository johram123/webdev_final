"use client";
import { useEffect } from "react";
import supabase from "../_authUtils/supabase";

export function useLobbiesRealtime(setLobbies) {
  console.log("useLobbiesRealtime called");
  console.log("setLobbies", setLobbies);
  useEffect(() => {
    const channel = supabase
      .channel("lobby-changes")

      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "lobbies",
          filter: "status=eq.open",
        },
        (payload) => {
          const lobby = payload.new;
          console.log("📥 Realtime INSERT payload:", payload);

          setLobbies((prev) => [...prev, lobby]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "lobbies",
          filter: "status=eq.finished",
        },
        (payload) => {
          const lobby = payload.new;
          console.log("📥 Realtime INSERT payload:", payload);

          setLobbies((prev) => [...prev, lobby]);
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setLobbies]);
}
