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


# Simple synonym map — expand as needed
_SYNONYMS: dict[str, list[str]] = {
    "video": ["video", "film", "clip", "animation", "movie"],
    "image": ["image", "photo", "picture", "illustration", "art"],
    "music": ["music", "audio", "song", "melody", "track", "sound"],
    "write": ["write", "writing", "text", "content", "blog", "copy"],
    "code": ["code", "coding", "programming", "developer", "software"],
    "voice": ["voice", "speech", "tts", "speak", "narration", "audio"],
    "chat": ["chat", "conversation", "assistant", "dialogue", "talk"],
    "translate": ["translate", "translation", "language", "multilingual"],
    "search": ["search", "research", "find", "discover", "explore"],
    "design": ["design", "ui", "ux", "graphic", "visual", "logo"],
    "free": ["free", "freemium", "open-source", "open source"],
    "document": ["document", "pdf", "doc", "file", "paper"],
    "agent": ["agent", "autonomous", "automation", "workflow"],
}


def _expand_terms(word: str) -> list[str]:
    """Return the word plus any synonyms."""
    word = word.lower()
    return _SYNONYMS.get(word, [word])


def rank_search_results(tools: list[dict], query: str) -> list[dict]:
    """
    Word-level case-insensitive search with synonym expansion.
    Multi-word queries work: each word is matched independently.
    Max 50 results ordered by relevance score.
    """
    raw_words = query.lower().strip().split()
    if not raw_words:
        return []

    # Expand each word with synonyms
    term_groups: list[list[str]] = [_expand_terms(w) for w in raw_words]

    def field_contains_any(field_val: str, terms: list[str]) -> bool:
        fv = field_val.lower()
        return any(t in fv for t in terms)

    def list_contains_any(items: list[str], terms: list[str]) -> bool:
        return any(field_contains_any(item, terms) for item in items)

    scored: list[tuple[int, dict]] = []
    for tool in tools:
        if not tool.get("active", False):
            continue
        score = 0
        for terms in term_groups:
            # Name match — highest weight
            if field_contains_any(tool.get("name", ""), terms):
                score += 100
            # Capabilities match
            if list_contains_any(tool.get("capabilities", []), terms):
                score += 50
            # Best use cases match
            if list_contains_any(tool.get("best_use_cases", []), terms):
                score += 40
            # Category match
            if field_contains_any(tool.get("category_id", ""), terms):
                score += 30
            # Description match
            if field_contains_any(tool.get("description", ""), terms):
                score += 10
            # Input/output types
            if list_contains_any(tool.get("input_types", []), terms):
                score += 5
            if list_contains_any(tool.get("output_types", []), terms):
                score += 5

        if score > 0:
            scored.append((score, tool))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [t for _, t in scored[:50]]
