"""Business logic for tools: filtering, pagination, and search ranking."""

from __future__ import annotations


def apply_filters(tools: list[dict], filters: dict) -> list[dict]:
    """Return only tools that satisfy ALL provided filter conditions (AND logic)."""
    result = tools
    for key, value in filters.items():
        if value is None:
            continue
        if key == "category_id":
            result = [t for t in result if t.get("category_id") == value]
        elif key == "pricing_type":
            result = [t for t in result if t.get("pricing_type") == value]
        elif key == "free_availability":
            result = [t for t in result if t.get("free_availability") == value]
        elif key == "api_available":
            result = [t for t in result if t.get("api_available") == value]
        elif key == "has_watermark":
            result = [
                t for t in result
                if _get_has_watermark(t) == value
            ]
        elif key == "capabilities":
            # value is a list; tool must contain ALL specified capabilities (AND)
            cap_list = value if isinstance(value, list) else [value]
            result = [
                t for t in result
                if all(c.lower() in [x.lower() for x in t.get("capabilities", [])] for c in cap_list)
            ]
        elif key == "input_type":
            result = [t for t in result if value.lower() in [x.lower() for x in t.get("input_types", [])]]
        elif key == "output_type":
            result = [t for t in result if value.lower() in [x.lower() for x in t.get("output_types", [])]]
    return result


def _get_has_watermark(tool: dict) -> bool | None:
    ftd = tool.get("free_tier_details")
    if not ftd:
        return None
    if isinstance(ftd, dict):
        return ftd.get("has_watermark")
    # Pydantic model
    return getattr(ftd, "has_watermark", None)


def paginate(items: list, limit: int, offset: int) -> tuple[list, int]:
    """Return (page_slice, total_count)."""
    total = len(items)
    return items[offset: offset + limit], total


def rank_search_results(tools: list[dict], query: str) -> list[dict]:
    """Case-insensitive search across key fields, ranked by relevance. Max 50 results."""
    q = query.lower().strip()
    if not q:
        return []

    scored: list[tuple[int, dict]] = []
    for tool in tools:
        if not tool.get("active", False):
            continue
        score = 0
        if q in tool.get("name", "").lower():
            score += 100
        caps = tool.get("capabilities", [])
        if any(q in c.lower() for c in caps):
            score += 50
        use_cases = tool.get("best_use_cases", [])
        if any(q in u.lower() for u in use_cases):
            score += 30
        if q in tool.get("description", "").lower():
            score += 10
        if q in tool.get("category_id", "").lower():
            score += 5
        if score > 0:
            scored.append((score, tool))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [t for _, t in scored[:50]]
