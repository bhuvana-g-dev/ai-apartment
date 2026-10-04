"""Firestore access layer for the tools collection. No business logic here."""

import time
from app.db.firestore_client import get_db

# ---------------------------------------------------------------------------
# In-memory TTL cache for the full active tools list.
# Avoids a full Firestore collection scan on every request.
# TTL = 60 seconds — short enough to reflect data updates quickly.
# ---------------------------------------------------------------------------
_CACHE_TTL = 60  # seconds

_tools_cache: list[dict] = []
_tools_cache_ts: float = 0.0


def _is_cache_valid() -> bool:
    return bool(_tools_cache) and (time.monotonic() - _tools_cache_ts) < _CACHE_TTL


def invalidate_tools_cache() -> None:
    """Call this after any write/update so the next read sees fresh data."""
    global _tools_cache, _tools_cache_ts
    _tools_cache = []
    _tools_cache_ts = 0.0


def _load_all_active_tools() -> list[dict]:
    """
    Fetch all active tools from Firestore, using the cache when fresh.
    Uses a Firestore .where() predicate to skip inactive documents server-side.
    """
    global _tools_cache, _tools_cache_ts

    if _is_cache_valid():
        return _tools_cache

    db = get_db()
    docs = (
        db.collection("tools")
        .where("active", "==", True)
        .stream()
    )
    result = []
    for doc in docs:
        data = doc.to_dict()
        if data is not None:
            result.append({"id": doc.id, **data})

    _tools_cache = result
    _tools_cache_ts = time.monotonic()
    return result


def _doc_to_tool(doc) -> dict:
    """Convert a Firestore document snapshot to a tool dict."""
    data = doc.to_dict()
    if data is None:
        return None
    return {"id": doc.id, **data}


def fetch_tools(filters: dict | None = None, limit: int = 20, offset: int = 0) -> tuple[list[dict], int]:
    """
    Return a page of active tools with optional in-Python filtering.

    The full active-tool list is loaded once and cached for _CACHE_TTL seconds,
    so repeated requests (pagination, filter changes) hit memory, not Firestore.
    """
    docs = list(_load_all_active_tools())  # copy — we may sort/filter in-place

    if filters:
        from app.services.tools_service import apply_filters
        docs = apply_filters(docs, filters)

    total = len(docs)
    docs.sort(key=lambda d: d.get("name", "").lower())
    return docs[offset: offset + limit], total


def fetch_tool_by_id(tool_id: str) -> dict | None:
    """Fetch a single tool document by Firestore document ID."""
    db = get_db()
    doc = db.collection("tools").document(tool_id).get()
    if not doc.exists:
        return None
    return _doc_to_tool(doc)


def write_tool(data: dict) -> str:
    """Write a new tool document; returns the document ID. Invalidates cache."""
    db = get_db()
    tool_id = data.get("id")
    if tool_id:
        db.collection("tools").document(tool_id).set(data)
    else:
        _, ref = db.collection("tools").add(data)
        tool_id = ref.id
    invalidate_tools_cache()
    return tool_id


def update_tool(tool_id: str, data: dict) -> None:
    """Partial update of a tool document. Invalidates cache."""
    db = get_db()
    db.collection("tools").document(tool_id).update(data)
    invalidate_tools_cache()
