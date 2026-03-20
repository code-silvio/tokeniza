"""Router /api/carbon — Crédito de Carbono Global (Verra + Gold Standard + preços)."""

from fastapi import APIRouter
from services.verra import (
    get_carbon_summary,
    get_carbon_by_type,
    get_carbon_by_country,
    get_carbon_price_history,
    get_verra_projects,
)

router = APIRouter(prefix="/api/carbon", tags=["carbon"])


@router.get("/summary")
async def carbon_summary():
    return await get_carbon_summary()


@router.get("/by-type")
async def carbon_by_type():
    return await get_carbon_by_type()


@router.get("/by-country")
async def carbon_by_country():
    return await get_carbon_by_country()


@router.get("/price-history")
async def carbon_price_history():
    return await get_carbon_price_history()


@router.get("/projects")
async def carbon_projects():
    return await get_verra_projects()
