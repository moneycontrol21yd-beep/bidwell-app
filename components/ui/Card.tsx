"use client";
import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: "sm" | "md" | "lg";
}

export default function Card({ children, className = "", onClick, padding = "md" }: Props) {
  const pads = { sm: "p-3", md: "p-4", lg: "p-5" };
  return (
    <div
      onClick={onClick}
      className={`${pads[padding]} rounded-2xl ${className}`}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-blue)",
      }}
    >
      {children}
    </div>
  );
}
