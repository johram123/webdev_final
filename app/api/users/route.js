import { createSupabaseServerClient } from "../../lib/supabaseServerClient";

export async function POST(request) {
  const { username } = await request.json();
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  const supabase = createSupabaseServerClient(token);

  console.log("Token:", token);
  console.log("Username:", username);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { data: existingUser, error: existingUserError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (existingUser) {
    const { data, error } = await supabase
      .from("users")
      .update({ username: username })
      .eq("id", user.id);

    if (error) {
      return new Response("Error updating user", { status: 500 });
    }
  } else {
    const { data, error } = await supabase
      .from("users")
      .insert({ username: username });

    if (error) {
      return new Response("Error inserting user", { status: 500 });
    }
  }

  return new Response(JSON.stringify({ message: "Success" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
