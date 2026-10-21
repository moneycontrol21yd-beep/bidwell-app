export function Logo({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes: any = {
    sm: "w-10 h-10 text-lg rounded-lg",
    md: "w-12 h-12 text-2xl rounded-xl",
    lg: "w-16 h-16 text-3xl rounded-2xl",
  };
  return (
    <div className={`${sizes[size]} bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-600/30 ${className}`}>
      <span className="font-bold text-white tracking-tight">B</span>
    </div>
  );
}

export default Logo;
