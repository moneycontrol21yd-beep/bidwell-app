"use client";

interface Props {
  label: string;
  value: string | number;
  color?: "blue" | "green" | "amber" | "purple" | "red" | "cyan";
  sublabel?: string;
}

export default function StatPill({ label, value, color = "blue", sublabel }: Props) {
  const colors = {
    blue: "text-blue-400",
    green: "text-emerald-400",
    amber: "text-amber-400",
    purple: "text-purple-400",
    red: "text-red-400",
    cyan: "text-cyan-400",
  };
  return (
    <div
      className="rounded-xl p-3 flex-1"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-blue)" }}
    >
      <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
      <div className={`text-lg font-bold mt-0.5 ${colors[color]}`}>{value}</div>
      {sublabel && (
        <div className="text-[9px] mt-0.5" style={{ color: "var(--text-muted)" }}>{sublabel}</div>
      )}
    </div>
  );
}
