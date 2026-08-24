"use client";
import { useChat } from "ai/react";
import { useRef, useEffect, useState } from "react";
import DiagramRenderer from "./DiagramRenderer";

const QUICK_REPLIES = [
  "I want to build a marketplace for AI Agents",
  "I need a real-time dashboard for IoT sensor data",
  "I want to build a Web3 protocol for decentralized content applications",
];

const CLARIFY_OPTIONS = {
  scale: {
    label: "Expected user scale",
    options: [
      "Small (under 1K users)",
      "Medium (1K–100K users)",
      "Large (100K+ users)",
    ],
  },
  skill: {
    label: "Team skill level",
    options: [
      "Beginner (new to development)",
      "Intermediate (comfortable with common frameworks)",
      "Advanced (experienced engineers)",
    ],
  },
  constraints: {
    label: "Technical constraints",
    options: [
      "No specific constraints",
      "Web-focused (JavaScript / TypeScript)",
      "Python ecosystem preferred",
    ],
  },
};

type ClarifyKey = keyof typeof CLARIFY_OPTIONS;

export default function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages, setInput } =
    useChat({
      api: "/api/agent",
      maxSteps: 5,
    });

  const messagesAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [clarifySelections, setClarifySelections] = useState<Record<ClarifyKey, string | null>>({
    scale: null,
    skill: null,
    constraints: null,
  });
  const [clarifyCustom, setClarifyCustom] = useState<Record<ClarifyKey, boolean>>({
    scale: false,
    skill: false,
    constraints: false,
  });
  const [clarifyCustomText, setClarifyCustomText] = useState<Record<ClarifyKey, string>>({
    scale: "",
    skill: "",
    constraints: "",
  });

  useEffect(() => {
    if (messages.length > 0 && messagesAreaRef.current) {
      messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const lastMessage = messages[messages.length - 1];
  const showClarifyButtons =
    userMessageCount === 1 &&
    lastMessage?.role === "assistant" &&
    (!lastMessage.toolInvocations || lastMessage.toolInvocations.length === 0) &&
    !isLoading;

  const clarifyReady =
    clarifySelections.scale !== null &&
    clarifySelections.skill !== null &&
    clarifySelections.constraints !== null;

  const handleQuickReply = (text: string) => {
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>;
    setInput(text);
    setTimeout(() => {
      handleSubmit(syntheticEvent);
    }, 0);
  };

  const handleClarifySelect = (group: ClarifyKey, value: string) => {
    setClarifySelections((prev) => ({ ...prev, [group]: value }));
    setClarifyCustom((prev) => ({ ...prev, [group]: false }));
  };

  const handleClarifyCustomToggle = (group: ClarifyKey) => {
    setClarifyCustom((prev) => ({ ...prev, [group]: true }));
    setClarifySelections((prev) => ({ ...prev, [group]: null }));
  };

  const handleClarifyCustomConfirm = (group: ClarifyKey) => {
    const text = clarifyCustomText[group].trim();
    if (text) {
      setClarifySelections((prev) => ({ ...prev, [group]: text }));
    }
  };

  const handleClarifySend = () => {
    if (!clarifyReady) return;
    const combined = `Expected scale: ${clarifySelections.scale}. Team skill level: ${clarifySelections.skill}. Technical constraints: ${clarifySelections.constraints}.`;
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>;
    setInput(combined);
    setTimeout(() => {
      handleSubmit(syntheticEvent);
      setClarifySelections({ scale: null, skill: null, constraints: null });
      setClarifyCustom({ scale: false, skill: false, constraints: false });
      setClarifyCustomText({ scale: "", skill: "", constraints: "" });
    }, 0);
  };

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
          if (toolInvocation.toolName === "research_current_landscape") {
            // Internal grounding context for the model only - not
            // meant to be shown to the user as a visible message.
            return null;
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
        <DiagramRenderer code={result.mermaid_code} />
      </div>
    );
  };

  const formatToolName = (name: string) => {
    return name
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const renderClarifyGroup = (group: ClarifyKey) => {
    const config = CLARIFY_OPTIONS[group];
    const isCustom = clarifyCustom[group];
    const selected = clarifySelections[group];

    return (
      <div key={group} style={styles.clarifyGroup}>
        <div style={styles.clarifyLabel}>{config.label}</div>
        {config.options.map((opt, i) => {
          const isSelected = selected === opt;
          return (
            <button
              key={i}
              onClick={() => handleClarifySelect(group, opt)}
              style={{
                ...styles.quickReplyButton,
                ...(isSelected ? styles.quickReplySelected : {}),
              }}
            >
              {opt}
            </button>
          );
        })}
        {isCustom ? (
          <div style={styles.clarifyCustomRow}>
            <input
              type="text"
              value={clarifyCustomText[group]}
              onChange={(e) =>
                setClarifyCustomText((prev) => ({ ...prev, [group]: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") handleClarifyCustomConfirm(group);
              }}
              placeholder="Type your answer..."
              style={styles.clarifyCustomInput}
              autoFocus
            />
            <button
              onClick={() => handleClarifyCustomConfirm(group)}
              style={styles.clarifyCustomConfirm}
              disabled={!clarifyCustomText[group].trim()}
            >
              OK
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleClarifyCustomToggle(group)}
            style={{
              ...styles.quickReplyButton,
              ...styles.quickReplyCustom,
            }}
          >
            Something else...
          </button>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {messages.length > 0 && (
        <div style={styles.header}>
          <div style={styles.headerRow}>
            <div />
            <button
              onClick={() => {
                setMessages([]);
                setClarifySelections({ scale: null, skill: null, constraints: null });
                setClarifyCustom({ scale: false, skill: false, constraints: false });
                setClarifyCustomText({ scale: "", skill: "", constraints: "" });
              }}
              style={styles.newChatButton}
            >
              New Chat
            </button>
          </div>
        </div>
      )}
      <div style={styles.messagesArea} ref={messagesAreaRef}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>
              Describe your product idea and I will recommend the best
              open-source tools to build it.
            </p>
            <div style={styles.quickReplies}>
              {QUICK_REPLIES.map((text, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickReply(text)}
                  style={styles.quickReplyButton}
                  disabled={isLoading}
                >
                  {text}
                </button>
              ))}
              <button
                onClick={() => textareaRef.current?.focus()}
                style={{
                  ...styles.quickReplyButton,
                  ...styles.quickReplyCustom,
                }}
                disabled={isLoading}
              >
                Something else...
              </button>
            </div>
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
        {showClarifyButtons && (
          <div style={styles.clarifyContainer}>
            {(Object.keys(CLARIFY_OPTIONS) as ClarifyKey[]).map(renderClarifyGroup)}
            <button
              onClick={handleClarifySend}
              disabled={!clarifyReady}
              style={{
                ...styles.clarifySendButton,
                ...(!clarifyReady ? styles.clarifySendDisabled : {}),
              }}
            >
              Add Answers
            </button>
          </div>
        )}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div style={{ ...styles.messageBubble, ...styles.assistantBubble }}>
            <div style={styles.roleLabel}>Advisor</div>
            <div style={styles.thinkingDots}>Thinking...</div>
          </div>
        )}
        {error && (
          <div style={styles.errorBox}>
            This is a demo with limited capacity. You have used your available messages for this hour. Please try again later.
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} style={styles.inputArea}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (input.trim() && !isLoading) {
                handleSubmit(e as any);
              }
            }
          }}
          placeholder="Type here..."
          style={styles.input}
          disabled={isLoading}
          rows={3}
          autoFocus={false}
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
    maxWidth: "100%",
    height: "60vh",
    display: "flex",
    flexDirection: "column",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    background: "rgba(30, 30, 30, 0.75)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    overflow: "hidden",
  },
  header: {
    padding: "24px 28px 16px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  newChatButton: {
    padding: "6px 14px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    background: "rgba(255, 255, 255, 0.04)",
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: "12px",
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    flexShrink: 0,
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
    padding: "20px 20px",
  },
  emptyText: {
    fontSize: "15px",
    color: "rgba(255, 255, 255, 0.5)",
    margin: 0,
    fontFamily: "Inter, sans-serif",
  },
  quickReplies: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "20px",
    width: "100%",
    maxWidth: "480px",
  },
  quickReplyButton: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    background: "rgba(255, 255, 255, 0.06)",
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: "13px",
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
    textAlign: "left" as const,
    transition: "background 0.15s, border-color 0.15s",
    lineHeight: "1.4",
  },
  quickReplySelected: {
    border: "1px solid rgba(255, 255, 255, 0.6)",
    background: "rgba(255, 255, 255, 0.18)",
    color: "var(--color-accent)",
  },
  quickReplyCustom: {
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.03)",
    fontStyle: "italic",
    color: "rgba(255, 255, 255, 0.4)",
  },
  clarifyContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "16px",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  clarifyGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  clarifyLabel: {
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: "2px",
  },
  clarifyCustomRow: {
    display: "flex",
    gap: "8px",
  },
  clarifyCustomInput: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    background: "rgba(255, 255, 255, 0.04)",
    color: "#e0e0e0",
    fontSize: "13px",
    fontFamily: "Inter, sans-serif",
    outline: "none",
  },
  clarifyCustomConfirm: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    background: "rgba(255, 255, 255, 0.1)",
    color: "var(--color-accent)",
    fontSize: "13px",
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
  },
  clarifySendButton: {
    padding: "12px 24px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    background: "rgba(255, 255, 255, 0.2)",
    color: "var(--color-accent)",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
    marginTop: "4px",
    alignSelf: "flex-end",
  },
  clarifySendDisabled: {
    opacity: 0.35,
    cursor: "default",
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
    background: "rgba(255, 255, 255, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.25)",
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
    color: "rgba(255, 255, 255, 0.7)",
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
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(12, 12, 12, 0.5)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
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
    resize: "none" as const,
    maxHeight: "120px",
    overflowY: "auto" as const,
    lineHeight: "1.5",
  },
  sendButton: {
    padding: "12px 24px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    background: "rgba(255, 255, 255, 0.15)",
    color: "var(--color-accent)",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
  },
  toolLoading: {
    padding: "8px 12px",
    margin: "8px 0",
    borderRadius: "8px",
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    color: "rgba(255, 255, 255, 0.6)",
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
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  },
  stackHeader: {
    fontSize: "15px",
    fontWeight: 600,
    color: "var(--color-accent)",
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
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
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
    color: "var(--color-accent)",
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
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
    fontSize: "15px",
    fontWeight: 600,
    color: "var(--color-accent)",
  },
  diagramCard: {
    margin: "12px 0",
    padding: "16px",
    borderRadius: "12px",
    background: "rgba(42, 26, 42, 0.2)",
    border: "1px solid rgba(74, 45, 74, 0.3)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
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
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "12px",
    fontFamily: "monospace",
    overflow: "auto" as const,
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
    margin: 0,
  },
};