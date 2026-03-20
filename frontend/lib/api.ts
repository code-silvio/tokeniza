// Em produção, aponta para o FastAPI. Em dev, usa os Route Handlers do Next.js (com fallback mock).
const API_BASE = typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_API_URL || "");

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ─── Carbon ───────────────────────────────────────────────────────────────────
// Clients usam Route Handlers (/api/*) que fazem proxy para FastAPI com fallback mock
export const getCarbonSummary = () => fetchApi<CarbonSummary>("/api/carbon/summary");
export const getCarbonByType = () => fetchApi<CarbonByType[]>("/api/carbon/by-type");
export const getCarbonByCountry = () => fetchApi<CarbonByCountry[]>("/api/carbon/by-country");
export const getCarbonPriceHistory = () => fetchApi<TimePoint[]>("/api/carbon/price-history");
export const getCarbonProjects = () => fetchApi<CarbonProject[]>("/api/carbon/projects");

// ─── Tokens ───────────────────────────────────────────────────────────────────
export const getTokensSummary = () => fetchApi<TokensSummary>("/api/tokens/summary");
export const getProtocols = () => fetchApi<ProtocolCard[]>("/api/tokens/protocols");
export const getTokenPrices = () => fetchApi<Record<string, TokenPrice>>("/api/tokens/prices");
export const getPriceSpread = () => fetchApi<PriceSpreadItem[]>("/api/tokens/price-spread");
export const getAllTVL = () => fetchApi<Record<string, TVLEntry>>("/api/tokens/tvl");

// ─── Grains ───────────────────────────────────────────────────────────────────
export const getGrainsSummary = () => fetchApi<GrainsSummary>("/api/grains/summary");
export const getGrainTokens = () => fetchApi<GrainCard[]>("/api/grains/tokens");
export const getMarketCompare = () => fetchApi<MarketCompareItem[]>("/api/grains/market-compare");
export const getGrainHistory = (symbol: string) =>
  fetchApi<TimePoint[]>(`/api/grains/price-history/${symbol}`);

// Token prices sem route handler próprio — retorna do spread
export const getTokenPricesLocal = () =>
  fetchApi<PriceSpreadItem[]>("/api/tokens/price-spread").then(s =>
    Object.fromEntries(s.map(i => [i.token, { price_usd: i.on_chain_usd, change_24h: 0 }]))
  );

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CarbonSummary {
  total_issued_mtco2e: number;
  total_retired_mtco2e: number;
  total_available_mtco2e: number;
  avg_price_usd: number;
  price_change_24h_pct: number;
  updated_at: string;
  source: string;
}
export interface CarbonByType {
  type: string;
  issued: number;
  retired: number;
  color: string;
}
export interface CarbonByCountry {
  country: string;
  code: string;
  issued: number;
  retired: number;
}
export interface CarbonProject {
  id: string;
  name: string;
  country: string;
  type: string;
  issued: number;
  retired: number;
  available: number;
}
export interface TokensSummary {
  total_tokenized_tco2e: number;
  total_retired_on_chain: number;
  total_tvl_usd: number;
  protocols_active: number;
  updated_at: string;
  source: string;
}
export interface ProtocolCard {
  protocol: string;
  tokens: string[];
  chain: string;
  tvl_usd: number;
  tokenized_tco2e: number;
  retired_tco2e: number;
  token_price_usd: Record<string, number>;
  price_change_24h: Record<string, number>;
  color: string;
}
export interface TokenPrice {
  price_usd: number;
  change_24h: number;
}
export interface PriceSpreadItem {
  token: string;
  on_chain_usd: number;
  off_chain_usd: number | null;
  spread_pct: number | null;
}
export interface TVLEntry {
  name: string;
  tvl_usd: number;
}
export interface GrainsSummary {
  total_tokenized_usd: number;
  total_custody_tonnes: number;
  platforms_active: number;
  updated_at: string;
  source: string;
}
export interface GrainCard {
  symbol: string;
  asset: string;
  name_pt: string;
  platform: string;
  price_usd: number;
  price_brl: number;
  price_change_24h_pct: number;
  total_supply: number;
  custody_volume_usd: number;
  reference_market: string;
  color: string;
  icon: string;
}
export interface MarketCompareItem {
  asset: string;
  token_price_usd: number;
  traditional_price_usd: number;
  token_platform: string;
  trad_platform: string;
  unit: string;
  note: string;
}
export interface TimePoint {
  date: string;
  value: number;
}
