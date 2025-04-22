import { createSupabaseServerClient } from "../../../lib/supabaseServerClient";

//join
export async function POST(request, { params }) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  const supabase = createSupabaseServerClient(token);
  const { forceJoin } = request.json();

  const { id } = params;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data: playerExists } = await supabase
    .from("lobby_players")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (playerExists && !forceJoin) {
    return new Response(
      { alreadyInLobby: true, currentLobbyId: playerExists.lobby_id },
      { status: 200 }
    );
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
    .insert({ lobby_id: id });

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

//ready
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

  const { data, error } = await supabase
    .from("lobby_players")
    .update({ is_ready: true })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error marking player as ready:", error);
    return new Response("Error marking player as ready", { status: 500 });
  }

  return new Response(
    { message: "Player marked as ready successfully." },
    { status: 200 }
  );
}
