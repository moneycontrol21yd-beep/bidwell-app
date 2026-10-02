"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const items = [
    { href: "/dashboard", label: "Home", icon: "🏠" },
    { href: "/tenders", label: "Tenders", icon: "📄" },
    { href: "/bids", label: "Bids", icon: "✅" },
    { href: "/contracts", label: "Contracts", icon: "🏢" },
    { href: "/payments", label: "Money", icon: "💰" },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 z-50">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="flex flex-col items-center">
          <span className="text-xl">{item.icon}</span>
          <span className={`text-xs mt-1 ${pathname === item.href ? "text-blue-600 font-semibold" : "text-gray-500"}`}>
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
