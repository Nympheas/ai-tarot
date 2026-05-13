"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/tarot", label: "塔罗", icon: "🔮" },
  { href: "/iching", label: "易经", icon: "☯" },
  { href: "/mass", label: "大众", icon: "💕" },
  { href: "/history", label: "历史", icon: "📜" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe">
      <div className="mb-4 flex gap-1 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl px-3 py-2 shadow-2xl">
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl text-xs transition-all ${
                active
                  ? "bg-white/10 text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
