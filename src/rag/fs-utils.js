import fs from "fs";
import path from "path";

export function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function isProbablyTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ext === ".md" || ext === ".txt";
}

export function walkFiles(rootDir, { shouldIncludeFile, shouldDescend } = {}) {
  const out = [];

  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(current, ent.name);
      if (ent.isDirectory()) {
        if (shouldDescend && !shouldDescend(full)) continue;
        walk(full);
      } else if (ent.isFile()) {
        if (shouldIncludeFile && !shouldIncludeFile(full)) continue;
        out.push(full);
      }
    }
  }

  walk(rootDir);
  return out;
}

export function readUtf8(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

export function statSafe(filePath) {
  try {
    return fs.statSync(filePath);
  } catch {
    return null;
  }
}

