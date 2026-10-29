"use client";

import { useEffect, useRef, useState } from "react";

interface DiagramRendererProps {
  code: string;
}

// Mermaid pulls in Langium and the vscode language-server protocol - roughly
// 600KB of the agents page's JS budget. It is only ever needed once the agent
// has actually returned a diagram, so the module is imported on demand here
// rather than at the top of the file.
let mermaidPromise: Promise<typeof import("mermaid").default> | null = null;

function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "dark",
        themeVariables: {
          primaryColor: "#1a3a2a",
          primaryBorderColor: "#2d5a3f",
          primaryTextColor: "#e0e0e0",
          lineColor: "#b89c5a",
          secondaryColor: "#1a2a3a",
          tertiaryColor: "#2a1a2a",
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
        },
      });
      return mermaid;
    });
  }
  return mermaidPromise;
}

export default function DiagramRenderer({ code }: DiagramRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Tracked as "which source failed" rather than a boolean, so a new diagram
  // clears the previous failure without a setState in the effect body.
  const [failedCode, setFailedCode] = useState<string | null>(null);
  const error = failedCode === code ? "Could not render diagram" : null;

  useEffect(() => {
    let cancelled = false;

    const renderDiagram = async () => {
      try {
        const mermaid = await loadMermaid();
        if (cancelled) return;
        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, code);
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = svg;

        const svgElement = containerRef.current.querySelector("svg");
        if (svgElement) {
          svgElement.style.maxWidth = "100%";
          svgElement.style.height = "auto";
        }
      } catch (err) {
        console.error("Mermaid render error:", err);
        if (!cancelled) setFailedCode(code);
      }
    };

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [code]);

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorText}>{error}</div>
        <pre style={styles.fallbackCode}>{code}</pre>
      </div>
    );
  }

  return <div ref={containerRef} style={styles.diagramContainer} />;
}

const styles: { [key: string]: React.CSSProperties } = {
  diagramContainer: {
    padding: "16px",
    borderRadius: "8px",
    background: "rgba(0, 0, 0, 0.3)",
    overflow: "auto",
    display: "flex",
    justifyContent: "center",
  },
  errorContainer: {
    padding: "12px",
  },
  errorText: {
    color: "rgba(220, 120, 120, 0.8)",
    fontSize: "12px",
    marginBottom: "8px",
  },
  fallbackCode: {
    padding: "12px",
    borderRadius: "8px",
    background: "rgba(0, 0, 0, 0.3)",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "12px",
    fontFamily: "monospace",
    overflow: "auto",
    whiteSpace: "pre-wrap" as const,
    margin: 0,
  },
};
