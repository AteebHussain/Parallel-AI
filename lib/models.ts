export type Model = {
  id: string;
  name: string;
  provider: string;
  color: string;
  bgColor: string;
};

export const MODELS: Model[] = [
  {
    id: "google/gemma-3-12b-it:free",
    name: "Gemma 3 12B",
    provider: "Google",
    color: "text-sky-400",
    bgColor: "bg-sky-500/10 border-sky-500/30",
  },
  {
    id: "nvidia/nemotron-3-super-120b-a12b:free",
    name: "Nemotron 3 Super",
    provider: "NVIDIA",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10 border-emerald-500/30",
  },
  {
    id: "minimax/minimax-m2.5:free",
    name: "MiniMax M2.5",
    provider: "MiniMax",
    color: "text-violet-400",
    bgColor: "bg-violet-500/10 border-violet-500/30",
  },
  {
    id: "openai/gpt-oss-120b:free",
    name: "GPT-OSS 120B",
    provider: "OpenAI",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10 border-pink-500/30",
  },
];
