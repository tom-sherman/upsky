import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { z } from "zod";

const atpSessionDataSchema = z.object({
  refreshJwt: z.string(),
  accessJwt: z.string(),
  handle: z.string(),
  did: z.string(),
  email: z.string().optional(),
});

const sessionSchema = z.object({
  atp: atpSessionDataSchema,
  service: z.string(),
});

export function parseSessionCookie(
  cookies: Pick<NextRequest["cookies"], "get">
) {
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

export function setSessionCookie(session: z.infer<typeof sessionSchema>) {
  cookies().set("bsky-session", btoa(JSON.stringify(session)), {
    httpOnly: true,
    sameSite: "lax",
  });
}

export function deleteSessionCookie() {
  cookies().delete("bsky-session");
}
