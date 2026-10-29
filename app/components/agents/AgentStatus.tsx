interface AgentErrorProps {
  message: string;
}

export function AgentError({ message }: AgentErrorProps) {
  return (
    <div className="agent-error" role="alert">
      {message}
    </div>
  );
}

interface AgentLoadingProps {
  message: string;
  /** Optional second line, e.g. how long the run usually takes. */
  hint?: string;
}

export function AgentLoading({ message, hint }: AgentLoadingProps) {
  return (
    <div className="agent-loading" role="status" aria-live="polite">
      <div className="agent-loading__dot" />
      <div className="agent-loading__text">{message}</div>
      {hint && <div className="agent-loading__hint">{hint}</div>}
    </div>
  );
}
