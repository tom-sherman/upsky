import type { AtpSessionData } from "@atproto/api";
import { uuid, jsonb, timestamp, pgTable } from "drizzle-orm/pg-core";

export interface SessionData extends AtpSessionData {
  service: string | null;
}

export const SessionTable = pgTable("session", {
  id: uuid("id").primaryKey().defaultRandom(),
  data: jsonb("data").$type<SessionData>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
