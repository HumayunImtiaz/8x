"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  createSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

export function AuthControls() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createSupabaseBrowserClient();
    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (sessionError) setError(sessionError.message);
      setEmail(data.session?.user.email ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    setError("");
    try {
      const { error: signOutError } = await createSupabaseBrowserClient().auth.signOut();
      if (signOutError) throw signOutError;
      setEmail(null);
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not sign out.");
    }
  }

  return (
    <div className="flex shrink-0 items-center gap-3 sm:gap-4">
      {email ? (
        <>
          <span className="hidden max-w-36 truncate text-[#D0D0DE] sm:inline" title={email}>{email}</span>
          <button
            className="whitespace-nowrap rounded-sm px-2 py-2 text-[#D0D0DE] transition-colors hover:text-[#FFE84A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD91A]"
            onClick={() => void signOut()}
            type="button"
          >
            Log out
          </button>
        </>
      ) : (
        <>
          <Link
            className="whitespace-nowrap rounded-sm px-2 py-2 text-[#D0D0DE] transition-colors hover:text-[#FFE84A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD91A]"
            href="/login"
          >
            Login
          </Link>
          <Link
            className="whitespace-nowrap rounded-full border border-[#FFD91A]/60 bg-[#FFD91A] px-4 py-2 font-semibold text-[#070711] shadow-[0_0_22px_rgba(255,201,40,0.12)] transition-[background-color,box-shadow,transform] hover:-translate-y-0.5 hover:bg-[#FFE84A] hover:shadow-[0_0_28px_rgba(255,201,40,0.28)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFE84A] active:translate-y-0 sm:px-5"
            href="/signup"
          >
            Sign up
          </Link>
        </>
      )}
      {error && <span className="sr-only" role="alert">{error}</span>}
    </div>
  );
}
