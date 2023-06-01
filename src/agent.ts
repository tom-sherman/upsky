import "server-only";
import { BskyAgent } from "@atproto/api";
import { cache } from "react";
import { createSession, getSession, putSessionData } from "./db/session";

export const getAgent = cache(async () => {
  const session = await getSession();

  const agent = new BskyAgent({
    service: session?.data?.service ?? "https://api.bsky.org",
    persistSession: async (_event, atpSession) => {
      if (atpSession) {
        if (session) {
          await putSessionData(session.id, atpSession);
        } else {
          await createSession({
            service: "https://api.bsky.org",
            ...atpSession,
          });
        }
      }
    },
  });

  if (session?.data) {
    await agent.resumeSession(session.data);
  }

  return agent;
});
