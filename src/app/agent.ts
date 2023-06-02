import { parseSessionCookie } from "@/session";
import { BskyAgent } from "@atproto/api";
import { cookies } from "next/headers";
import { cache } from "react";

export const getAgent = cache(async () => {
  const session = parseSessionCookie(cookies());

  const agent = new BskyAgent({
    service: session?.service ?? "https://bsky.social",
  });

  session && (await agent.resumeSession(session.atp));

  return agent;
});
