import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

import { env } from "~/env";

const globalForDb = globalThis as unknown as { pool?: Pool };

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

if (!globalForDb.pool) {
  globalForDb.pool = pool;
}

export const db = drizzle(pool, {
  schema,
  logger: true, // Enable logging for debugging
});
