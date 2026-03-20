"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import {
  getCarbonSummary, getCarbonByType, getCarbonByCountry,
  getCarbonPriceHistory, getCarbonProjects,
  type CarbonSummary, type CarbonByType, type CarbonByCountry,
  type CarbonProject, type TimePoint,
} from "@/lib/api";

function fmt(n: number) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  return n.toLocaleString();
}

export function CarbonSection() {
  const [summary, setSummary] = useState<CarbonSummary | null>(null);
  const [byType, setByType] = useState<CarbonByType[]>([]);
  const [byCountry, setByCountry] = useState<CarbonByCountry[]>([]);
  const [priceHistory, setPriceHistory] = useState<TimePoint[]>([]);
  const [projects, setProjects] = useState<CarbonProject[]>([]);

  useEffect(() => {
    getCarbonSummary().then(setSummary).catch(() => null);
    getCarbonByType().then(setByType).catch(() => null);
    getCarbonByCountry().then(setByCountry).catch(() => null);
    getCarbonPriceHistory().then(setPriceHistory).catch(() => null);
    getCarbonProjects().then(setProjects).catch(() => null);
  }, []);

  return (
    <section id="carbon" className="mb-16">
      <SectionHeader
        icon="🌍"
        title="Crédito de Carbono Global"
        subtitle="Verra VCS · Gold Standard · Ecosystem Marketplace"
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Emitido"
          value={summary ? fmt(summary.total_issued_mtco2e) + " tCO₂e" : "—"}
          sub="Verra + Gold Standard"
        />
        <StatCard
          label="Total Aposentado"
          value={summary ? fmt(summary.total_retired_mtco2e) + " tCO₂e" : "—"}
          sub={summary ? ((summary.total_retired_mtco2e / summary.total_issued_mtco2e) * 100).toFixed(1) + "% do emitido" : ""}
        />
        <StatCard
          label="Disponível"
          value={summary ? fmt(summary.total_available_mtco2e) + " tCO₂e" : "—"}
        />
        <StatCard
          label="Preço Médio"
          value={summary ? `$${summary.avg_price_usd.toFixed(2)}` : "—"}
          sub="USD por tCO₂e"
          change={summary?.price_change_24h_pct}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Price history */}
        <div className="lg:col-span-2 rounded-xl bg-slate-900 border border-slate-800 p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Histórico de Preço (USD/tCO₂e)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={priceHistory}>
              <defs>
                <linearGradient id="carbonGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={v => `$${v}`} />
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                labelStyle={{ color: "#94a3b8" }}
                formatter={(v: number) => [`$${v.toFixed(2)}`, "Preço"]}
              />
              <Area type="monotone" dataKey="value" stroke="#22c55e" fill="url(#carbonGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* By type pie */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Por Tipo de Projeto</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byType} dataKey="issued" nameKey="type" cx="50%" cy="50%" outerRadius={75} innerRadius={40}>
                {byType.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                formatter={(v: number) => [fmt(v) + " tCO₂e", ""]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1 mt-2">
            {byType.slice(0, 4).map((t) => (
              <div key={t.type} className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: t.color }} />
                {t.type}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* By country bar */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 mb-8">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Top Países — Emitido vs. Aposentado (tCO₂e)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={byCountry} margin={{ left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="country" tick={{ fontSize: 11, fill: "#64748b" }} />
            <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={fmt} />
            <Tooltip
              contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
              formatter={(v: number, name: string) => [fmt(v) + " tCO₂e", name === "issued" ? "Emitido" : "Aposentado"]}
            />
            <Legend formatter={(v) => v === "issued" ? "Emitido" : "Aposentado"} wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
            <Bar dataKey="issued" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="retired" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Projects table */}
      {projects.length > 0 && (
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Principais Projetos</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  {["ID", "Nome", "País", "Tipo", "Emitido", "Aposentado", "Disponível"].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-xs text-slate-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.slice(0, 6).map((p) => (
                  <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-2 px-3 text-green-400 font-mono text-xs">{p.id}</td>
                    <td className="py-2 px-3 text-slate-300 max-w-[200px] truncate">{p.name}</td>
                    <td className="py-2 px-3 text-slate-400">{p.country}</td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-green-900/40 text-green-400">{p.type}</span>
                    </td>
                    <td className="py-2 px-3 text-slate-300">{fmt(p.issued)}</td>
                    <td className="py-2 px-3 text-blue-400">{fmt(p.retired)}</td>
                    <td className="py-2 px-3 text-slate-300">{fmt(p.available)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
