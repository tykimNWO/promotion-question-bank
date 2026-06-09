"use client";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";

export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "브라우저 Supabase 클라이언트를 쓰려면 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY가 필요합니다."
    );
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}
