import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("🛑 Error capturado por ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main style={{ padding: "2rem", textAlign: "center" }}>
          <h1>😢 Algo salió mal</h1>
          <p>Intenta recargar la página o volver más tarde.</p>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
