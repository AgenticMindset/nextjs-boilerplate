"use client";

import { useEffect, useId, useRef, useState } from "react";

interface SearchableDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  customValue: string;
  onCustomChange: (value: string) => void;
  placeholder?: string;
}

/**
 * A combobox with a filter box, following the ARIA listbox pattern.
 *
 * The options used to be plain <div onClick>, which meant the whole wargame
 * setup panel was unusable without a mouse. They are now real options inside a
 * listbox, driven by arrow keys, with the active one tracked through
 * aria-activedescendant so the focus stays in the filter input while the
 * selection moves.
 */
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
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const baseId = useId();
  const labelId = `${baseId}-label`;
  const listboxId = `${baseId}-listbox`;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
  );

  // Keep the highlighted option in view as the arrow keys walk past the edge
  // of the scroll container.
  useEffect(() => {
    if (!open || !listRef.current) return;
    const active = listRef.current.querySelector<HTMLElement>('[data-active="true"]');
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  function closeAndRefocus() {
    setOpen(false);
    setQuery("");
    triggerRef.current?.focus();
  }

  function selectOption(option: string) {
    onChange(option);
    setOpen(false);
    setQuery("");
    triggerRef.current?.focus();
  }

  function openList() {
    setOpen(true);
    setQuery("");
    const current = options.indexOf(value);
    setActiveIndex(current >= 0 ? current : 0);
  }

  function handleTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openList();
    }
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) =>
          filtered.length ? (i - 1 + filtered.length) % filtered.length : 0
        );
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(Math.max(0, filtered.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[activeIndex]) selectOption(filtered[activeIndex]);
        break;
      case "Escape":
        e.preventDefault();
        closeAndRefocus();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <span
        id={labelId}
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
      </span>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? closeAndRefocus() : openList())}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${labelId} ${baseId}-trigger`}
        id={`${baseId}-trigger`}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "10px 14px",
          borderRadius: 8,
          border: open
            ? "1px solid var(--color-accent)"
            : "1px solid rgba(255,255,255,0.1)",
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
        <span aria-hidden="true" style={{ color: "#888", fontSize: 11 }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {value === "Other" && (
        <input
          type="text"
          value={customValue}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder="Type your own..."
          aria-label={`${label}: type your own value`}
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
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search..."
            role="combobox"
            aria-expanded
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-labelledby={labelId}
            aria-activedescendant={
              filtered[activeIndex] ? optionId(activeIndex) : undefined
            }
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
          <div
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={labelId}
            style={{ overflowY: "auto" }}
          >
            {filtered.length === 0 && (
              <div style={{ padding: "10px 14px", color: "#666", fontSize: 13 }}>
                No matches
              </div>
            )}
            {filtered.map((option, index) => {
              const isSelected = option === value;
              const isActive = index === activeIndex;
              return (
                <div
                  key={option}
                  id={optionId(index)}
                  role="option"
                  aria-selected={isSelected}
                  data-active={isActive}
                  onClick={() => selectOption(option)}
                  onMouseEnter={() => setActiveIndex(index)}
                  style={{
                    padding: "9px 14px",
                    fontSize: 13,
                    color: isSelected ? "var(--color-accent)" : "#ccc",
                    background: isActive
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",
                    cursor: "pointer",
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
