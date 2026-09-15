import { useState, useCallback } from "react";
import { apiRequest } from "@/lib/api-client";

export type StreamStage = "researcher" | "verifier" | "drafter" | "streaming" | "complete" | "error";

interface StreamState {
  stage: StreamStage;
  message?: string;
  content: string;
  isStreaming: boolean;
  draftId?: number;
  error?: string;
}

interface DraftGenerationOptions {
  sessionId: number;
  query: string;
  draftType: string;
  language: string;
}

export function useDraftStream() {
  const [state, setState] = useState<StreamState>({
    stage: "researcher",
    content: "",
    isStreaming: false,
  });

  const generateDraft = useCallback(async (options: DraftGenerationOptions) => {
    setState({ stage: "researcher", content: "", isStreaming: true, message: "Initiating research..." });

    try {
      const response = await apiRequest("/legal/draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        throw new Error("Failed to start generation");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.substring(6));
                
                setState((prev) => {
                  const newState = { ...prev };
                  
                  if (data.stage) newState.stage = data.stage;
                  if (data.message) newState.message = data.message;
                  if (data.content) {
                    if (data.stage === "streaming") {
                        newState.content += data.content;
                    } else if (data.content && data.stage === "complete") {
                         newState.content = data.content;
                    }
                  }
                  if (data.draftId) newState.draftId = data.draftId;

                  return newState;
                });

                if (data.done) {
                  setState((prev) => ({
                    ...prev,
                    isStreaming: false,
                    stage: data.stage === "error" ? "error" : "complete",
                    error: typeof data.error === "string" ? data.error : prev.error,
                  }));
                  return data.draftId;
                }
              } catch (e) {
                console.error("Error parsing SSE data", e, line);
              }
            }
          }
        }
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      setState((prev) => ({
        ...prev,
        isStreaming: false,
        stage: "error",
        error: message,
      }));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ stage: "researcher", content: "", isStreaming: false });
  }, []);

  return { state, generateDraft, reset };
}
