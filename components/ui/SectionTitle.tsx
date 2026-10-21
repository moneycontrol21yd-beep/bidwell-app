"use client";

interface Props {
  title: string;
  action?: string;
  onAction?: () => void;
}

export default function SectionTitle({ title, action, onAction }: Props) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-bold text-white">{title}</h3>
      {action && (
        <button onClick={onAction} className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
          {action} →
        </button>
      )}
    </div>
  );
}
