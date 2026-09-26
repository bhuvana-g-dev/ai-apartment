"""Firestore access layer for the tools collection. No business logic here."""

from app.db.firestore_client import get_db


def fetch_tools(filters: dict | None = None, limit: int = 20, offset: int = 0) -> tuple[list[dict], int]:
    """Fetch active tools from Firestore, return (docs, total_count)."""
    db = get_db()
    ref = db.collection("tools")
    docs = [{"id": doc.id, **doc.to_dict()} for doc in ref.stream() if doc.to_dict().get("active", False)]
    # Apply filters in Python (Firestore free tier doesn't support complex multi-field queries)
    if filters:
        from app.services.tools_service import apply_filters
        docs = apply_filters(docs, filters)
    total = len(docs)
    # Sort alphabetically by name
    docs.sort(key=lambda d: d.get("name", "").lower())
    return docs[offset: offset + limit], total


def fetch_tool_by_id(tool_id: str) -> dict | None:
    """Fetch a single tool document by Firestore document ID."""
    db = get_db()
    doc = db.collection("tools").document(tool_id).get()
    if not doc.exists:
        return None
    return {"id": doc.id, **doc.to_dict()}


def write_tool(data: dict) -> str:
    """Write a new tool document; returns the document ID."""
    db = get_db()
    tool_id = data.get("id")
    if tool_id:
        db.collection("tools").document(tool_id).set(data)
        return tool_id
    else:
        _, ref = db.collection("tools").add(data)
        return ref.id


def update_tool(tool_id: str, data: dict) -> None:
    """Partial update of a tool document."""
    db = get_db()
    db.collection("tools").document(tool_id).update(data)
