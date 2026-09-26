"""Router: /tools/search — must be registered BEFORE /tools/{tool_id}"""

from fastapi import APIRouter, Query, HTTPException
from app.db.tools_db import fetch_tool_by_id
from app.db.firestore_client import get_db
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

    # Fetch all active tools from Firestore
    db = get_db()
    all_tools = [
        {"id": doc.id, **doc.to_dict()}
        for doc in db.collection("tools").stream()
        if doc.to_dict().get("active", False)
    ]
    results = rank_search_results(all_tools, q)
    return PaginatedResponse(data=results, total=len(results), limit=50, offset=0)
