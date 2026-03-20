/**
 * Mock data realista — espelha o backend/services/mock_data.py.
 * Usado pelos Route Handlers do Next.js quando o FastAPI não está disponível.
 */

function monthlySeries(base: number, months = 24, volatility = 0.05) {
  const series = [];
  let value = base;
  const now = new Date();
  for (let i = months; i > 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    value = value * (1 + (Math.random() - 0.5) * 2 * volatility);
    series.push({ date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, value: +value.toFixed(2) });
  }
  return series;
}

export const CARBON_SUMMARY = {
  total_issued_mtco2e: 1_842_000_000,
  total_retired_mtco2e: 743_000_000,
  total_available_mtco2e: 1_099_000_000,
  avg_price_usd: 5.42,
  price_change_24h_pct: -1.3,
  updated_at: new Date().toISOString(),
  source: "mock",
};

export const CARBON_BY_TYPE = [
  { type: "REDD+", issued: 612_000_000, retired: 280_000_000, color: "#22c55e" },
  { type: "Renewable Energy", issued: 498_000_000, retired: 187_000_000, color: "#3b82f6" },
  { type: "Improved Cookstoves", issued: 234_000_000, retired: 98_000_000, color: "#f59e0b" },
  { type: "Methane Avoidance", issued: 178_000_000, retired: 74_000_000, color: "#8b5cf6" },
  { type: "Afforestation", issued: 156_000_000, retired: 52_000_000, color: "#06b6d4" },
  { type: "Others", issued: 164_000_000, retired: 52_000_000, color: "#6b7280" },
];

export const CARBON_BY_COUNTRY = [
  { country: "Brazil", code: "BR", issued: 312_000_000, retired: 142_000_000 },
  { country: "India", code: "IN", issued: 287_000_000, retired: 98_000_000 },
  { country: "China", code: "CN", issued: 243_000_000, retired: 87_000_000 },
  { country: "Indonesia", code: "ID", issued: 198_000_000, retired: 76_000_000 },
  { country: "Kenya", code: "KE", issued: 143_000_000, retired: 67_000_000 },
  { country: "Colombia", code: "CO", issued: 112_000_000, retired: 43_000_000 },
  { country: "Peru", code: "PE", issued: 98_000_000, retired: 38_000_000 },
];

export const CARBON_PRICE_HISTORY = monthlySeries(5.80, 24, 0.08);

export const CARBON_PROJECTS = [
  { id: "VCS-191", name: "Juma Sustainable Development Reserve", country: "Brazil", type: "REDD+", issued: 28_400_000, retired: 14_200_000, available: 14_200_000 },
  { id: "VCS-844", name: "Madre de Dios Amazon REDD+", country: "Peru", type: "REDD+", issued: 18_700_000, retired: 9_800_000, available: 8_900_000 },
  { id: "VCS-1350", name: "Wind Power Rajasthan", country: "India", type: "Renewable Energy", issued: 12_300_000, retired: 4_200_000, available: 8_100_000 },
  { id: "VCS-1566", name: "Katingan Mentaya REDD+", country: "Indonesia", type: "REDD+", issued: 35_800_000, retired: 18_200_000, available: 17_600_000 },
  { id: "VCS-2191", name: "Cookstoves Kenya", country: "Kenya", type: "Improved Cookstoves", issued: 9_400_000, retired: 5_700_000, available: 3_700_000 },
];

export const TOKENS_SUMMARY = {
  total_tokenized_tco2e: 48_300_000,
  total_retired_on_chain: 19_200_000,
  total_tvl_usd: 87_400_000,
  protocols_active: 4,
  updated_at: new Date().toISOString(),
  source: "mock",
};

export const PROTOCOL_CARDS = [
  { protocol: "Toucan Protocol", tokens: ["BCT", "NCT"], chain: "Polygon", tvl_usd: 38_200_000, tokenized_tco2e: 24_800_000, retired_tco2e: 9_400_000, token_price_usd: { BCT: 6.42, NCT: 8.17 }, price_change_24h: { BCT: -0.8, NCT: 1.2 }, color: "#22c55e" },
  { protocol: "KlimaDAO", tokens: ["KLIMA"], chain: "Polygon", tvl_usd: 29_700_000, tokenized_tco2e: 14_200_000, retired_tco2e: 7_100_000, token_price_usd: { KLIMA: 2.18 }, price_change_24h: { KLIMA: -2.1 }, color: "#3b82f6" },
  { protocol: "Moss.Earth", tokens: ["MCO2"], chain: "Ethereum", tvl_usd: 14_800_000, tokenized_tco2e: 7_400_000, retired_tco2e: 2_100_000, token_price_usd: { MCO2: 7.85 }, price_change_24h: { MCO2: 0.4 }, color: "#f59e0b" },
  { protocol: "C3 Protocol", tokens: ["NBO", "UBO"], chain: "Polygon", tvl_usd: 4_700_000, tokenized_tco2e: 1_900_000, retired_tco2e: 600_000, token_price_usd: { NBO: 5.93, UBO: 4.12 }, price_change_24h: { NBO: 0.7, UBO: -1.5 }, color: "#8b5cf6" },
];

export const PRICE_SPREAD = [
  { token: "BCT", on_chain_usd: 6.42, off_chain_usd: 5.80, spread_pct: 10.7 },
  { token: "NCT", on_chain_usd: 8.17, off_chain_usd: 7.40, spread_pct: 10.4 },
  { token: "MCO2", on_chain_usd: 7.85, off_chain_usd: 7.10, spread_pct: 10.6 },
];

export const ALL_TVL = {
  "toucan-protocol": { name: "Toucan Protocol", tvl_usd: 38_200_000 },
  "klimadao": { name: "KlimaDAO", tvl_usd: 29_700_000 },
  "moss-carbon-credit": { name: "Moss.Earth", tvl_usd: 14_800_000 },
};

export const GRAINS_SUMMARY = {
  total_tokenized_usd: 847_000_000,
  total_custody_tonnes: 187_400,
  platforms_active: 3,
  updated_at: new Date().toISOString(),
  source: "mock",
};

export const GRAIN_CARDS = [
  { symbol: "SOYA", asset: "Soybean", name_pt: "Soja", platform: "Agrotoken", price_usd: 5_012.40, price_brl: 25_850, price_change_24h_pct: 0.8, total_supply: 84_200, custody_volume_usd: 422_150_080, reference_market: "CBOT / B3", color: "#f59e0b", icon: "🌱" },
  { symbol: "CORA", asset: "Corn", name_pt: "Milho", platform: "Agrotoken", price_usd: 1_847.20, price_brl: 9_520, price_change_24h_pct: -0.4, total_supply: 142_800, custody_volume_usd: 263_780_160, reference_market: "CBOT / B3", color: "#eab308", icon: "🌽" },
  { symbol: "CAFE", asset: "Coffee Arabica", name_pt: "Café Arábica", platform: "CoffeeChain", price_usd: 4_280, price_brl: 22_070, price_change_24h_pct: 1.3, total_supply: 37_900, custody_volume_usd: 162_202_000, reference_market: "ICE / CEPEA", color: "#92400e", icon: "☕" },
];

export const MARKET_COMPARE = [
  { asset: "Soja", token_price_usd: 5_012.40, traditional_price_usd: 372.80, token_platform: "Agrotoken SOYA", trad_platform: "CBOT Spot", unit: "USD/t", note: "Token inclui prêmio de liquidez e custódia" },
  { asset: "Milho", token_price_usd: 1_847.20, traditional_price_usd: 168.40, token_platform: "Agrotoken CORA", trad_platform: "CBOT Spot", unit: "USD/t", note: "Token lastreado em lotes físicos certificados" },
  { asset: "Café Arábica", token_price_usd: 4_280, traditional_price_usd: 3_840, token_platform: "CoffeeChain CAFE", trad_platform: "ICE Futures", unit: "USD/t", note: "Paridade próxima ao mercado físico" },
];

export const GRAIN_HISTORY: Record<string, { date: string; value: number }[]> = {
  SOYA: monthlySeries(5_012, 24, 0.04),
  CORA: monthlySeries(1_847, 24, 0.05),
  CAFE: monthlySeries(4_280, 24, 0.06),
};
