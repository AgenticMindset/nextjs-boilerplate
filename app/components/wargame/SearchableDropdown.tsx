"use client";

import { useEffect, useRef, useState } from "react";

interface SearchableDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  customValue: string;
  onCustomChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchableDropdown({
  label,
  options,
  value,
  onChange,
  customValue,
  onCustomChange,
  placeholder,
}: SearchableDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(function () {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return function () {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filtered = options.filter(function (o) {
    return o.toLowerCase().includes(query.toLowerCase());
  });

  function selectOption(option: string) {
    onChange(option);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <label
        style={{
          display: "block",
          marginBottom: 8,
          color: "var(--color-accent)",
          fontSize: 13,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </label>
      <button
        type="button"
        onClick={function () {
          setOpen(!open);
        }}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "10px 14px",
          borderRadius: 8,
          border: open ? "1px solid var(--color-accent)" : "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.03)",
          color: value ? "#fff" : "#888",
          fontSize: 14,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{value || placeholder || "Select..."}</span>
        <span style={{ color: "#888", fontSize: 11 }}>{open ? "▲" : "▼"}</span>
      </button>

      {value === "Other" && (
        <input
          type="text"
          value={customValue}
          onChange={function (e) {
            onCustomChange(e.target.value);
          }}
          placeholder="Type your own..."
          style={{
            marginTop: 8,
            width: "100%",
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.03)",
            color: "#fff",
            fontSize: 14,
            outline: "none",
          }}
        />
      )}

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 20,
            background: "#141414",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10,
            boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            maxHeight: 260,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <input
            autoFocus
            type="text"
            value={query}
            onChange={function (e) {
              setQuery(e.target.value);
            }}
            placeholder="Search..."
            style={{
              padding: "10px 14px",
              border: "none",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              background: "transparent",
              color: "#fff",
              fontSize: 13,
              outline: "none",
            }}
          />
          <div style={{ overflowY: "auto" }}>
            {filtered.length === 0 && (
              <div style={{ padding: "10px 14px", color: "#666", fontSize: 13 }}>
                No matches
              </div>
            )}
            {filtered.map(function (option) {
              var isSelected = option === value;
              return (
                <div
                  key={option}
                  onClick={function () {
                    selectOption(option);
                  }}
                  style={{
                    padding: "9px 14px",
                    fontSize: 13,
                    color: isSelected ? "var(--color-accent)" : "#ccc",
                    background: isSelected ? "rgba(255,255,255,0.08)" : "transparent",
                    cursor: "pointer",
                  }}
                  onMouseEnter={function (e) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={function (e) {
                    e.currentTarget.style.background = isSelected
                      ? "rgba(255,255,255,0.08)"
                      : "transparent";
                  }}
                >
                  {option}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
