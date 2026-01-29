import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Global error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6">
          <div className="flex max-w-md flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <svg
                className="size-10 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-foreground">
              Etwas ist schiefgelaufen
            </h1>
            <p className="text-sm text-muted-foreground">
              Ein unerwarteter Fehler ist aufgetreten. Bitte lade die Seite neu
              oder versuche es später erneut.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <ScrollArea className="max-h-32 w-full rounded-lg border border-border bg-muted">
                <pre className="p-3 text-left text-xs text-muted-foreground">
                  {this.state.error.message}
                </pre>
              </ScrollArea>
            )}
            <div className="flex flex-wrap gap-2">
              <Button onClick={this.handleReset} variant="outline">
                Erneut versuchen
              </Button>
              <Button onClick={this.handleReload}>Seite neu laden</Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
