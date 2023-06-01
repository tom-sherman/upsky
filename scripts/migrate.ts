// To run this script do: DOTENV_CONFIG_PATH=.env.development.local pnpm tsx -r dotenv/config scripts/migrate.ts
// And replace .env.development.local with the path to the .env file
import { invariant } from "@/util/invariant";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const connectionString = process.env.POSTGRES_URL;
invariant(connectionString, "connectionString is not set");
const sql = postgres(connectionString, { max: 1, ssl: "require" });
const db = drizzle(sql);

migrate(db, { migrationsFolder: "drizzle" })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    sql.end();
  });
