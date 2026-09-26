"""
Property-based tests for AI Apartment backend business logic.
Uses Hypothesis to verify correctness properties defined in design.md.

Run with:  cd backend && python -m pytest tests/test_properties.py -v
"""

import pytest
from hypothesis import given, settings, assume
from hypothesis import strategies as st

# ---------------------------------------------------------------------------
# Import the pure business logic functions under test.
# These have no Firestore dependency — they operate on plain Python dicts.
# ---------------------------------------------------------------------------
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.services.tools_service import apply_filters, paginate, rank_search_results


# ---------------------------------------------------------------------------
# Strategies
# ---------------------------------------------------------------------------

PRICING_TYPES = ["Completely Free", "Freemium", "Free Trial", "Paid Only"]

tool_strategy = st.fixed_dictionaries({
    "id": st.text(min_size=1, max_size=20),
    "name": st.text(min_size=1, max_size=50),
    "description": st.text(min_size=1, max_size=200),
    "category_id": st.sampled_from(["chat-ai", "coding-ai", "image-generation", "music-generation"]),
    "pricing_type": st.sampled_from(PRICING_TYPES),
    "free_availability": st.booleans(),
    "api_available": st.booleans(),
    "active": st.booleans(),
    "capabilities": st.lists(st.sampled_from(["text", "image", "audio", "video", "code"]), max_size=5),
    "input_types": st.lists(st.sampled_from(["text", "image", "audio"]), max_size=3),
    "output_types": st.lists(st.sampled_from(["text", "image", "audio", "video"]), max_size=3),
    "best_use_cases": st.lists(st.text(min_size=1, max_size=30), max_size=3),
    "limitations": st.lists(st.text(min_size=1, max_size=30), max_size=3),
    "watermark_info": st.one_of(st.none(), st.text(max_size=50)),
    "verified_date": st.just("2025-01-01"),
    "free_tier_details": st.one_of(
        st.none(),
        st.fixed_dictionaries({
            "has_watermark": st.one_of(st.none(), st.booleans()),
            "credits": st.none(),
            "generation_limit": st.none(),
            "daily_limit": st.none(),
            "monthly_limit": st.none(),
            "watermark_details": st.none(),
            "feature_restrictions": st.none(),
            "api_restrictions": st.none(),
            "commercial_use_allowed": st.one_of(st.none(), st.booleans()),
        })
    ),
    "website_url": st.just("https://example.com"),
})

catalogue_strategy = st.lists(tool_strategy, min_size=0, max_size=30)


# ---------------------------------------------------------------------------
# Property 2: Pagination covers all tools exactly once
# ---------------------------------------------------------------------------
@settings(max_examples=100)
@given(
    items=st.lists(st.integers(), min_size=0, max_size=50),
    limit=st.integers(min_value=1, max_value=20),
)
def test_pagination_covers_all_items_exactly_once(items, limit):
    """
    For any list of N items and page size L, paginating through all pages
    collects every item exactly once with no duplicates and no omissions.

    Property 2 from design.md — Validates: Requirements 3.2, 10.9, 10.10
    """
    collected = []
    offset = 0
    total = len(items)

    while True:
        page, page_total = paginate(items, limit, offset)
        assert page_total == total, "total must never change across pages"
        collected.extend(page)
        offset += limit
        if offset >= total:
            break

    assert collected == items, "Paginating through all pages must recover the original list exactly"


# ---------------------------------------------------------------------------
# Property 3: Filter AND semantics
# ---------------------------------------------------------------------------
@settings(max_examples=100)
@given(
    tools=catalogue_strategy,
    category=st.sampled_from(["chat-ai", "coding-ai", "image-generation", "music-generation"]),
    pricing=st.sampled_from(PRICING_TYPES),
)
def test_filter_and_semantics(tools, category, pricing):
    """
    When multiple filters are applied, every returned tool satisfies ALL filters
    simultaneously (logical AND).

    Property 3 from design.md — Validates: Requirements 6.4
    """
    filters = {"category_id": category, "pricing_type": pricing}
    result = apply_filters(tools, filters)

    for tool in result:
        assert tool["category_id"] == category, (
            f"Tool {tool['id']} has category {tool['category_id']!r}, expected {category!r}"
        )
        assert tool["pricing_type"] == pricing, (
            f"Tool {tool['id']} has pricing_type {tool['pricing_type']!r}, expected {pricing!r}"
        )


# ---------------------------------------------------------------------------
# Property 4: Capabilities filter is monotonically narrowing
# ---------------------------------------------------------------------------
@settings(max_examples=100)
@given(
    tools=catalogue_strategy,
    caps=st.lists(
        st.sampled_from(["text", "image", "audio", "video", "code"]),
        min_size=1, max_size=3,
        unique=True,
    ),
)
def test_capabilities_filter_monotonically_narrowing(tools, caps):
    """
    Adding more capability constraints can only reduce or keep the result set —
    never expand it.

    Property 4 from design.md — Validates: Requirements 6.5
    """
    results = []
    for k in range(1, len(caps) + 1):
        subset = caps[:k]
        result = apply_filters(tools, {"capabilities": subset})
        results.append(len(result))

    for i in range(1, len(results)):
        assert results[i] <= results[i - 1], (
            f"Adding capability constraint expanded results: {results[i-1]} → {results[i]}"
        )


# ---------------------------------------------------------------------------
# Property 5: Search only returns active tools
# ---------------------------------------------------------------------------
@settings(max_examples=100)
@given(
    tools=catalogue_strategy,
    query=st.text(min_size=1, max_size=10, alphabet=st.characters(whitelist_categories=("Ll",))),
)
def test_search_only_returns_active_tools(tools, query):
    """
    Every tool returned by rank_search_results has active=True.

    Property 5 from design.md — Validates: Requirements 5.7
    """
    assume(query.strip())
    results = rank_search_results(tools, query)
    for tool in results:
        assert tool.get("active") is True, (
            f"Inactive tool {tool['id']!r} appeared in search results for query {query!r}"
        )


# ---------------------------------------------------------------------------
# Property 6: Pricing type label invariant
# ---------------------------------------------------------------------------
@settings(max_examples=100)
@given(tools=catalogue_strategy)
def test_pricing_type_label_invariant(tools):
    """
    Every tool returned by apply_filters (with no filters) has pricing_type
    in the four permitted values.

    Property 6 from design.md — Validates: Requirements 7.1, 3.1
    """
    result = apply_filters(tools, {})
    for tool in result:
        assert tool["pricing_type"] in PRICING_TYPES, (
            f"Tool {tool['id']!r} has invalid pricing_type: {tool['pricing_type']!r}"
        )


# ---------------------------------------------------------------------------
# Property 11: Search case-insensitivity
# ---------------------------------------------------------------------------
@settings(max_examples=50)
@given(
    tools=catalogue_strategy,
    query=st.text(min_size=2, max_size=8, alphabet=st.characters(whitelist_categories=("Ll",))),
)
def test_search_case_insensitive(tools, query):
    """
    For any query Q, searching with Q.lower(), Q.upper(), and Q.title()
    returns the same set of tool IDs.

    Property 11 from design.md — Validates: Requirements 5.10
    """
    assume(query.strip())
    ids_lower = {t["id"] for t in rank_search_results(tools, query.lower())}
    ids_upper = {t["id"] for t in rank_search_results(tools, query.upper())}
    ids_title = {t["id"] for t in rank_search_results(tools, query.title())}
    assert ids_lower == ids_upper == ids_title, (
        f"Case variants returned different results for query {query!r}: "
        f"lower={ids_lower}, upper={ids_upper}, title={ids_title}"
    )


# ---------------------------------------------------------------------------
# Property 13: Search result count upper bound
# ---------------------------------------------------------------------------
@settings(max_examples=100)
@given(
    tools=st.lists(tool_strategy, min_size=0, max_size=100),
    query=st.text(min_size=1, max_size=5, alphabet=st.characters(whitelist_categories=("Ll",))),
)
def test_search_result_count_upper_bound(tools, query):
    """
    search returns at most 50 results regardless of catalogue size.

    Property 13 from design.md — Validates: Requirements 5.11
    """
    assume(query.strip())
    results = rank_search_results(tools, query)
    assert len(results) <= 50, f"search returned {len(results)} results, expected ≤ 50"
