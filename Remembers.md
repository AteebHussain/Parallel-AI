# ParallelAI — How to Not Look Vibe-Coded
### A practical reference for writing, designing, and shipping like a senior dev

---

## What "Vibe-Coded" Actually Means (For This Project)

ParallelAI is a tool that sits directly in front of AI-literate users — developers, researchers, and technical recruiters. They will immediately recognize shortcuts. A vibe-coded AI comparison tool is one where the prompt box barely works, the responses flash in inconsistently, error states are blank, and the design looks like it was assembled from three different Shadcn starter templates. This guide exists to make sure ParallelAI looks and feels like it was built by someone who has shipped production software — because you have.

---

## 1. Code Quality

### Name things like you mean it
Lazy names signal lazy thinking. Every variable, function, and type should communicate intent.

```
❌ const data = await fetch("/api/compare")
✅ const comparisonResult = await fetch("/api/compare")

❌ function handleClick()
✅ function handleModelToggle(modelId: string)

❌ const res = useRef({})
✅ const streamingResponsesRef = useRef<Record<string, ResponseData>>({})
```

### No magic strings scattered across components
Model IDs like `"gpt-4o"`, `"gemini-2.0-flash"` should never be hardcoded inline. They already live in `lib/models.ts`. Reference them from there — always.

```
❌ if (modelId === "gpt-4o") { ... }
✅ if (modelId === MODELS.find(m => m.provider === "OpenAI")?.id) { ... }
```

### TypeScript — use it properly
`ResponseData` is already typed. Keep it that way. Never use `any`. If the OpenRouter API returns something unexpected, type it explicitly with a partial or unknown guard.

```
❌ const parsed: any = JSON.parse(data)
✅ const parsed = JSON.parse(data) as OpenRouterChunk
```

Define `OpenRouterChunk`, `SSEEvent`, `HistoryEntry` in a single `types/index.ts` file. Every shared type belongs there — not inline inside components.

### Functions do one thing
`streamOpenRouter` in `route.ts` handles fetching, decoding, parsing, and chunk emission. If it grows beyond ~50 lines, split it. A recruiter reading your API route should understand it in under 30 seconds.

### No dead code in the repo
No commented-out `callOpenAI` or `callGemini` functions left over from earlier iterations. No unused imports. Run ESLint before every commit. The rule is: if it is not running, it should not be in the file.

### Consistent async handling
You are using `async/await` with `try/catch` everywhere. Keep it that way. Do not mix `.then()` chains into the same codebase. Pick the pattern and never deviate.

---

## 2. Component Architecture

### Every component has one job

```
ComparisonGrid   → lays out the grid. Does not fetch. Does not format.
ModelCard        → displays one model's response. Does not know about other models.
PromptInput      → captures user input. Does not call the API directly.
ExportBar        → handles PNG export. Does not know what is being exported.
PromptHistory    → displays past entries. Does not store them.
```

If a component is doing two of these things, split it.

### Props should be typed and minimal
If you are passing more than 5 props to a component, consider whether some of them belong in a shared state layer instead. `ModelCard` receiving `model`, `response`, and `isLoading` is correct. It should never receive `allResponses` or `selectedModels`.

### Keep components in the right folder
`components/dashboard/` is for layout-level dashboard pieces. `components/ui/` is for Shadcn primitives only. Do not add custom components into `components/ui/`. Do not dump new files into the root of `components/`.

---

## 3. State Management

### `page.tsx` is your single source of truth
All comparison state lives in `page.tsx`: `responses`, `selectedModels`, `isLoading`, `history`. This is correct. Do not duplicate any of this state inside child components.

### Local state for local concerns only
Whether a copy button shows "Copied!" is local UI state. It belongs in `ModelCard` with `useState`. It should never travel up to `page.tsx`. Whether a model is selected belongs in `page.tsx`. It should never live inside `PromptInput` alone.

### `responsesRef` exists for a reason — keep it
The `useRef` pattern alongside `useState` for streaming responses is intentional. React state updates are batched and async. During streaming, `responsesRef.current` is the real-time source of truth. Do not remove it or try to simplify it away — you will break streaming.

### Never mutate state directly
Always spread or copy before updating:

```
❌ responses[modelId] = { text: "..." }
✅ setResponses(prev => ({ ...prev, [modelId]: { text: "..." } }))
```

---

## 4. Error Handling — The Biggest Tell

This is where most AI tools built at speed fall apart completely. ParallelAI calls live external APIs. Things will fail. Every failure must be handled gracefully and communicated clearly.

### The three states every model card must handle

Every `ModelCard` must visually handle all three states with no exceptions:

| State | What the user sees |
|---|---|
| Loading | Spinner with "Generating response..." |
| Success | Formatted markdown response with latency and token badges |
| Error | Red error message with the actual API error text |

A card that goes blank on error is half-built.

### API errors must show real messages
The `callOpenRouter` function already throws with the API's error message. Make sure `ModelCard` always renders `response.error` when present. Never swallow errors silently.

```
❌ catch { /* skip */ }
✅ catch (err) { send({ modelId, type: "error", error: err instanceof Error ? err.message : "Unknown error" }) }
```

### Handle the case where no models are selected
If a user deselects all model toggles and hits Compare, the button is disabled. Good. But also make sure the disabled state is visually obvious — muted color, reduced opacity, cursor not-allowed.

### Handle slow or stalled streams
If a model takes more than 15 seconds to return its first chunk, the user needs feedback. Consider adding a timeout or a "taking longer than expected..." message for streams that stall.

---

## 5. UI and Visual Polish

### Spacing must be consistent
You are using Tailwind's spacing scale. Stick to it. Do not mix `p-5`, `p-[18px]`, and `padding: 16px` for the same type of element. Every card uses `p-5`. Every section gap uses `space-y-6`. Define the system and apply it without exceptions.

### The color palette is Set 3 — use it everywhere

| Token | Hex | Usage |
|---|---|---|
| Page background | `#222831` | `bg-background` only |
| Card / surface | `#393E46` | textarea, model cards, sidebar |
| Accent | `#FFD369` | Compare button, active model toggle, heading highlight |
| Primary text | `#EEEEEE` | All body and heading text |
| Muted text | `#94A3B8` | Labels, metadata, placeholders |

The amber `#FFD369` appears in exactly two places: the Compare button and the active model toggle border. Nowhere else. This is intentional. Overusing the accent color destroys the visual hierarchy.

### Typography has three levels — use only three

| Level | Usage | Class |
|---|---|---|
| Heading | Page title only | `text-4xl font-black` |
| Body | Response text, descriptions | `text-sm font-normal leading-relaxed` |
| Label | Badges, button text, metadata | `text-[10px] font-bold uppercase tracking-wider` |

Do not introduce a fourth size. Do not use `font-semibold` on body text.

### Empty states are not optional
Before any prompt is submitted, the grid area should not be blank. It should show a subtle empty state:

```
A faint centered message:
"Your model responses will appear here side by side."
```

This communicates the product's purpose to first-time visitors before they interact.

### No glowing hover states
The Compare button previously had `shadow-[0_0_15px_rgba(255,211,105,0.4)]`. This has been removed. Good. Do not add glow effects anywhere else. Hover states should be subtle background shifts — `hover:bg-[#f5c842]` for the button, `hover:bg-white/10` for ghost elements. Nothing more.

### Every interactive element needs a visible hover state
Every button, every model toggle, every history entry, every copy button. If clicking it does something, it must look interactive before the click.

---

## 6. The Streaming Experience Specifically

This is your demo moment. It must be flawless.

### Chunks must appear character by character — not all at once
The SSE streaming setup in `route.ts` is correct. Make sure `ModelCard` renders incrementally as `response.text` grows. If text appears all at once after a delay, the streaming is not wired through properly.

### Latency and token counts must appear after the response completes
Do not show `0 tokens` during streaming. The token badge should only appear once `data.type === "done"` has been received and `data.tokens` is populated. Your current `done` handler does this correctly — do not regress it.

### The loading spinner must stop exactly when streaming ends
`isLoading` in `page.tsx` goes false in the `finally` block. Make sure `ModelCard` uses this correctly and does not show a spinner after content has arrived.

### Never show a broken card
If a model errors mid-stream, the card must transition cleanly from loading to error state. No half-rendered markdown. No stuck spinners.

---

## 7. The Prompt History Feature

### History must persist across page refreshes
Right now history lives in React state and resets on refresh. Use `localStorage` to persist it. The key should be `parallelai-history`. Limit stored entries to the last 20 to avoid hitting storage limits.

### Each history entry must be self-contained
A `HistoryEntry` must store: the prompt, all model responses (including errors), the selected models, and the timestamp. When a user clicks a history entry, the entire comparison must be restored exactly — including which models were selected.

### History entries need a clear delete option
Each entry in the sidebar should have an individual delete button, not just a global "Clear All". Users will want to remove specific entries.

---

## 8. The Export Feature

### PNG export must capture the full grid
`html2canvas` is capturing `#comparison-results`. Make sure this div always contains all visible model cards before the export is triggered. Test with 3 cards, 2 cards, and 1 card.

### Exported PNG must be readable
The export button should only appear after responses have loaded. Never during streaming. The exported image should have a dark background that matches the app — `backgroundColor: "#222831"` in the `html2canvas` config, not `null`.

### Filename must be meaningful
```
❌ parallelai-comparison-1718293847293.png
✅ parallelai-2025-06-13.png
```

Use a readable date format in the filename.

---

## 9. Git Hygiene

This is visible to every recruiter who clicks your GitHub.

### Commit messages tell a story

```
❌ "fix stuff"
❌ "wip"
❌ "changes"
❌ feat: add SSE streaming for real-time model responses
❌ fix: restore token count from done event in stream handler
❌ refactor: extract OpenRouter streaming logic into standalone function

✅ Removed light theme and clean up globals.css
✅ Applied Set 3 color palette across all components
```

Use conventional commits format: `feat:`, `fix:`, `refactor:`, `style:`, `chore:`, `docs:`.

### The README is a product page
Your `README.md` must include:
- A screenshot or GIF of the tool in action
- One paragraph explaining what ParallelAI does and why it is useful
- A "Try it live" link (your Vercel URL)
- A "Run locally" section with copy-pasteable commands
- A brief tech stack section (Next.js 14, TypeScript, Tailwind v4, OpenRouter, Vercel)

A recruiter should understand what ParallelAI is and want to try it within 30 seconds of landing on the repo.

### `.env.local` must never be committed
It is already in `.gitignore` via `.env*`. Add a `.env.example` file with key names but no values:

```env
OPENROUTER_API_KEY=
```

This tells other developers exactly what they need without exposing your credentials.

---

## 10. Pre-Launch Checklist

Before you share the link, verify every item:

- [ ] Tested on Chrome, Firefox, and Edge
- [ ] All three model states work: loading, success, error
- [ ] Token count appears after response completes (not zero)
- [ ] Latency badge appears and shows a real time
- [ ] Prompt history persists across page refresh
- [ ] Export PNG produces a readable, correctly sized image
- [ ] No console errors or warnings in production build (`npm run build`)
- [ ] Empty state visible before first prompt is submitted
- [ ] Model toggle deselect works — disabled Compare button when none selected
- [ ] README has a live demo link and a screenshot
- [ ] `.env.local` is not in the GitHub repo
- [ ] `.env.example` is in the GitHub repo
- [ ] Commit history tells a clean story — no "wip" or "fix stuff" messages

---

## The Single Most Important Rule

**The unhappy path is the product.**

What happens when OpenRouter is down? What happens when the API key is invalid? What happens when the user submits an empty prompt? What happens when one model errors and the other two succeed?

Every feature that only works on the happy path is half a feature. A comparison tool where two cards show responses and one shows a clear, actionable error message is more impressive than one where all three either work perfectly or break silently.

Error handling is not defensive programming. For a portfolio project, it is the proof that you think like a senior engineer.
