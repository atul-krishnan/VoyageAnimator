import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routeProjectInputSchema } from "@/lib/validation";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteParams) {
  const { id } = await context.params;

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase service role is not configured" },
      { status: 503 },
    );
  }

  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = routeProjectInputSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("route_projects")
    .update({
      name: parsed.data.name,
      map_style_id: parsed.data.mapStyleId,
      vehicle_model_id: parsed.data.vehicleModelId,
      points_json: parsed.data.points,
      playback_json: parsed.data.playback,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id,user_id,name,map_style_id,vehicle_model_id,points_json,playback_json,created_at,updated_at")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to update project" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    item: {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      mapStyleId: data.map_style_id,
      vehicleModelId: data.vehicle_model_id,
      points: data.points_json,
      playback: data.playback_json,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    },
  });
}

export async function DELETE(request: Request, context: RouteParams) {
  const { id } = await context.params;

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase service role is not configured" },
      { status: 503 },
    );
  }

  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("route_projects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
