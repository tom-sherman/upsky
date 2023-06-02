import type { NextRequest } from "next/server";
import { z } from "zod";

const sessionSchema = z.object({
  refreshJwt: z.string(),
  accessJwt: z.string(),
  handle: z.string(),
  did: z.string(),
  email: z.string().optional(),
});

export function parseSessionCookie(cookies: NextRequest["cookies"]) {
  const sessionCookie = cookies.get("bsky-session");
  if (!sessionCookie) {
    return null;
  }

  const session = JSON.parse(atob(sessionCookie.value));
  const parsed = sessionSchema.safeParse(session);
  if (!parsed.success) {
    return null;
  }

  return parsed.data;
}
