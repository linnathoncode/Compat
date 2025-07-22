import { db } from "~/server/db";
import { eq } from "drizzle-orm";

export default async function getBackupFromDatabase(
  playlistId: string,
  userId: string,
) {
  const backup = await db.query.backups.findFirst({
    where: (row) => eq(row.userId, userId) && eq(row.playlistId, playlistId),
  });
  if (!backup) {
    // Return null if no backup is found
    return null;
  }
  return backup;
}
