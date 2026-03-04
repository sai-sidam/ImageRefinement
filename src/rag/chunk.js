import crypto from "crypto";

function sha1(s) {
  return crypto.createHash("sha1").update(s).digest("hex");
}

function isHeading(line) {
  return /^#{1,6}\s+/.test(line);
}

/**
 * Chunk markdown/text into line-ranged chunks, biased to headings and blank lines.
 * Returns chunks with stable IDs based on file path + line range + content hash.
 */
export function chunkTextByLines({
  absPath,
  content,
  maxChars = 1800,
  overlapLines = 8,
}) {
  const lines = content.split(/\r?\n/);
  const chunks = [];

  let start = 1;
  let buf = [];
  let bufChars = 0;

  function pushChunk(endLineExclusive) {
    const endLine = endLineExclusive - 1;
    const text = buf.join("\n").trimEnd();
    if (!text.trim()) return;
    const id = sha1(`${absPath}:${start}:${endLine}:${sha1(text)}`);
    chunks.push({
      id,
      absPath,
      startLine: start,
      endLine,
      text,
    });
  }

  for (let i = 0; i < lines.length; i++) {
    const lineNo = i + 1;
    const line = lines[i];
    const nextSize = bufChars + line.length + 1;

    const hardBreak =
      nextSize > maxChars &&
      buf.length > 0 &&
      (line.trim() === "" || isHeading(line) || bufChars > maxChars * 0.85);

    if (hardBreak) {
      pushChunk(lineNo);

      // overlap: keep last N lines
      const overlap = overlapLines > 0 ? buf.slice(-overlapLines) : [];
      buf = overlap;
      bufChars = buf.reduce((acc, l) => acc + l.length + 1, 0);
      start = Math.max(1, lineNo - overlap.length);
    }

    buf.push(line);
    bufChars += line.length + 1;
  }

  pushChunk(lines.length + 1);
  return chunks;
}

