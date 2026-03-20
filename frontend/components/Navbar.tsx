"use client";

import { useState, useEffect } from "react";
import { clsx } from "clsx";

const NAV_ITEMS = [
  { id: "carbon", label: "Carbono Global", icon: "🌍" },
  { id: "tokens", label: "Tokenização", icon: "⛓️" },
  { id: "grains", label: "Grãos", icon: "🌾" },
];

export function Navbar() {
  const [active, setActive] = useState("carbon");

  useEffect(() => {
    const handler = () => {
      const sections = NAV_ITEMS.map(n => document.getElementById(n.id));
      const scrollY = window.scrollY + 120;
      sections.forEach((s) => {
        if (s && s.offsetTop <= scrollY) setActive(s.id);
      });
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0f1e]/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-bold text-sm tracking-tight">Asset Tokenization</span>
          <span className="hidden sm:inline text-xs text-slate-600 px-2 py-0.5 rounded-full border border-slate-700">Dashboard</span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                active === item.id
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:text-slate-300 hover:bg-slate-800"
              )}
            >
              <span>{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="hidden sm:inline">Live</span>
        </div>
      </div>
    </nav>
  );
}
