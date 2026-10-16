"use client";
import React from "react";

type Color = "blue" | "purple" | "green" | "amber" | "pink" | "teal" | "indigo";

interface Props {
  children: React.ReactNode;
  color: Color;
  className?: string;
  onClick?: () => void;
}

export default function GradientCard({ children, color, className = "", onClick }: Props) {
  const gradients: Record<Color, string> = {
    blue: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
    purple: "linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)",
    green: "linear-gradient(135deg, #047857 0%, #10b981 100%)",
    amber: "linear-gradient(135deg, #b45309 0%, #f59e0b 100%)",
    pink: "linear-gradient(135deg, #be185d 0%, #ec4899 100%)",
    teal: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
    indigo: "linear-gradient(135deg, #3730a3 0%, #6366f1 100%)",
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-4 ${className}`}
      style={{ background: gradients[color] }}
    >
      {children}
    </div>
  );
}
