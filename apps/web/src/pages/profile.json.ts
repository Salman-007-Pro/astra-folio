import type { APIRoute } from "astro";
import { getContent } from "../lib/content";
export const GET: APIRoute = async () => {
  const { profile, experience } = await getContent();
  return Response.json({ profile, experience });
};
