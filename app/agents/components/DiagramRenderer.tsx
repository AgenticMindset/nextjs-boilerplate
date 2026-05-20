"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
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

interface DiagramRendererProps {
  code: string;
}

export default function DiagramRenderer({ code }: DiagramRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (!containerRef.current || rendered) return;

    const renderDiagram = async () => {
      try {
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, code);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          setRendered(true);

          const svgElement = containerRef.current.querySelector("svg");
          if (svgElement) {
            svgElement.style.maxWidth = "100%";
            svgElement.style.height = "auto";
          }
        }
      } catch (err) {
        console.error("Mermaid render error:", err);
        setError("Could not render diagram");
      }
    };

    renderDiagram();
  }, [code, rendered]);

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