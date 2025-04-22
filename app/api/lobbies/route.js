import { createSupabaseServerClient } from "../../lib/supabaseServerClient";

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

  const { data, error } = await supabase
    .from("lobbies")
    .insert({ lobby_name: name })
    .select();

  if (error) {
    console.error("Error creating lobby:", error);
    return new Response("Error creating lobby", { status: 500 });
  }

  const insertedLobby = data[0];

  const { data: lobby, error: lobbyError } = await supabase
    .from("lobby_players")
    .insert({ lobby_id: insertedLobby.id });

  if (lobbyError) {
    console.error("Error inserting lobby player:", lobbyError);
    return new Response("Error inserting lobby player", { status: 500 });
  }

  return new Response(
    { message: "Lobby created successfully" },
    { status: 200 }
  );
}
