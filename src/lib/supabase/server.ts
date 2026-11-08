// Not used in static export mode. Kept for future server deployments.
export async function createClient() {
  throw new Error("Server Supabase client is not available in static export mode.");
}
