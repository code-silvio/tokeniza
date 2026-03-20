"""Service para Verra Registry — download CSV e parse."""

import httpx
from cache.redis import cache_get, cache_set, TTL
from services.mock_data import VERRA_PROJECTS, CARBON_SUMMARY, CARBON_BY_TYPE, CARBON_BY_COUNTRY, CARBON_PRICE_HISTORY

VERRA_CSV_URL = (
    "https://registry.verra.org/uiapi/resource/resource/search"
    "?$maxResults=2000&$format=csv&resourceStatus=4"
)


async def get_verra_projects() -> list[dict]:
    cache_key = "verra:projects"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(VERRA_CSV_URL)
            resp.raise_for_status()
            # Parse CSV simplificado
            import io, csv
            reader = csv.DictReader(io.StringIO(resp.text))
            projects = [
                {
                    "id": row.get("ID", ""),
                    "name": row.get("Name", ""),
                    "country": row.get("Country/Area", ""),
                    "type": row.get("Type", ""),
                    "issued": int(row.get("Total Credits Issued", 0) or 0),
                    "retired": int(row.get("Total Credits Retired", 0) or 0),
                    "available": int(row.get("Total Credits Remaining", 0) or 0),
                }
                for row in reader
            ]
        await cache_set(cache_key, projects, TTL["verra"])
        return projects
    except Exception:
        return VERRA_PROJECTS


async def get_carbon_summary() -> dict:
    cache_key = "carbon:summary"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    projects = await get_verra_projects()
    if projects and projects != VERRA_PROJECTS:
        total_issued = sum(p.get("issued", 0) for p in projects)
        total_retired = sum(p.get("retired", 0) for p in projects)
        summary = {
            **CARBON_SUMMARY,
            "total_issued_mtco2e": total_issued,
            "total_retired_mtco2e": total_retired,
            "total_available_mtco2e": total_issued - total_retired,
            "source": "verra_registry",
        }
        await cache_set(cache_key, summary, TTL["verra"])
        return summary

    return CARBON_SUMMARY


async def get_carbon_by_type() -> list[dict]:
    cache_key = "carbon:by_type"
    cached = await cache_get(cache_key)
    if cached:
        return cached
    return CARBON_BY_TYPE


async def get_carbon_by_country() -> list[dict]:
    cache_key = "carbon:by_country"
    cached = await cache_get(cache_key)
    if cached:
        return cached
    return CARBON_BY_COUNTRY


async def get_carbon_price_history() -> list[dict]:
    cache_key = "carbon:price_history"
    cached = await cache_get(cache_key)
    if cached:
        return cached
    return CARBON_PRICE_HISTORY
