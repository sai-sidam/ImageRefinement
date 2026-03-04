import { ensureGoogleConfig } from "../config.js";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Google AI Studio embeddings via Generative Language API.
 * Uses the same GOOGLE_AI_STUDIO_API_KEY as the rest of the project.
 *
 * @param {string} text
 * @param {object} options
 * @param {string} [options.model] - default text-embedding-004
 * @returns {Promise<number[]>}
 */
export async function embedText(text, options = {}) {
  let { model = "gemini-embedding-001" } = options;
  const { google } = ensureGoogleConfig();
  const apiKey = google.apiKey;

  // Allow passing "models/gemini-embedding-001" or "gemini-embedding-001"
  if (typeof model === "string" && model.startsWith("models/")) {
    model = model.slice("models/".length);
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:embedContent?key=${encodeURIComponent(apiKey)}`;

  const body = {
    content: {
      parts: [{ text }],
    },
  };

  let lastErr = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(`Embedding failed (${res.status}): ${msg}`.trim());
      }
      const json = await res.json();
      const values = json?.embedding?.values;
      if (!Array.isArray(values) || values.length === 0) {
        throw new Error("Embedding response missing embedding.values");
      }
      return values;
    } catch (e) {
      lastErr = e;
      // basic backoff (also helps with 429)
      await sleep(250 * Math.pow(2, attempt));
    }
  }
  throw lastErr || new Error("Embedding failed");
}

