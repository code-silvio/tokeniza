"""Service para The Graph — queries GraphQL para Toucan e KlimaDAO."""

import httpx
from cache.redis import cache_get, cache_set, TTL
from services.mock_data import PROTOCOL_CARDS, TOKENS_SUMMARY

SUBGRAPHS = {
    "toucan": "https://api.thegraph.com/subgraphs/name/toucanprotocol/polygon",
    "klimadao": "https://api.thegraph.com/subgraphs/name/klimadao/klimadao-polygon",
}

TOUCAN_QUERY = """{
  tco2Tokens(first: 50, orderBy: totalRetired, orderDirection: desc) {
    id
    name
    symbol
    totalSupply
    totalRetired
    projectVintage {
      project { projectId methodology country }
    }
  }
}"""


def _wei_to_tco2(wei_str: str) -> float:
    try:
        return int(wei_str) / 1e18
    except Exception:
        return 0.0


async def get_toucan_tokens() -> list[dict]:
    cache_key = "thegraph:toucan:tokens"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.post(
                SUBGRAPHS["toucan"],
                json={"query": TOUCAN_QUERY},
            )
            resp.raise_for_status()
            data = resp.json().get("data", {}).get("tco2Tokens", [])
            tokens = [
                {
                    "id": t["id"],
                    "name": t["name"],
                    "symbol": t["symbol"],
                    "total_supply": _wei_to_tco2(t["totalSupply"]),
                    "total_retired": _wei_to_tco2(t["totalRetired"]),
                    "project": t.get("projectVintage", {}).get("project", {}),
                }
                for t in data
            ]
        await cache_set(cache_key, tokens, TTL["thegraph"])
        return tokens
    except Exception:
        return []


async def get_tokens_summary() -> dict:
    cache_key = "tokens:summary"
    cached = await cache_get(cache_key)
    if cached:
        return cached
    return TOKENS_SUMMARY


async def get_protocol_cards() -> list[dict]:
    cache_key = "tokens:protocols"
    cached = await cache_get(cache_key)
    if cached:
        return cached
    return PROTOCOL_CARDS
