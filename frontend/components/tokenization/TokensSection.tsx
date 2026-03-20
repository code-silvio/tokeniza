"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import {
  getTokensSummary, getProtocols, getPriceSpread, getAllTVL,
  type TokensSummary, type ProtocolCard, type PriceSpreadItem, type TVLEntry,
} from "@/lib/api";
import { clsx } from "clsx";

function fmt(n: number) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toLocaleString();
}

export function TokensSection() {
  const [summary, setSummary] = useState<TokensSummary | null>(null);
  const [protocols, setProtocols] = useState<ProtocolCard[]>([]);
  const [spread, setSpread] = useState<PriceSpreadItem[]>([]);
  const [tvl, setTvl] = useState<Record<string, TVLEntry>>({});

  useEffect(() => {
    getTokensSummary().then(setSummary).catch(() => null);
    getProtocols().then(setProtocols).catch(() => null);
    getPriceSpread().then(setSpread).catch(() => null);
    getAllTVL().then(setTvl).catch(() => null);
  }, []);

  const tvlData = Object.entries(tvl).map(([, v]) => ({
    name: v.name,
    tvl: v.tvl_usd,
  }));

  return (
    <section id="tokens" className="mb-16">
      <SectionHeader
        icon="⛓️"
        title="Tokenização de Carbono"
        subtitle="The Graph · DeFi Llama · CoinGecko"
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Tokenizado"
          value={summary ? fmt(summary.total_tokenized_tco2e) + " tCO₂e" : "—"}
          sub="On-chain total"
        />
        <StatCard
          label="Aposentado On-Chain"
          value={summary ? fmt(summary.total_retired_on_chain) + " tCO₂e" : "—"}
        />
        <StatCard
          label="TVL Total"
          value={summary ? "$" + fmt(summary.total_tvl_usd) : "—"}
          sub="Total Value Locked"
        />
        <StatCard
          label="Protocolos Ativos"
          value={summary ? summary.protocols_active.toString() : "—"}
        />
      </div>

      {/* Protocol cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {protocols.map((p) => (
          <div key={p.protocol} className="rounded-xl bg-slate-900 border border-slate-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                <div>
                  <p className="font-semibold text-white text-sm">{p.protocol}</p>
                  <p className="text-xs text-slate-500">{p.chain}</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-400">
                TVL ${fmt(p.tvl_usd)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-xs text-slate-500">Tokenizado</p>
                <p className="text-base font-semibold text-white">{fmt(p.tokenized_tco2e)} tCO₂e</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Aposentado</p>
                <p className="text-base font-semibold text-blue-400">{fmt(p.retired_tco2e)} tCO₂e</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {Object.entries(p.token_price_usd).map(([symbol, price]) => {
                const change = p.price_change_24h[symbol] ?? 0;
                const pos = change >= 0;
                return (
                  <div key={symbol} className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1.5">
                    <span className="text-xs font-mono text-slate-300">{symbol}</span>
                    <span className="text-xs font-bold text-white">${price.toFixed(2)}</span>
                    <span className={clsx("text-xs", pos ? "text-green-400" : "text-red-400")}>
                      {pos ? "+" : ""}{change.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* TVL bar + Price spread */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* TVL bar */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">TVL por Protocolo (USD)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={tvlData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={v => "$" + fmt(v)} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} width={110} />
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                formatter={(v: number) => ["$" + fmt(v), "TVL"]}
              />
              <Bar dataKey="tvl" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Price spread */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Spread: On-Chain vs. Off-Chain</h3>
          <div className="flex flex-col gap-3">
            {spread.filter(s => s.off_chain_usd !== null).map((item) => (
              <div key={item.token} className="flex items-center gap-3">
                <span className="w-12 text-xs font-mono text-slate-300 font-bold">{item.token}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Off-chain ${item.off_chain_usd?.toFixed(2)}</span>
                    <span>On-chain ${item.on_chain_usd.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-green-400 rounded-full"
                      style={{ width: `${Math.min(100, (item.spread_pct ?? 0) * 5)}%` }}
                    />
                  </div>
                </div>
                <span className="w-14 text-right text-xs text-green-400 font-semibold">
                  +{item.spread_pct?.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
