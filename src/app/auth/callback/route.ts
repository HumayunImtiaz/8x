import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const nextPath = request.nextUrl.searchParams.get("next") ?? "/";
  const safeNextPath =
    nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/";

  if (!code) {
    return NextResponse.json(
      { error: "The authentication link is missing its code or has expired." },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.json(
      { error: `Could not complete authentication: ${error.message}` },
      { status: 400 },
    );
  }

  return NextResponse.redirect(new URL(safeNextPath, request.url));
}
