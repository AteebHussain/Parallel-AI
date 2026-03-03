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
    color: "text-[#465C88]",
    bgColor: "bg-[#465C88]/10 border-[#465C88]/20",
  },
  {
    id: "nvidia/nemotron-nano-12b-v2-vl:free",
    name: "Nemotron Nano 12B",
    provider: "NVIDIA",
    color: "text-[#FF7A30]",
    bgColor: "bg-[#FF7A30]/10 border-[#FF7A30]/20",
  },
  {
    id: "stepfun/step-3.5-flash:free",
    name: "Step 3.5 Flash",
    provider: "StepFun",
    color: "text-[#465C88]",
    bgColor: "bg-[#465C88]/10 border-[#465C88]/20",
  },
  {
    id: "arcee-ai/trinity-mini:free",
    name: "Trinity Mini",
    provider: "Arcee AI",
    color: "text-[#FF7A30]",
    bgColor: "bg-[#FF7A30]/10 border-[#FF7A30]/20",
  },
];
