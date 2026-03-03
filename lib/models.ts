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
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10 border-emerald-500/30",
  },
  {
    id: "nvidia/nemotron-nano-12b-v2-vl:free",
    name: "Nemotron Nano 12B",
    provider: "NVIDIA",
    color: "text-sky-400",
    bgColor: "bg-sky-500/10 border-sky-500/30",
  },
  {
    id: "stepfun/step-3.5-flash:free",
    name: "Step 3.5 Flash",
    provider: "StepFun",
    color: "text-violet-400",
    bgColor: "bg-violet-500/10 border-violet-500/30",
  },
  {
    id: "arcee-ai/trinity-mini:free",
    name: "Trinity Mini",
    provider: "Arcee AI",
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/30",
  },
];
