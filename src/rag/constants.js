import path from "path";

// Available for embedContent (per ListModels): models/gemini-embedding-001
export const DEFAULT_EMBEDDING_MODEL = "gemini-embedding-001";
export const DEFAULT_INDEX_PATH = path.resolve(".rag", "index.json");

export const DEFAULT_SOURCE_ROOTS = [
  path.resolve("docs"),
  path.resolve("instagram-output", "prompts"),
  path.resolve("instagram-output"),
];

export const DEFAULT_TEXT_EXTENSIONS = new Set([".md", ".txt"]);

