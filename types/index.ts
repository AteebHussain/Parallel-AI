export type ResponseData = {
  text?: string;
  error?: string;
  latency?: number;
  tokens?: number;
};

export type HistoryEntry = {
  id: string;
  prompt: string;
  responses: Record<string, ResponseData>;
  models: string[];
  timestamp: Date;
};

export type SSEEvent =
  | { type: "chunk"; modelId: string; text: string; tokens?: number }
  | { type: "done"; modelId: string; tokens: number }
  | { type: "error"; modelId: string; error: string }
  | { type: "complete" };

export type OpenRouterChunk = {
  choices?: { delta?: { content?: string } }[];
  usage?: { total_tokens?: number };
};
