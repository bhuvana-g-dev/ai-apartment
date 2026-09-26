"""Business logic for categories."""


def resolve_slug(slug: str, categories: list[dict]) -> dict | None:
    """Find the category whose slug matches the given slug (case-insensitive)."""
    slug_lower = slug.lower()
    for cat in categories:
        if cat.get("slug", "").lower() == slug_lower:
            return cat
    return None
