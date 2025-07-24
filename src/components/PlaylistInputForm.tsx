"use client";

import React, { useState } from "react";

interface PlaylistInputFormProps {
  isLoading: boolean;
  onSubmit: (playlistId: string) => void;
}

export default function PlaylistInputForm({
  isLoading,
  onSubmit,
}: PlaylistInputFormProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const regex =
      /^https:\/\/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)(\?.*)?$/;
    const match = regex.exec(inputValue);

    if (!match?.[1]) {
      alert("Please enter a valid Spotify playlist URL!");
      return;
    }
    const playlistId = match[1];
    onSubmit(playlistId);
    setInputValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className={`w-128 rounded border border-gray-600 bg-gray-800 px-4 py-2 text-white focus:border-purple-500 focus:outline-none ${isLoading ? "cursor-not-allowed opacity-60" : ""}`}
        placeholder={
          isLoading ? "Submitting..." : "Enter playlist url to import."
        }
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isLoading}
      />
    </form>
  );
}
