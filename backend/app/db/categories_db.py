"""Firestore access layer for the categories collection."""

from app.db.firestore_client import get_db


def fetch_categories() -> list[dict]:
    """Fetch all active categories sorted alphabetically by name."""
    db = get_db()
    docs = [
        {"id": doc.id, **doc.to_dict()}
        for doc in db.collection("categories").stream()
        if doc.to_dict().get("active", False)
    ]
    docs.sort(key=lambda d: d.get("name", "").lower())
    return docs


def fetch_category_by_id(category_id: str) -> dict | None:
    """Fetch a single category by document ID."""
    db = get_db()
    doc = db.collection("categories").document(category_id).get()
    if not doc.exists:
        return None
    return {"id": doc.id, **doc.to_dict()}
