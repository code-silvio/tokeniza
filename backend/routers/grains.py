"""Router /api/grains — Tokenização de Grãos (Agrotoken + World Bank + Nasdaq)."""

from fastapi import APIRouter
from services.agrotoken import get_all_grains, get_grains_summary, get_grain_history
from services.worldbank import get_market_compare, get_commodity_history

router = APIRouter(prefix="/api/grains", tags=["grains"])


@router.get("/summary")
async def grains_summary():
    return await get_grains_summary()


@router.get("/tokens")
async def grain_tokens():
    return await get_all_grains()


@router.get("/market-compare")
async def market_compare():
    return await get_market_compare()


@router.get("/price-history/{symbol}")
async def grain_price_history(symbol: str):
    symbol = symbol.upper()
    return await get_grain_history(symbol)


@router.get("/commodity-history/{symbol}")
async def commodity_history(symbol: str, months: int = 60):
    return await get_commodity_history(symbol.upper(), months)
