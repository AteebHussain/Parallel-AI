# ParallelAI

Compare AI models side by side. Type a prompt, pick your models, and see responses from multiple LLMs with latency and token tracking.

**[Try it live →](https://parallelai.vercel.app)**

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![OpenRouter](https://img.shields.io/badge/OpenRouter-Free%20Models-blue)

## Features

- **4 free AI models** — Gemma 3, Nemotron, Step Flash, Trinity Mini (via OpenRouter)
- **Side-by-side comparison** — See all responses in a responsive grid
- **Real-time streaming** — Watch responses appear word-by-word as they generate
- **Latency tracking** — See how fast each model responds
- **Token usage** — Track token consumption per response
- **Copy to clipboard** — One-click copy on any response
- **Prompt history** — Revisit past comparisons from the sidebar (persists in localStorage)
- **Export as PNG** — Download comparison results as an image
- **Dark theme** — Sleek dark UI built on Dark charcoal theme with amber accents

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | React framework with App Router |
| TypeScript | Type safety across the codebase |
| Tailwind CSS v4 | Utility-first styling |
| OpenRouter | Unified API for free AI models |
| Vercel | Hosting and deployment |

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/AteebHussain/ParallelAI.git
cd ParallelAI
npm install
```

### 2. Set up API Key

Get a free API key from [OpenRouter](https://openrouter.ai/keys).

```bash
cp .env.example .env.local
# Then paste your key in .env.local
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENROUTER_API_KEY` | Yes | Your OpenRouter API key |

## License

MIT
