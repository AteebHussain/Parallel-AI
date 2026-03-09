"use client";

import { MODELS } from "@/lib/models";
import ModelCard from "./ModelCard";
import type { ResponseData } from "@/types";

type Props = {
  responses: Record<string, ResponseData>;
  isLoading: boolean;
  selectedModels: string[];
};

export default function ComparisonGrid({
  responses,
  isLoading,
  selectedModels,
}: Props) {
  const visibleModels = MODELS.filter((m) => selectedModels.includes(m.id));

  if (visibleModels.length === 0) return null;

  return (
    <div
      className={`grid gap-4 ${
        visibleModels.length === 1
          ? "grid-cols-1"
          : visibleModels.length === 2
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
      }`}
    >
      {visibleModels.map((model) => (
        <ModelCard
          key={model.id}
          model={model}
          response={responses[model.id] || null}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
