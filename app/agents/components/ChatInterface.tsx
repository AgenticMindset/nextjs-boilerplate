"use client";

import { useChat } from "ai/react";
import { useRef, useEffect } from "react";

export default function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: "/api/agent",
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Open Source Tech Stack Advisor</h1>
        <p style={styles.subtitle}>
          Describe your product idea and I will recommend the best open-source
          tools to build it.
        </p>
      </div>

      {/* Messages area */}
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
            <div style={styles.messageContent}>{message.content}</div>
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

      {/* Input area */}
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
};