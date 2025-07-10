"use client";

import React, { useState } from "react";
import { useAuth } from "~/context/AuthContext";

// function sleep(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

export default function TextField() {
  const [value, setValue] = useState("");
  const { session, status } = useAuth();
  const [isLoading, setLoading] = useState(false);

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
    console.log(value);
    setValue("");
    // await sleep(2000); // sleep for 2 seconds
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
