"""Asset Tokenization Dashboard — FastAPI backend."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routers import carbon, tokens, grains

app = FastAPI(
    title="Asset Tokenization Dashboard API",
    description="Backend que agrega dados de créditos de carbono, tokenização on-chain e grãos.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(carbon.router)
app.include_router(tokens.router)
app.include_router(grains.router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}
