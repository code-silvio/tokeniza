"""Service para World Bank Commodity Prices e comparativo de mercado."""

import httpx
from cache.redis import cache_get, cache_set, TTL
from services.mock_data import MARKET_COMPARE

BASE_URL = "https://api.worldbank.org/v2/en/indicator"

INDICATORS = {
    "SOYA": "PSOYBBAN",
    "CORA": "PMAIZMT",
    "CAFE": "PCOFFOTM",
}


async def get_commodity_price(symbol: str) -> dict:
    indicator = INDICATORS.get(symbol)
    if not indicator:
        return {}

    cache_key = f"worldbank:{symbol}"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.get(
                f"{BASE_URL}/{indicator}",
                params={"format": "json", "mrv": "1", "frequency": "M"},
            )
            resp.raise_for_status()
            data = resp.json()
            entry = data[1][0] if data and len(data) > 1 and data[1] else {}
            result = {
                "symbol": symbol,
                "indicator": indicator,
                "value": entry.get("value"),
                "date": entry.get("date"),
                "unit": "USD/t",
            }
        await cache_set(cache_key, result, TTL["worldbank"])
        return result
    except Exception:
        return {}


async def get_market_compare() -> list[dict]:
    cache_key = "grains:market_compare"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    result = []
    for item in MARKET_COMPARE:
        symbol = item["asset"].lower()
        symbol_map = {"soja": "SOYA", "milho": "CORA", "café arábica": "CAFE"}
        wb_symbol = symbol_map.get(symbol.lower())

        wb_data = await get_commodity_price(wb_symbol) if wb_symbol else {}
        trad_price = wb_data.get("value") or item["traditional_price_usd"]

        result.append({**item, "traditional_price_usd": trad_price})

    await cache_set(cache_key, result, TTL["worldbank"])
    return result


async def get_commodity_history(symbol: str, months: int = 60) -> list[dict]:
    indicator = INDICATORS.get(symbol)
    if not indicator:
        return []

    cache_key = f"worldbank:history:{symbol}"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.get(
                f"{BASE_URL}/{indicator}",
                params={"format": "json", "mrv": months, "frequency": "M"},
            )
            resp.raise_for_status()
            data = resp.json()
            entries = data[1] if data and len(data) > 1 else []
            history = [
                {"date": e["date"], "value": e["value"]}
                for e in entries
                if e.get("value") is not None
            ]
            history.reverse()
        await cache_set(cache_key, history, TTL["worldbank"])
        return history
    except Exception:
        return []
