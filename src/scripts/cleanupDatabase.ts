import { db } from "~/server/db";
import { sql } from "drizzle-orm";

async function removeDuplicates() {
  await db.execute(sql`
    DELETE FROM backups
    WHERE id NOT IN (
      SELECT MIN(id::text)::uuid
      FROM backups
      GROUP BY user_id, playlist_id
    );
  `);
  console.log("✅ Duplicates removed");
}

removeDuplicates().catch((err) => {
  console.error("❌ Failed to remove duplicates:", err);
});
