import path from "path";
import { DEFAULT_TEXT_EXTENSIONS } from "./constants.js";
import { chunkTextByLines } from "./chunk.js";
import { embedText } from "./embeddings.js";
import { isProbablyTextFile, readUtf8, statSafe, walkFiles } from "./fs-utils.js";

function nowIso() {
  return new Date().toISOString();
}

function buildFileKey(absPath, mtimeMs) {
  return `${absPath}::${mtimeMs}`;
}

function defaultShouldDescend(dirPath) {
  const base = path.basename(dirPath);
  if (base === "node_modules") return false;
  if (base === ".git") return false;
  if (base === ".rag") return false;
  return true;
}

function defaultShouldIncludeFile(filePath) {
  if (!isProbablyTextFile(filePath)) return false;
  const ext = path.extname(filePath).toLowerCase();
  if (!DEFAULT_TEXT_EXTENSIONS.has(ext)) return false;
  return true;
}

/**
 * Build/refresh a JSON index of text chunks + embeddings.
 * Designed for small/medium corpora (docs + prompt files).
 */
export async function indexCorpus({
  sourceRoots,
  indexPath,
  model,
  maxChars,
  overlapLines,
  existingIndex,
  log = () => {},
}) {
  const previous = existingIndex || null;

  const prevChunkById = new Map();
  const prevFileKeyToChunkIds = new Map();

  if (previous?.chunks) {
    for (const ch of previous.chunks) {
      prevChunkById.set(ch.id, ch);
      if (ch.fileKey) {
        const list = prevFileKeyToChunkIds.get(ch.fileKey) || [];
        list.push(ch.id);
        prevFileKeyToChunkIds.set(ch.fileKey, list);
      }
    }
  }

  const allFiles = [];
  for (const root of sourceRoots) {
    const files = walkFiles(root, {
      shouldDescend: defaultShouldDescend,
      shouldIncludeFile: defaultShouldIncludeFile,
    });
    allFiles.push(...files);
  }

  const chunks = [];
  let reused = 0;
  let embedded = 0;

  for (const absPath of allFiles) {
    const st = statSafe(absPath);
    if (!st) continue;
    const fileKey = buildFileKey(absPath, st.mtimeMs);

    const maybeReuseIds = prevFileKeyToChunkIds.get(fileKey);
    if (maybeReuseIds?.length) {
      for (const id of maybeReuseIds) {
        const prev = prevChunkById.get(id);
        if (prev) {
          chunks.push(prev);
          reused++;
        }
      }
      continue;
    }

    const content = readUtf8(absPath);
    const rawChunks = chunkTextByLines({
      absPath,
      content,
      maxChars,
      overlapLines,
    });

    for (const rc of rawChunks) {
      const embedding = await embedText(rc.text, { model });
      embedded++;
      chunks.push({
        ...rc,
        fileKey,
        mtimeMs: st.mtimeMs,
        embedding,
      });
    }

    log(`Indexed ${path.relative(process.cwd(), absPath)} (${rawChunks.length} chunk(s))`);
  }

  const out = {
    version: 1,
    createdAt: previous?.createdAt || nowIso(),
    updatedAt: nowIso(),
    model,
    chunking: {
      maxChars,
      overlapLines,
    },
    sourceRoots,
    stats: {
      files: allFiles.length,
      chunks: chunks.length,
      reusedChunks: reused,
      embeddedChunks: embedded,
    },
    chunks,
  };

  return out;
}

