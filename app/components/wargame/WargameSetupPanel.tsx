"use client";

import { useState } from "react";
import SearchableDropdown from "./SearchableDropdown";
import type {
  CustomerSegment,
  IndustryVertical,
  MarketDefinition,
  TargetGeography,
  TechnologyLayer,
} from "../../../lib/wargame/types";

const VERTICALS: IndustryVertical[] = [
  "Customer Support",
  "Legal Services",
  "Healthcare",
  "Financial Services",
  "Education",
  "HR & Recruitment",
  "Supply Chain & Logistics",
  "Marketing & Advertising",
  "Real Estate",
  "Insurance",
  "Cybersecurity",
  "E-commerce & Retail",
  "Manufacturing",
  "Media & Entertainment",
  "Agriculture",
  "Energy",
  "Travel & Hospitality",
  "Construction",
  "Telecommunications",
  "Government & Public Sector",
  "Other",
];

const TECHNOLOGIES: TechnologyLayer[] = [
  "Conversational AI / Chatbots",
  "Autonomous Agents",
  "Predictive Analytics",
  "Document Intelligence",
  "Code Generation",
  "Search & Retrieval",
  "Computer Vision",
  "Recommendation Systems",
  "Process Automation (RPA+AI)",
  "Data Integration & Pipelines",
  "Voice AI",
  "Content Generation",
  "Decision Intelligence",
  "Simulation & Digital Twins",
  "Other",
];

const GEOGRAPHIES: TargetGeography[] = [
  "United States",
  "DACH (DE/AT/CH)",
  "United Kingdom",
  "Nordics (SE/NO/DK/FI)",
  "Benelux (NL/BE/LU)",
  "France",
  "Southern Europe (ES/IT/PT)",
  "Eastern Europe",
  "Canada",
  "Latin America",
  "Middle East & GCC",
  "Southeast Asia",
  "India",
  "Japan & South Korea",
  "Australia & New Zealand",
  "Africa",
  "Global (no geo focus)",
  "Other",
];

const SEGMENTS: CustomerSegment[] = [
  "Enterprise (1000+ employees)",
  "Mid-Market (100-999)",
  "SMB (10-99)",
  "Micro / Solo operators",
  "Consumer (B2C)",
  "Developer / Technical buyer",
  "Government & Public sector",
  "Other",
];

interface WargameSetupPanelProps {
  onRun: (market: MarketDefinition) => void;
}

export default function WargameSetupPanel({ onRun }: WargameSetupPanelProps) {
  const [vertical, setVertical] = useState<IndustryVertical>("Customer Support");
  const [customVertical, setCustomVertical] = useState("");
  const [technology, setTechnology] = useState<TechnologyLayer>(
    "Conversational AI / Chatbots"
  );
  const [customTechnology, setCustomTechnology] = useState("");
  const [geography, setGeography] = useState<TargetGeography>("United States");
  const [customGeography, setCustomGeography] = useState("");
  const [segment, setSegment] = useState<CustomerSegment>("Enterprise (1000+ employees)");
  const [customSegment, setCustomSegment] = useState("");

  const missingCustom =
    (vertical === "Other" && !customVertical.trim()) ||
    (technology === "Other" && !customTechnology.trim()) ||
    (geography === "Other" && !customGeography.trim()) ||
    (segment === "Other" && !customSegment.trim());

  function handleRun() {
    if (missingCustom) return;
    onRun({
      vertical,
      customVertical: customVertical.trim(),
      technology,
      customTechnology: customTechnology.trim(),
      geography,
      customGeography: customGeography.trim(),
      segment,
      customSegment: customSegment.trim(),
    });
  }

  return (
    <div
      style={{
        maxWidth: 640,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <SearchableDropdown
        label="Industry Vertical"
        options={VERTICALS}
        value={vertical}
        onChange={function (v) {
          setVertical(v as IndustryVertical);
        }}
        customValue={customVertical}
        onCustomChange={setCustomVertical}
      />
      <SearchableDropdown
        label="Technology Layer"
        options={TECHNOLOGIES}
        value={technology}
        onChange={function (v) {
          setTechnology(v as TechnologyLayer);
        }}
        customValue={customTechnology}
        onCustomChange={setCustomTechnology}
      />
      <SearchableDropdown
        label="Target Geography"
        options={GEOGRAPHIES}
        value={geography}
        onChange={function (v) {
          setGeography(v as TargetGeography);
        }}
        customValue={customGeography}
        onCustomChange={setCustomGeography}
      />
      <SearchableDropdown
        label="Target Customer Segment"
        options={SEGMENTS}
        value={segment}
        onChange={function (v) {
          setSegment(v as CustomerSegment);
        }}
        customValue={customSegment}
        onCustomChange={setCustomSegment}
      />

      <button
        onClick={handleRun}
        disabled={missingCustom}
        style={{
          padding: "14px 28px",
          borderRadius: 10,
          background: missingCustom
            ? "#333"
            : "rgba(255, 255, 255, 0.1)",
          color: missingCustom ? "#666" : "#fff",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: missingCustom ? "none" : "1px solid rgba(255, 255, 255, 0.25)",
          fontSize: 16,
          fontWeight: 700,
          cursor: missingCustom ? "not-allowed" : "pointer",
          transition: "all 0.3s",
          width: "100%",
        }}
      >
        Run Wargame
      </button>
    </div>
  );
}
