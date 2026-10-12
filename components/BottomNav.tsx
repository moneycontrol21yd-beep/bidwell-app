"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "Home", href: "/dashboard", icon: "🏠" },
    { name: "Tenders", href: "/live-tenders", icon: "📋" },
    { name: "Bids", href: "/bids", icon: "💼" },
    { name: "Contracts", href: "/contracts", icon: "🤝" },
    { name: "Money", href: "/payments", icon: "₹" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-2 px-4 shadow-lg z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-bold"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[10px] mt-0.5">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
