"""Router: /tools/search — must be registered BEFORE /tools/{tool_id}"""

from fastapi import APIRouter, Query, HTTPException
from app.db.tools_db import fetch_tools
from app.services.tools_service import rank_search_results
from app.models.tool import ToolRecord
from app.models.responses import PaginatedResponse

router = APIRouter(tags=["search"])


@router.get("/tools/search", response_model=PaginatedResponse[ToolRecord])
async def search_tools(q: str = Query(...)):
    if not q or not q.strip():
        raise HTTPException(
            status_code=422,
            detail="Query parameter 'q' is required and must not be empty",
        )
    if len(q) > 200:
        raise HTTPException(status_code=422, detail="Query parameter 'q' must not exceed 200 characters")

    # Reuse fetch_tools() which serves from the in-memory cache —
    # no separate Firestore scan needed. Pass a large limit to get all active tools.
    all_tools, _ = fetch_tools(limit=10_000, offset=0)
    results = rank_search_results(all_tools, q)
    return PaginatedResponse(data=results, total=len(results), limit=50, offset=0)
