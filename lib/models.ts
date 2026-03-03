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
    color: "text-foreground",
    bgColor: "bg-card/50 border-border",
  },
  {
    id: "nvidia/nemotron-nano-12b-v2-vl:free",
    name: "Nemotron Nano 12B",
    provider: "NVIDIA",
    color: "text-primary",
    bgColor: "bg-primary/5 border-primary/20",
  },
  {
    id: "stepfun/step-3.5-flash:free",
    name: "Step 3.5 Flash",
    provider: "StepFun",
    color: "text-foreground",
    bgColor: "bg-card/50 border-border",
  },
  {
    id: "arcee-ai/trinity-mini:free",
    name: "Trinity Mini",
    provider: "Arcee AI",
    color: "text-primary",
    bgColor: "bg-primary/5 border-primary/20",
  },
];
