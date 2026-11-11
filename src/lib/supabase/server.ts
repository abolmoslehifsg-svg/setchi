/** Server Supabase is unavailable in static export. */
export async function createClient(): Promise<never> {
  throw new Error("Server Supabase is not available in static export mode.");
}
