"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import {
  getGrainsSummary, getGrainTokens, getMarketCompare, getGrainHistory,
  type GrainsSummary, type GrainCard, type MarketCompareItem, type TimePoint,
} from "@/lib/api";
import { clsx } from "clsx";

function fmt(n: number) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toLocaleString();
}

const SYMBOLS = ["SOYA", "CORA", "CAFE"];

export function GrainsSection() {
  const [summary, setSummary] = useState<GrainsSummary | null>(null);
  const [grains, setGrains] = useState<GrainCard[]>([]);
  const [compare, setCompare] = useState<MarketCompareItem[]>([]);
  const [selected, setSelected] = useState("SOYA");
  const [history, setHistory] = useState<TimePoint[]>([]);

  useEffect(() => {
    getGrainsSummary().then(setSummary).catch(() => null);
    getGrainTokens().then(setGrains).catch(() => null);
    getMarketCompare().then(setCompare).catch(() => null);
  }, []);

  useEffect(() => {
    getGrainHistory(selected).then(setHistory).catch(() => null);
  }, [selected]);

  const selectedGrain = grains.find(g => g.symbol === selected);

  return (
    <section id="grains" className="mb-16">
      <SectionHeader
        icon="🌾"
        title="Tokenização de Grãos"
        subtitle="Agrotoken · World Bank · CBOT Futures"
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Tokenizado"
          value={summary ? "$" + fmt(summary.total_tokenized_usd) : "—"}
          sub="USD em custódia"
        />
        <StatCard
          label="Volume em Custódia"
          value={summary ? fmt(summary.total_custody_tonnes) + " t" : "—"}
          sub="Toneladas físicas"
        />
        <StatCard
          label="Plataformas Ativas"
          value={summary ? summary.platforms_active.toString() : "—"}
        />
      </div>

      {/* Grain token cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {grains.map((g) => (
          <button
            key={g.symbol}
            onClick={() => setSelected(g.symbol)}
            className={clsx(
              "rounded-xl border p-5 text-left transition-all",
              selected === g.symbol
                ? "border-blue-500 bg-blue-950/30"
                : "border-slate-800 bg-slate-900 hover:border-slate-700"
            )}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{g.icon}</span>
              <div>
                <p className="font-bold text-white">{g.symbol}</p>
                <p className="text-xs text-slate-400">{g.name_pt} · {g.platform}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500">Preço USD</p>
                <p className="text-lg font-bold text-white">${g.price_usd.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Preço BRL</p>
                <p className="text-lg font-bold" style={{ color: g.color }}>
                  R${g.price_brl.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Supply</p>
                <p className="text-sm text-slate-300">{fmt(g.total_supply)} t</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">24h</p>
                <p className={clsx("text-sm font-semibold", g.price_change_24h_pct >= 0 ? "text-green-400" : "text-red-400")}>
                  {g.price_change_24h_pct >= 0 ? "+" : ""}{g.price_change_24h_pct}%
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800">
              <p className="text-xs text-slate-500">Custódia</p>
              <p className="text-sm text-slate-300">${fmt(g.custody_volume_usd)}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Price history */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300">
              Histórico de Preço — {selected}
            </h3>
            <div className="flex gap-2">
              {SYMBOLS.map(s => (
                <button
                  key={s}
                  onClick={() => setSelected(s)}
                  className={clsx(
                    "text-xs px-2 py-1 rounded-full transition-colors",
                    selected === s ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-slate-300"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="grainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={v => "$" + fmt(v)} />
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, "Preço"]}
              />
              <Area type="monotone" dataKey="value" stroke="#f59e0b" fill="url(#grainGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Market compare */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Tokenizado vs. Mercado Tradicional</h3>
          <div className="flex flex-col gap-4">
            {compare.map((item) => {
              const pct = item.traditional_price_usd > 0
                ? ((item.token_price_usd - item.traditional_price_usd) / item.traditional_price_usd * 100)
                : 0;
              const ratio = Math.min(100, (item.token_price_usd / (item.traditional_price_usd || 1)) * 30);
              return (
                <div key={item.asset}>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-slate-300">{item.asset}</span>
                    <span className={clsx(pct >= 0 ? "text-green-400" : "text-red-400")}>
                      {pct >= 0 ? "+" : ""}{pct.toFixed(1)}% vs trad.
                    </span>
                  </div>
                  <div className="flex gap-2 items-center text-xs text-slate-500 mb-1.5">
                    <span>{item.token_platform}: <strong className="text-white">${item.token_price_usd.toLocaleString()}</strong></span>
                    <span className="text-slate-700">|</span>
                    <span>{item.trad_platform}: <strong className="text-slate-300">${item.traditional_price_usd.toLocaleString()}</strong></span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" style={{ width: `${ratio}%` }} />
                  </div>
                  {item.note && <p className="text-xs text-slate-600 mt-1">{item.note}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
