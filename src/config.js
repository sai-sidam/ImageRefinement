import "dotenv/config";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required env: ${name}. Copy .env.example to .env and set your credentials.`
    );
  }
  return value;
}

export const config = {
  google: {
    apiKey: process.env.GOOGLE_AI_STUDIO_API_KEY || "",
  },
  shopify: {
    store: process.env.SHOPIFY_STORE || "",
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN || "",
  },
};

export function ensureConfig() {
  config.google.apiKey = requireEnv("GOOGLE_AI_STUDIO_API_KEY");
  config.shopify.store = requireEnv("SHOPIFY_STORE");
  config.shopify.accessToken = requireEnv("SHOPIFY_ACCESS_TOKEN");
  return config;
}

/** For workflows that only need Google AI Studio (e.g. RAG indexing/query). */
export function ensureGoogleConfig() {
  config.google.apiKey = requireEnv("GOOGLE_AI_STUDIO_API_KEY");
  return config;
}
