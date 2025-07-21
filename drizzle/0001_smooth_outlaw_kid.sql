ALTER TABLE "backups" ALTER COLUMN "playlist_name" SET DEFAULT 'new playlist';--> statement-breakpoint
ALTER TABLE "backups" ALTER COLUMN "playlist_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "spotify_accounts" ADD COLUMN "spotify_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "backups" DROP COLUMN "total_duration_ms";