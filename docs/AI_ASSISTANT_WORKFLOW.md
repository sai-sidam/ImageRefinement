# Expert-draft flow: Gemini at every step

**Idea:** When we're defining or questioning **what** the Director, SMM, or process should do (creative/strategic), **Gemini** is the brain. When we're **building or implementing** that in code and docs, **Cursor** (the IDE assistant) does it.

---

## How it works

1. **You** say something in the chat — e.g. "The director has to do X, Y, Z. The director is not supposed to do this. What do you think?"
2. **Cursor** runs the **expert** command with your message (and optionally `--rag` so Gemini sees current guidelines). Gemini's reply is **put back in the conversation chat** so you can read it and react.
3. **You** react — e.g. "Isn't X supposed to be in a different manner?" or "Make changes."
4. If you're asking a **follow-up** (e.g. "isn't X different?") → **Cursor** asks **that** to Gemini again (same command, your new message; optionally include previous Q&A in the message so Gemini has context). Gemini's answer is **shown in the chat** again.
5. When you say **"implement"** / **"this is perfect"** / **"do it"** → **Cursor** actually **implements**: updates docs, `director-brief.js`, prompts, etc., to match what we decided.

So: **Gemini** gives the expert/creative answer at every step; **you** react in the chat; **Cursor** runs the expert command to get Gemini's reply and, when you're happy, implements.

---

## Commands

From the project root:

```bash
# Have Gemini review all guideline docs (consistency, improvements, other cases, gaps). Output in chat; you react, then implement.
node src/cli.js review

# Ask Gemini (answer will be printed; Cursor pastes it into the chat for you to react)
node src/cli.js expert "Director should do X, not Y. What do you think?"

# Same, but include current Director (or SMM) guidelines from RAG so Gemini has context
node src/cli.js expert "The director is not supposed to repeat the same set. What do you think?" --rag
node src/cli.js expert "SMM should decide post type and slide count. Agree?" --rag --agent=smm
```

For a **follow-up** turn, include the previous exchange in your message, e.g.:

```bash
node src/cli.js expert "Previous: I said 'Director should do X.' You said '...' Now: isn't X supposed to be in a different manner?"
```

---

## Who does what

| Step | Who |
|------|-----|
| You give guidelines or ask "what do you think?" | **You** |
| Send that to Gemini and get an answer | **Cursor** (runs `expert "<message>"`) |
| Show Gemini's answer in the chat | **Cursor** (pastes the command output) |
| You react ("change X" / "isn't Y different?" / "implement") | **You** |
| If follow-up → ask Gemini again, show answer in chat | **Cursor** |
| If "implement" → update docs/code/prompts | **Cursor** |

---

## When to ask the user vs Gemini

**Ask Gemini** when the missing information is **expert/creative/strategic** — e.g. how to structure a doc, what variables to capture, what principles to write, example copy, guidelines. Gemini can fill those.

**Ask the user** when the missing information is **specific to the user or the company** — things only they have or know. Examples: the user's name (or any real person's name), the actual company logo file (Gemini doesn't have it), locked brand hex codes, real product names, real dates, or any "fill in with your real X" placeholder. Don't ask Gemini for those; ask the user.

---

*Implementation: `src/expert-draft.js`, CLI command `expert` in `src/cli.js`.*
