import {
  pgTable,
  index,
  text,
  timestamp,
  integer,
  serial,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

//example not actually used
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

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const spotifyAccounts = pgTable("spotify_accounts", {
  userId: uuid("id")
    .primaryKey()
    .references(() => users.id),
  accessToken: text("access_token").notNull(),
  spotifyId: text("spotify_id").notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  scope: text("scope"),
  tokenType: text("token_type"),
});

export const backups = pgTable("backups", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  playlistId: text("playlist_id").notNull(),
  playlistName: text("playlist_name").default("new playlist"),
  playlistData: jsonb("playlist_data").notNull(),
  ownerName: text("owner_name"),
  trackCount: integer("track_count").default(0),
  spotifyUrl: text("spotify_url"),
  imageUrl: text("image_url"),
  format: text("format").default("json"),
  dataUrl: text("data_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
