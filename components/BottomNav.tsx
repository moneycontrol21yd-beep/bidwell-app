"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, FileTextIcon, CheckSquareIcon, BuildingIcon, WalletIcon } from "@/components/icons";
import { useLang } from "@/lib/language";

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLang();
  const items = [
    { href: "/dashboard", label: t("home"), Icon: HomeIcon },
    { href: "/tenders", label: t("tenders"), Icon: FileTextIcon },
    { href: "/bids", label: t("bids"), Icon: CheckSquareIcon },
    { href: "/contracts", label: t("contracts"), Icon: BuildingIcon },
    { href: "/payments", label: t("money"), Icon: WalletIcon },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 flex justify-around py-2.5 z-50">
      {items.map((item) => {
        const active = pathname === item.href || pathname?.startsWith(item.href + "/");
        return (
          <Link key={item.href} href={item.href} className="flex flex-col items-center flex-1 py-1">
            <item.Icon size={22} className={active ? "text-blue-600" : "text-gray-400"} />
            <span className={`text-[10px] mt-1 font-semibold tracking-wide ${active ? "text-blue-600" : "text-gray-500 dark:text-gray-400"}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
