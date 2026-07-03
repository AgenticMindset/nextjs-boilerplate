"use client";

interface SurvivalConditionsProps {
  survivesIf: string[];
  breaksWhen: string[];
}

export default function SurvivalConditions({
  survivesIf,
  breaksWhen,
}: SurvivalConditionsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
      }}
    >
      <div
        style={{
          padding: 18,
          borderRadius: 12,
          background: "rgba(76,175,80,0.06)",
          border: "1px solid rgba(76,175,80,0.25)",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#4CAF50",
            fontWeight: 700,
            marginBottom: 10,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Survives If
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, color: "#ccc", fontSize: 13, lineHeight: 1.8 }}>
          {survivesIf.map(function (condition, i) {
            return <li key={i}>{condition}</li>;
          })}
        </ul>
      </div>

      <div
        style={{
          padding: 18,
          borderRadius: 12,
          background: "rgba(244,67,54,0.06)",
          border: "1px solid rgba(244,67,54,0.25)",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#F44336",
            fontWeight: 700,
            marginBottom: 10,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Breaks When
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, color: "#ccc", fontSize: 13, lineHeight: 1.8 }}>
          {breaksWhen.map(function (threshold, i) {
            return <li key={i}>{threshold}</li>;
          })}
        </ul>
      </div>
    </div>
  );
}
