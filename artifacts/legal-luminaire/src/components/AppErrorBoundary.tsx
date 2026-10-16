import React from "react";
import { AlertTriangle, RefreshCw, Home, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AppErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
  componentName?: string;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<AppErrorBoundaryState> {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ errorInfo });
    console.error(
      `[AppErrorBoundary]${this.props.componentName ? ` [${this.props.componentName}]` : ""} Uncaught error:`,
      error,
      errorInfo
    );
  }

  handleReload = (): void => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  handleHome = (): void => {
    if (typeof window !== "undefined") {
      window.location.hash = "";
      window.location.pathname = "/";
    }
  };

  override render(): React.ReactNode {
    if (this.state.hasError) {
      const title = this.props.fallbackTitle || "Something went wrong";
      const description =
        this.props.fallbackDescription ||
        "An unexpected error occurred in this section. You can try refreshing or navigate back to safety.";
      const componentName = this.props.componentName || "this component";

      return (
        <div className="flex items-center justify-center min-h-[400px] p-4 sm:p-6 w-full">
          <Card elevation="md" className="w-full max-w-xl mx-auto">
            <CardHeader className="text-center pb-3">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-tier-fatal-bg border border-tier-fatal-border">
                <AlertTriangle className="h-7 w-7 text-tier-fatal" aria-hidden="true" />
              </div>
              <CardTitle className="text-lg sm:text-xl">
                {title}
                <span className="hidden sm:inline opacity-70 font-normal text-base ml-2">
                  / कुछ गलत हो गया
                </span>
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {this.state.error && (
                <div className="rounded-lg border border-border bg-muted/40 p-3 sm:p-4 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Error Details / त्रुटि विवरण
                  </p>
                  <p className="text-xs sm:text-sm font-mono text-tier-fatal break-words">
                    {this.state.error.message || "Unknown error"}
                  </p>
                  {componentName && (
                    <p className="text-[10px] text-muted-foreground">
                      Component: <code>{componentName}</code>
                    </p>
                  )}
                  {this.state.errorInfo && (
                    <details className="text-[10px] text-muted-foreground">
                      <summary className="cursor-pointer hover:text-foreground">
                        Component stack (debug)
                      </summary>
                      <pre className="mt-2 whitespace-pre-wrap font-mono opacity-75 max-h-32 overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <Button variant="default" onClick={this.handleReload} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Reload Section
                  <span className="hidden sm:inline opacity-75">/ रिलोड</span>
                </Button>
                <Button variant="outline" onClick={this.handleHome} className="gap-2">
                  <Home className="h-4 w-4" />
                  Go Home
                  <span className="hidden sm:inline opacity-75">/ होम</span>
                </Button>
              </div>

              <p className="text-center text-[10px] sm:text-xs text-muted-foreground pt-2 border-t border-border">
                <FileText className="inline h-3 w-3 mr-1 align-middle" />
                If the problem persists, please note the error details and report them.
                <span className="hidden sm:inline"> / यदि समस्या बनी रहे तो त्रुटि विवरण नोट करें।</span>
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<AppErrorBoundaryProps, "children">
): React.FC<P> {
  const Wrapped: React.FC<P> = (props) => (
    <AppErrorBoundary {...options}>
      <Component {...props} />
    </AppErrorBoundary>
  );
  Wrapped.displayName = `withErrorBoundary(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
}
