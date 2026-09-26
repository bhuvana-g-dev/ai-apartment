"""Router: /tools"""

from typing import Optional, Literal
from fastapi import APIRouter, HTTPException, Query
from app.db.tools_db import fetch_tools, fetch_tool_by_id, write_tool, update_tool
from app.models.tool import ToolRecord, ToolCreate, ToolUpdate, PRICING_TYPES
from app.models.responses import PaginatedResponse
from uuid import uuid4

router = APIRouter(prefix="/tools", tags=["tools"])

VALID_PRICING_TYPES = {"Completely Free", "Freemium", "Free Trial", "Paid Only"}


@router.get("", response_model=PaginatedResponse[ToolRecord])
async def list_tools(
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    category_id: Optional[str] = None,
    pricing_type: Optional[str] = None,
    free_availability: Optional[bool] = None,
    capabilities: Optional[str] = None,  # comma-separated
    input_type: Optional[str] = None,
    output_type: Optional[str] = None,
    api_available: Optional[bool] = None,
    has_watermark: Optional[bool] = None,
):
    if pricing_type and pricing_type not in VALID_PRICING_TYPES:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid pricing_type '{pricing_type}'. Must be one of: {sorted(VALID_PRICING_TYPES)}",
        )
    filters = {
        "category_id": category_id,
        "pricing_type": pricing_type,
        "free_availability": free_availability,
        "capabilities": [c.strip() for c in capabilities.split(",")] if capabilities else None,
        "input_type": input_type,
        "output_type": output_type,
        "api_available": api_available,
        "has_watermark": has_watermark,
    }
    # Remove None entries
    filters = {k: v for k, v in filters.items() if v is not None}
    tools, total = fetch_tools(filters=filters, limit=limit, offset=offset)
    return PaginatedResponse(data=tools, total=total, limit=limit, offset=offset)


@router.get("/{tool_id}", response_model=ToolRecord)
async def get_tool(tool_id: str):
    tool = fetch_tool_by_id(tool_id)
    if not tool or not tool.get("active", False):
        raise HTTPException(status_code=404, detail=f"Tool '{tool_id}' not found")
    return tool


@router.post("", response_model=ToolRecord, status_code=201)
async def create_tool(body: ToolCreate):
    tool_id = str(uuid4())
    data = body.model_dump()
    data["id"] = tool_id
    write_tool(data)
    return {**data, "id": tool_id}


@router.patch("/{tool_id}", response_model=ToolRecord)
async def patch_tool(tool_id: str, body: ToolUpdate):
    existing = fetch_tool_by_id(tool_id)
    if not existing:
        raise HTTPException(status_code=404, detail=f"Tool '{tool_id}' not found")
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if updates:
        update_tool(tool_id, updates)
    return {**existing, **updates}
