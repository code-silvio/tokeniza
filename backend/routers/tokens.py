"""Router /api/tokens — Tokenização de Carbono (The Graph + DeFi Llama + CoinGecko)."""

from fastapi import APIRouter, Query
from services.thegraph import get_tokens_summary, get_protocol_cards, get_toucan_tokens
from services.defillama import get_all_tvl, get_tvl_history
from services.coingecko import get_token_prices, get_price_history, get_price_spread, TOKEN_IDS

router = APIRouter(prefix="/api/tokens", tags=["tokens"])


@router.get("/summary")
async def tokens_summary():
    return await get_tokens_summary()


@router.get("/protocols")
async def protocols():
    cards = await get_protocol_cards()
    prices = await get_token_prices()
    # Enriquecer com preços live
    for card in cards:
        for symbol in list(card.get("token_price_usd", {}).keys()):
            if symbol in prices:
                card["token_price_usd"][symbol] = prices[symbol]["price_usd"]
                card["price_change_24h"][symbol] = prices[symbol]["change_24h"]
    return cards


@router.get("/prices")
async def token_prices():
    return await get_token_prices()


@router.get("/price-spread")
async def price_spread():
    return await get_price_spread()


@router.get("/tvl")
async def all_tvl():
    return await get_all_tvl()


@router.get("/tvl/{protocol_slug}/history")
async def tvl_history(protocol_slug: str):
    return await get_tvl_history(protocol_slug)


@router.get("/price-history/{symbol}")
async def price_history(symbol: str, days: int = Query(365, ge=1, le=1825)):
    cg_id = TOKEN_IDS.get(symbol, symbol.lower())
    return await get_price_history(cg_id, days)


@router.get("/toucan")
async def toucan_tokens():
    return await get_toucan_tokens()
