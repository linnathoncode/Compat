import {
  pgTable,
  index,
  text,
  timestamp,
  integer,
  serial,
} from "drizzle-orm/pg-core";

export const posts = pgTable(
  "compat_post",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [index("name_idx").on(table.name)],
);
