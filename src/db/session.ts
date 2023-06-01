import { cache } from "react";
import { db } from "./_client";
import { SessionData, SessionTable } from "./schema";
import { eq, sql } from "drizzle-orm";
import { cookies } from "next/headers";

export const getSession = cache(async () => {
  const sessionId = cookies().get("bsky-session");
  if (!sessionId) return null;
  return (
    (
      await db
        .select()
        .from(SessionTable)
        .where(eq(SessionTable.id, sessionId.value))
    )[0] ?? null
  );
});

export const putSessionData = async (
  id: string,
  data: Partial<SessionData>
) => {
  await db.execute(sql`
    insert into ${SessionTable} (${SessionTable.id}, ${SessionTable.data})
    values (${id}, '${JSON.stringify(data)}'::jsonb)
    on conflict (${SessionTable.id}) do update
      set data = ${SessionTable.data} || excluded.data;
  `);
};

export const createSession = async (data: SessionData) => {
  const rows = await db.insert(SessionTable).values({ data }).returning();

  return rows[0]!;
};
