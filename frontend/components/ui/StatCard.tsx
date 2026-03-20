"use client";
import { clsx } from "clsx";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  label: string;
  value: string;
  sub?: string;
  change?: number;
  accent?: string;
}

export function StatCard({ label, value, sub, change, accent = "#22c55e" }: Props) {
  const positive = change !== undefined && change >= 0;
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 flex flex-col gap-2">
      <span className="text-xs text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-2xl font-bold text-white">{value}</span>
      {sub && <span className="text-xs text-slate-500">{sub}</span>}
      {change !== undefined && (
        <span className={clsx("text-xs flex items-center gap-1", positive ? "text-green-400" : "text-red-400")}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {positive ? "+" : ""}{change.toFixed(1)}% 24h
        </span>
      )}
    </div>
  );
}
