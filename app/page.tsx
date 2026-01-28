"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createPaste() {
    setError(null);
    setResult(null);

    if (!content.trim()) {
      setError("Content cannot be empty");
      return;
    }

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        ttl: ttl ? Number(ttl) : null,
        maxViews: maxViews ? Number(maxViews) : null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setResult(data.url);
    setContent("");
    setTtl("");
    setMaxViews("");
  }

  return (
    <main style={{ maxWidth: 600, margin: "40px auto" }}>
      <h1>Pastebin Lite</h1>

      <textarea
        placeholder="Enter your text here..."
        rows={10}
        style={{ width: "100%" }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div style={{ marginTop: 10 }}>
        <input
          type="number"
          placeholder="TTL (seconds)"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          type="number"
          placeholder="Max views"
          value={maxViews}
          onChange={(e) => setMaxViews(e.target.value)}
        />
      </div>

      <button style={{ marginTop: 20 }} onClick={createPaste}>
        Create Paste
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <p>
          Paste URL:{" "}
          <a href={result} target="_blank">
            {result}
          </a>
        </p>
      )}
    </main>
  );
}
