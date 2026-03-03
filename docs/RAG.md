# RAG (Retrieval-Augmented Generation)

This repo can run a lightweight RAG layer over our internal docs and prompt files so agents can retrieve the most relevant standards, examples, and notes at runtime.

**Important:** This implementation provides the infrastructure (index → query → prompt-ready context). We will tune *what each agent retrieves* later.

---

## What gets indexed (default)

By default, `rag index` scans:

- `docs/` (markdown)
- `instagram-output/prompts/` (prompt text)
- `instagram-output/` (markdown/text notes like `ALL_POSTS_READY.md`)

It chunks the files into line-ranged blocks and stores embeddings in a local index file:

- `.rag/index.json` (ignored by git)

---

## Setup

RAG uses the same Google AI Studio key as the rest of the tool:

- `GOOGLE_AI_STUDIO_API_KEY` in your `.env`

RAG commands **do not require** Shopify credentials.

---

## Commands

### Build / refresh the index

```bash
npm run refine -- rag index
```

Optional overrides:

```bash
npm run refine -- rag index --paths=docs,instagram-output/prompts,instagram-output --index=.rag/index.json --model=gemini-embedding-001 --max-chars=1800 --overlap-lines=8
```

### Query the index

```bash
npm run refine -- rag query "What is the director's-scene standard?"
```

Optional:

```bash
npm run refine -- rag query "How do we do pose-only variations?" --k=8 --index=.rag/index.json
```

---

## Using RAG inside other commands (optional)

Director brief supports an optional retrieval step:

```bash
npm run refine -- brief <productId> --post=5 --rag
```

You can also point it at a specific index and change the number of retrieved chunks:

```bash
npm run refine -- brief <productId> --post=5 --rag --rag-index=.rag/index.json --rag-k=6
```

---

## Per-agent retrieval policies

See **[RAG_AGENT_POLICIES.md](RAG_AGENT_POLICIES.md)** for the full definition of what each agent may retrieve (sources, always-on intent, query-specific). Policies are applied in code (`src/rag/policies.js`).

**Use an agent policy when querying:**

```bash
npm run refine -- rag query "What caption style do we use?" --agent=smm
npm run refine -- rag query "Set variety and approved-image workflow" --agent=director
```

**Brief with Director policy (default when using --rag):**

```bash
npm run refine -- brief <productId> --post=5 --rag
```

