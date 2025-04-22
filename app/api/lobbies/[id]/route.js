import { createSupabaseServerClient } from "../../../lib/supabaseServerClient";

//join
export async function POST(request, { params }) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  const supabase = createSupabaseServerClient(token);
  const { forceJoin } = request.json();

  const { id } = await params;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formattedName = user.email.split("@")[0];

  const { data: playerExists } = await supabase
    .from("lobby_players")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (playerExists && !forceJoin) {
    return new Response(JSON.stringify({ alreadyInLobby: true }), {
      status: 409,
    });
  }

  if (playerExists && forceJoin) {
    const { error: leaveError } = await supabase
      .from("lobby_players")
      .delete()
      .eq("user_id", user.id);

    if (leaveError) {
      console.error("Error leaving current lobby:", leaveError);
      return new Response("Error leaving current lobby", { status: 500 });
    }
  }

  const { data, error } = await supabase
    .from("lobby_players")
    .insert({ lobby_id: id, player_name: formattedName });

  if (error) {
    console.error("Error joining lobby:", error);
    return new Response("Error joining lobby", { status: 500 });
  }

  return new Response({ joined: true }, { status: 200 });
}

//leave
export async function DELETE(request, { params }) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  const supabase = createSupabaseServerClient(token);
  const { id } = params;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data, error } = await supabase
    .from("lobby_players")
    .delete()
    .eq("user_id", user.id);

  const { date: playerRemaining } = await supabase
    .from("lobby_players")
    .select("*")
    .eq("lobby_id", id);

  if (error) {
    console.error("Error leaving lobby:", error);
    return new Response("Error leaving lobby", { status: 500 });
  }

  return new Response(
    { message: "Player left lobby successfully." },
    { status: 200 }
  );
}

//ready and unready
export async function PATCH(request, { params }) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  const supabase = createSupabaseServerClient(token);
  const { id } = params;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data: isReady } = await supabase
    .from("lobby_players")
    .select("is_ready")
    .eq("user_id", user.id)
    .maybeSingle();

  if (isReady) {
    const { data, error } = await supabase
      .from("lobby_players")
      .update({ is_ready: false })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error marking player as unready:", error);
      return new Response("Error marking player as unready", { status: 500 });
    }

    return new Response(JSON.stringify({ ready: false }), { status: 200 });
  } else {
    const { data, error } = await supabase
      .from("lobby_players")
      .update({ is_ready: true })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error marking player as ready:", error);
      return new Response("Error marking player as ready", { status: 500 });
    }

    return new Response(JSON.stringify({ ready: true }), { status: 200 });
  }
}

// get lobby players
export async function GET(request, { params }) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  const supabase = createSupabaseServerClient(token);
  const { id } = await params;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data, error } = await supabase
    .from("lobby_players")
    .select("player_name, user_id, lobbies(lobby_name)")
    .eq("lobby_id", id);

  if (error) {
    console.error("Error fetching lobby players:", error);
    return new Response("Error fetching lobby players", { status: 500 });
  }

  const lobbyNameInclude = data.map((p) => ({
    player_name: p.player_name,
    user_id: p.user_id,
    lobby_name: p.lobbies?.lobby_name,
  }));

  return new Response(JSON.stringify(lobbyNameInclude), { status: 200 });
}
