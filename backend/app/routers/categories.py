"""Router: /categories"""

from fastapi import APIRouter, HTTPException
from app.db.categories_db import fetch_categories, fetch_category_by_id
from app.db.tools_db import fetch_tools
from app.models.category import CategoryRecord
from app.models.tool import ToolRecord
from app.models.responses import PaginatedResponse

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=PaginatedResponse[CategoryRecord])
async def list_categories():
    """Return all active categories sorted alphabetically."""
    cats = fetch_categories()
    return PaginatedResponse(data=cats, total=len(cats), limit=len(cats), offset=0)


@router.get("/{category_id}/tools", response_model=PaginatedResponse[ToolRecord])
async def get_tools_for_category(category_id: str):
    """Return all active tools for a given category, sorted alphabetically."""
    cat = fetch_category_by_id(category_id)
    if not cat:
        raise HTTPException(status_code=404, detail=f"Category '{category_id}' not found")
    tools, total = fetch_tools(filters={"category_id": category_id})
    # sort alphabetically
    tools.sort(key=lambda t: t.get("name", "").lower())
    return PaginatedResponse(data=tools, total=total, limit=total, offset=0)
