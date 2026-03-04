import fs from "fs";
import path from "path";
import { ensureDir } from "./fs-utils.js";

export function loadIndex(indexPath) {
  try {
    const raw = fs.readFileSync(indexPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveIndex(indexPath, indexData) {
  ensureDir(path.dirname(indexPath));
  fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2), "utf8");
}

