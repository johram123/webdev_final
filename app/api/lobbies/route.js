import { createSupabaseServerClient } from "../../lib/supabaseServerClient";

//fetch lobbies
export async function GET(request) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  const supabase = createSupabaseServerClient(token);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data: lobbies, error } = await supabase
    .from("lobbies")
    .select("*")
    .neq("status", "finished");

  if (error) {
    console.error("Error fetching lobbies:", error);
    return new Response("Error fetching lobbies", { status: 404 });
  }

  return new Response(JSON.stringify(lobbies), { status: 200 });
}

//create lobby
export async function POST(request) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  const supabase = createSupabaseServerClient(token);
  const { name } = await request.json();
  console.log("name:", name);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formattedName = user.email.split("@")[0];

  const { data } = await supabase
    .from("lobbies")
    .select("id")
    .eq("host_id", user.id);

  if (data.length > 0) {
    return new Response(JSON.stringify({ alreadyHost: true }), {
      status: 409,
    });
  }

  const { data: insertedLobby, error } = await supabase
    .from("lobbies")
    .insert({ lobby_name: name })
    .select()
    .single();

  console.log("insertedLobby:", insertedLobby);

  if (error || !insertedLobby) {
    console.error("Error creating lobby:", error);
    return new Response("Failed to create lobby", { status: 500 });
  }

  const { data: lobby, error: lobbyError } = await supabase
    .from("lobby_players")
    .insert({ lobby_id: insertedLobby.id, player_name: formattedName });

  if (lobbyError) {
    console.error("Error inserting lobby player:", lobbyError);
    return new Response("Error inserting lobby player", { status: 500 });
  }

  return new Response(JSON.stringify({ lobbyId: insertedLobby.id }), {
    status: 200,
  });
}
