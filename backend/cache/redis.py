import json
import os
from typing import Any, Optional

import redis.asyncio as aioredis

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# TTLs em segundos conforme especificação do documento
TTL = {
    "verra": 86400,          # 24h
    "goldstandard": 86400,   # 24h
    "ecosystem": 86400,      # 24h
    "thegraph": 3600,        # 1h
    "defillama": 1800,       # 30min
    "coingecko": 300,        # 5min
    "agrotoken": 3600,       # 1h
    "worldbank": 86400,      # 24h
    "nasdaq": 900,           # 15min
}

_pool: Optional[aioredis.Redis] = None


async def get_redis() -> aioredis.Redis:
    global _pool
    if _pool is None:
        _pool = aioredis.from_url(REDIS_URL, decode_responses=True)
    return _pool


async def cache_get(key: str) -> Optional[Any]:
    try:
        client = await get_redis()
        value = await client.get(key)
        if value:
            return json.loads(value)
    except Exception:
        pass
    return None


async def cache_set(key: str, value: Any, ttl: int) -> None:
    try:
        client = await get_redis()
        await client.setex(key, ttl, json.dumps(value))
    except Exception:
        pass
