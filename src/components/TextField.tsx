"use client";

import React, { useState } from "react";
import { useAuth } from "~/context/AuthContext";
import { getPlaylistForBackup } from "~/lib/spotify";
import getBackupFromDatabase from "~/services/backupService";
import { refreshAccessToken } from "~/lib/spotify";
type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

interface SpotifyApiResponse {
  source: string;
  data: Json; // or a more specific type if you know it
  tokenRefreshed?: boolean;
  newTokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

{
  /* TO:DO 
  First: Check if the list if legit
  Second: Check if playlist is already backedup
    if backuped give the user the option the update the save
    if not give user the backup the playlist
  Third: Make a page to see all backedup playlist of a user 
  Forth: Optionso download the saves
  */
}

export default function TextField() {
  const [value, setValue] = useState("");
  const { session, status } = useAuth();
  const [isLoading, setLoading] = useState(false);
  // const [backupState, setBackup] = useState<any>(null); // unsafe like this

  if (status === "loading") {
    return (
      <input
        type="text"
        className="w-128 cursor-not-allowed rounded border border-gray-600 bg-gray-800 px-4 py-2 text-white opacity-60 focus:border-purple-500 focus:outline-none"
        placeholder="Loading..."
        disabled
      />
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const regex =
      /^https:\/\/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)(\?.*)?$/;
    const match = regex.exec(value);

    if (!match) {
      alert("Please enter a valid Spotify playlist URL.");
      setValue("");
      setLoading(false);
      return;
    }

    const playlistId = match[1];
    const userId = session?.userId;

    if (!userId) {
      alert("userId not found please sign back in!");
      console.log(userId);
      setValue("");
      setLoading(false);
      return;
    }

    try {
      // Make API call instead of direct database query
      const response = await fetch(`/api/playlist/${playlistId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      let source: string;
      let data: Json; // or your specific type
      // let tokenRefreshed: boolean | undefined;
      // let newTokens: { accessToken: string; refreshToken: string } | undefined;

      const json: unknown = await response.json();
      if (
        typeof json === "object" &&
        json !== null &&
        typeof (json as { source?: unknown }).source === "string" &&
        "data" in json
      ) {
        const parsed = json as SpotifyApiResponse;
        source = parsed.source;
        data = parsed.data;
        // tokenRefreshed = parsed.tokenRefreshed;
        // newTokens = parsed.newTokens;
      } else {
        throw new Error("Invalid API response format");
      }

      console.log(data);
      if (source == "database") {
        // Handle existing backup
        console.log("Backup already exists:", data);
      } else {
        // Proceed with creating new backup
        console.log("Creating new backup...");
      }
    } catch (error) {
      console.error("Error checking backup:", error);
      alert("Failed to check existing backups");
    }

    setLoading(false);
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className={`w-128 rounded border border-gray-600 bg-gray-800 px-4 py-2 text-white focus:border-purple-500 focus:outline-none ${isLoading ? "cursor-not-allowed opacity-60" : ""}`}
        placeholder={
          isLoading ? "Submitting..." : "Enter playlist url to import."
        }
        value={value}
        onChange={handleChange}
        disabled={isLoading}
      />
    </form>
  );
}
