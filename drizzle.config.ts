import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // Path(s) to your schema definitions
  schema: "./src/server/db/schema.ts",

  // Where to output migration SQL and snapshots
  out: "./drizzle",

  // Core SQL dialect (needed for migrations, introspection)
  dialect: "postgresql",

  // Optional: specify custom driver (typically omitted for basic Postgres)
  // driver: "pglite" | "aws-data-api" | ...

  // Credentials for your database connection
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  // Optional flags:
  // strict: prompt before applying SQL
  strict: true,

  // verbose: log details during migration generation or push
  verbose: true,

  // If your provider includes roles (like Neon):
  entities: {
    roles: {
      provider: "neon",
    },
  },
});
