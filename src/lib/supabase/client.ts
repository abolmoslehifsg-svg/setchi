import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://ymbkdwayywntbelgshcn.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "sb_publishable_7KtcOG_A3aI4OUFV8DXyOA_4zf42FyP";
  return createBrowserClient(url, key);
}
