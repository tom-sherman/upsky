import { deleteSessionCookie, parseSessionCookie } from "@/session";
import { BskyAgent } from "@atproto/api";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { cache } from "react";

export const getAgent = cache(async () => {
  const session = parseSessionCookie(cookies());

  const agent = new BskyAgent({
    service: session?.service ?? "https://bsky.social",
  });

  if (session) {
    try {
      await agent.resumeSession(session.atp);
    } catch (err) {
      if (err instanceof Error && err.message === "Authentication Required") {
        deleteSessionCookie();
        redirect("/login");
      }

      throw err;
    }
  }

  return agent;
});
