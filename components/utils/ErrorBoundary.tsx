"use client";

import { Component, type ReactNode } from "react";

type ErrorBoundaryProps = {
  fallback: ReactNode;
  children: ReactNode;
  /** Changing this value clears a caught error so children can try again. */
  resetKey?: unknown;
};

type ErrorBoundaryState = {
  hasError: boolean;
  resetKey: unknown;
};

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, resetKey: this.props.resetKey };

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  static getDerivedStateFromProps(
    props: ErrorBoundaryProps,
    state: ErrorBoundaryState,
  ): Partial<ErrorBoundaryState> | null {
    return props.resetKey === state.resetKey
      ? null
      : { hasError: false, resetKey: props.resetKey };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
