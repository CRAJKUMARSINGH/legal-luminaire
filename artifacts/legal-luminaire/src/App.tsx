import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CaseProvider } from "@/context/CaseContext";
import { AccuracyProvider } from "@/context/AccuracyContext";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { Router } from "./routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount: number, error: unknown): boolean => {
        if (failureCount >= 2) return false;
        const msg = error instanceof Error ? error.message : String(error);
        if (/4\d\d/.test(msg)) return false;
        return true;
      },
      staleTime: 10_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <AppErrorBoundary
      componentName="AppRoot"
      fallbackTitle="Application Error"
      fallbackDescription="A top-level error occurred. Please refresh the application or navigate to the home page."
    >
      <QueryClientProvider client={queryClient}>
        <CaseProvider>
          <AccuracyProvider>
            <TooltipProvider>
              <Router />
              <Toaster />
            </TooltipProvider>
          </AccuracyProvider>
        </CaseProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

