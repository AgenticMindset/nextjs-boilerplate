"use client";

import { useChat } from "ai/react";
import { useRef, useEffect } from "react";

export default function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: "/api/agent",
      maxSteps: 5,
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderMessageContent = (message: (typeof messages)[0]) => {
    if (!message.toolInvocations || message.toolInvocations.length === 0) {
      return <div style={styles.messageContent}>{message.content}</div>;
    }

    return (
      <div>
        {message.content && (
          <div style={styles.messageContent}>{message.content}</div>
        )}
        {message.toolInvocations.map((toolInvocation, index) => {
          if (toolInvocation.state !== "result") {
            return (
              <div key={index} style={styles.toolLoading}>
                Running {formatToolName(toolInvocation.toolName)}...
              </div>
            );
          }

          const result = toolInvocation.result;

          if (toolInvocation.toolName === "recommend_stack") {
            return renderStackRecommendation(result, index);
          }
          if (toolInvocation.toolName === "estimate_costs") {
            return renderCostEstimate(result, index);
          }
          if (toolInvocation.toolName === "generate_diagram") {
            return renderDiagramCode(result, index);
          }

          return (
            <div key={index} style={styles.toolResult}>
              <pre style={styles.codeBlock}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          );
        })}
      </div>
    );
  };

  const renderStackRecommendation = (result: any, key: number) => {
    const stack = result.stack;
    if (!stack) return null;

    return (
      <div key={key} style={styles.stackCard}>
        <div style={styles.stackHeader}>Recommended Stack</div>
        {Object.entries(stack).map(([layer, value]: [string, any]) => {
          if (layer === "additional_tools") {
            if (!value || (value as string[]).length === 0) return null;
            return (
              <div key={layer} style={styles.stackLayer}>
                <div style={styles.layerName}>Additional Tools</div>
                {(value as string[]).map((tool: string, i: number) => (
                  <div key={i} style={styles.additionalTool}>
                    {tool}
                  </div>
                ))}
              </div>
            );
          }
          if (!value || !value.tool) return null;
          return (
            <div key={layer} style={styles.stackLayer}>
              <div style={styles.layerName}>
                {layer.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </div>
              <div style={styles.toolName}>{value.tool}</div>
              <div style={styles.toolReason}>{value.reason}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCostEstimate = (result: any, key: number) => {
    if (!result.breakdown) return null;

    return (
      <div key={key} style={styles.costCard}>
        <div style={styles.stackHeader}>Monthly Cost Estimate</div>
        {result.breakdown.map(
          (
            item: { item: string; monthlyCost: string; notes: string },
            i: number
          ) => (
            <div key={i} style={styles.costRow}>
              <div style={styles.costItem}>{item.item}</div>
              <div style={styles.costAmount}>{item.monthlyCost}</div>
              <div style={styles.costNotes}>{item.notes}</div>
            </div>
          )
        )}
        <div style={styles.costTotal}>
          Estimated Total: {result.estimated_total}
        </div>
      </div>
    );
  };

  const renderDiagramCode = (result: any, key: number) => {
    if (!result.mermaid_code) return null;

    return (
      <div key={key} style={styles.diagramCard}>
        <div style={styles.stackHeader}>Architecture Diagram</div>
        <div style={styles.diagramNote}>
          Mermaid diagram code (visual rendering coming in next update):
        </div>
        <pre style={styles.codeBlock}>{result.mermaid_code}</pre>
      </div>
    );
  };

  const formatToolName = (name: string) => {
    return name
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Open Source Tech Stack Advisor</h1>
        <p style={styles.subtitle}>
          Describe your product idea and I will recommend the best open-source
          tools to build it.
        </p>
      </div>

      <div style={styles.messagesArea}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>
              Tell me about the product you want to build.
            </p>
            <p style={styles.emptyHint}>
              For example: &quot;I want to build a marketplace for vintage
              watches&quot; or &quot;I need a real-time dashboard for IoT sensor
              data&quot;
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              ...styles.messageBubble,
              ...(message.role === "user"
                ? styles.userBubble
                : styles.assistantBubble),
            }}
          >
            <div style={styles.roleLabel}>
              {message.role === "user" ? "You" : "Advisor"}
            </div>
            {renderMessageContent(message)}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div style={{ ...styles.messageBubble, ...styles.assistantBubble }}>
            <div style={styles.roleLabel}>Advisor</div>
            <div style={styles.thinkingDots}>Thinking...</div>
          </div>
        )}

        {error && (
          <div style={styles.errorBox}>
            Something went wrong. Please try again.
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={styles.inputArea}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Describe your product idea..."
          style={styles.input}
          disabled={isLoading}
        />
        <button type="submit" style={styles.sendButton} disabled={isLoading}>
          {isLoading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "100%",
    maxWidth: "800px",
    height: "85vh",
    display: "flex",
    flexDirection: "column",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "rgba(18, 18, 18, 0.7)",
    backdropFilter: "blur(20px)",
    overflow: "hidden",
  },
  header: {
    padding: "24px 28px 16px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
  },
  title: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#e0e0e0",
    margin: 0,
    fontFamily: "Inter, sans-serif",
  },
  subtitle: {
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.45)",
    margin: "6px 0 0",
    fontFamily: "Inter, sans-serif",
  },
  messagesArea: {
    flex: 1,
    overflowY: "auto" as const,
    padding: "20px 28px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center" as const,
    padding: "40px 20px",
  },
  emptyText: {
    fontSize: "15px",
    color: "rgba(255, 255, 255, 0.5)",
    margin: 0,
    fontFamily: "Inter, sans-serif",
  },
  emptyHint: {
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.3)",
    margin: "12px 0 0",
    fontFamily: "Inter, sans-serif",
    fontStyle: "italic",
  },
  messageBubble: {
    padding: "14px 18px",
    borderRadius: "12px",
    maxWidth: "85%",
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    lineHeight: "1.6",
  },
  userBubble: {
    alignSelf: "flex-end",
    background: "rgba(184, 156, 90, 0.15)",
    border: "1px solid rgba(184, 156, 90, 0.25)",
    color: "#e0e0e0",
  },
  assistantBubble: {
    alignSelf: "flex-start",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    color: "#d0d0d0",
    maxWidth: "95%",
  },
  roleLabel: {
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    color: "rgba(184, 156, 90, 0.7)",
    marginBottom: "6px",
  },
  messageContent: {
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
  },
  thinkingDots: {
    color: "rgba(255, 255, 255, 0.3)",
    fontStyle: "italic",
  },
  errorBox: {
    padding: "12px 16px",
    borderRadius: "8px",
    background: "rgba(220, 60, 60, 0.15)",
    border: "1px solid rgba(220, 60, 60, 0.3)",
    color: "#e0a0a0",
    fontSize: "13px",
    fontFamily: "Inter, sans-serif",
  },
  inputArea: {
    display: "flex",
    gap: "10px",
    padding: "16px 28px 20px",
    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
    background: "rgba(12, 12, 12, 0.5)",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.04)",
    color: "#e0e0e0",
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
    outline: "none",
  },
  sendButton: {
    padding: "12px 24px",
    borderRadius: "10px",
    border: "1px solid rgba(184, 156, 90, 0.4)",
    background: "rgba(184, 156, 90, 0.15)",
    color: "#b89c5a",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
  },
  toolLoading: {
    padding: "8px 12px",
    margin: "8px 0",
    borderRadius: "8px",
    background: "rgba(184, 156, 90, 0.08)",
    border: "1px solid rgba(184, 156, 90, 0.15)",
    color: "rgba(184, 156, 90, 0.6)",
    fontSize: "12px",
    fontStyle: "italic",
  },
  toolResult: {
    margin: "8px 0",
  },
  stackCard: {
    margin: "12px 0",
    padding: "16px",
    borderRadius: "12px",
    background: "rgba(26, 58, 42, 0.2)",
    border: "1px solid rgba(45, 90, 63, 0.3)",
  },
  stackHeader: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#b89c5a",
    marginBottom: "12px",
  },
  stackLayer: {
    padding: "10px 0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  layerName: {
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    color: "rgba(255, 255, 255, 0.4)",
    marginBottom: "4px",
  },
  toolName: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#e0e0e0",
    marginBottom: "4px",
  },
  toolReason: {
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.5)",
    lineHeight: "1.5",
  },
  additionalTool: {
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.5)",
    padding: "4px 0",
    lineHeight: "1.5",
  },
  costCard: {
    margin: "12px 0",
    padding: "16px",
    borderRadius: "12px",
    background: "rgba(26, 26, 58, 0.2)",
    border: "1px solid rgba(45, 45, 90, 0.3)",
  },
  costRow: {
    padding: "8px 0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  costItem: {
    fontSize: "13px",
    color: "#e0e0e0",
    fontWeight: 500,
  },
  costAmount: {
    fontSize: "14px",
    color: "#b89c5a",
    fontWeight: 600,
    margin: "2px 0",
  },
  costNotes: {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.4)",
  },
  costTotal: {
    marginTop: "12px",
    paddingTop: "12px",
    borderTop: "1px solid rgba(184, 156, 90, 0.2)",
    fontSize: "15px",
    fontWeight: 600,
    color: "#b89c5a",
  },
  diagramCard: {
    margin: "12px 0",
    padding: "16px",
    borderRadius: "12px",
    background: "rgba(42, 26, 42, 0.2)",
    border: "1px solid rgba(74, 45, 74, 0.3)",
  },
  diagramNote: {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.4)",
    marginBottom: "8px",
    fontStyle: "italic",
  },
  codeBlock: {
    padding: "12px",
    borderRadius: "8px",
    background: "rgba(0, 0, 0, 0.3)",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "12px",
    fontFamily: "monospace",
    overflow: "auto" as const,
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
    margin: 0,
  },
};