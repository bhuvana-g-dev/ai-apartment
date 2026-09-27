"""Firestore access layer for the tools collection. No business logic here."""

from app.db.firestore_client import get_db


def _doc_to_tool(doc) -> dict:
    """Convert a Firestore document snapshot to a tool dict."""
    data = doc.to_dict()
    if data is None:
        return None
    return {"id": doc.id, **data}


def fetch_tools(filters: dict | None = None, limit: int = 20, offset: int = 0) -> tuple[list[dict], int]:
    """Fetch active tools from Firestore, return (page, total_count)."""
    db = get_db()
    docs = []
    for doc in db.collection("tools").stream():
        tool = _doc_to_tool(doc)
        if tool and tool.get("active", False):
            docs.append(tool)

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
