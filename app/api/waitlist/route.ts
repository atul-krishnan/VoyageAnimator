import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { waitlistSignupSchema } from "@/lib/validation";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = waitlistSignupSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase service role is not configured" },
      { status: 503 },
    );
  }

  const { data, error } = await supabase
    .from("waitlist_signups")
    .insert({
      email: parsed.data.email,
      creator_type: parsed.data.creatorType,
      use_case: parsed.data.useCase,
      source_page: parsed.data.sourcePage,
      consent: parsed.data.consent,
    })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to store waitlist submission" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
