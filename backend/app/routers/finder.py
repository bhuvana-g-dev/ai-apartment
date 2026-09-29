"""
Router: /finder
Task-based AI Finder — given a natural language task description,
return ranked tool recommendations with reasoning.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.db.tools_db import fetch_tools
from app.services.tools_service import rank_search_results

router = APIRouter(prefix="/finder", tags=["finder"])


class FinderRequest(BaseModel):
    task: str = Field(..., min_length=5, max_length=500, description="Natural language task description")


class ToolRecommendation(BaseModel):
    tool: dict
    score: int
    reasoning: str


class FinderResponse(BaseModel):
    task: str
    recommendations: list[ToolRecommendation]
    total: int


# Keyword → category hints
_TASK_CATEGORY_HINTS: dict[str, list[str]] = {
    "video": ["video-generation"],
    "film": ["video-generation"],
    "clip": ["video-generation"],
    "animate": ["video-generation"],
    "image": ["image-generation"],
    "photo": ["image-generation"],
    "picture": ["image-generation"],
    "illustration": ["image-generation"],
    "logo": ["image-generation", "design-ai"],
    "design": ["design-ai", "image-generation"],
    "ui": ["design-ai", "coding-ai"],
    "ux": ["design-ai"],
    "wireframe": ["design-ai"],
    "mockup": ["design-ai"],
    "code": ["coding-ai"],
    "program": ["coding-ai"],
    "develop": ["coding-ai"],
    "build": ["coding-ai"],
    "app": ["coding-ai"],
    "website": ["coding-ai", "design-ai"],
    "write": ["writing-ai", "chat-ai"],
    "blog": ["writing-ai"],
    "article": ["writing-ai"],
    "essay": ["writing-ai"],
    "copy": ["writing-ai"],
    "email": ["writing-ai", "productivity-ai"],
    "music": ["music-generation"],
    "song": ["music-generation"],
    "soundtrack": ["music-generation"],
    "beat": ["music-generation"],
    "voice": ["voice-audio"],
    "speech": ["voice-audio"],
    "narrate": ["voice-audio"],
    "podcast": ["voice-audio", "music-generation"],
    "transcribe": ["voice-audio", "document-ai"],
    "translate": ["translation-ai"],
    "language": ["translation-ai", "chat-ai"],
    "research": ["research-ai", "chat-ai"],
    "paper": ["research-ai", "document-ai"],
    "summarise": ["document-ai", "research-ai", "productivity-ai"],
    "summarize": ["document-ai", "research-ai", "productivity-ai"],
    "pdf": ["document-ai"],
    "document": ["document-ai"],
    "meeting": ["productivity-ai"],
    "schedule": ["productivity-ai"],
    "automate": ["ai-agents", "productivity-ai"],
    "agent": ["ai-agents"],
    "workflow": ["ai-agents", "productivity-ai"],
    "chat": ["chat-ai"],
    "question": ["chat-ai", "research-ai"],
    "answer": ["chat-ai", "research-ai"],
}

# Free-related keywords
_FREE_KEYWORDS = {"free", "freemium", "no cost", "without paying", "budget", "cheap", "affordable"}


def _detect_free_requirement(task: str) -> bool:
    task_lower = task.lower()
    return any(kw in task_lower for kw in _FREE_KEYWORDS)


def _detect_no_watermark(task: str) -> bool:
    return "watermark" in task.lower() and ("no " in task.lower() or "without" in task.lower())


def _detect_api_requirement(task: str) -> bool:
    return "api" in task.lower() or "integrate" in task.lower() or "programmatically" in task.lower()


def _generate_reasoning(tool: dict, task: str, wants_free: bool, wants_no_watermark: bool, wants_api: bool) -> str:
    reasons = []
    task_lower = task.lower()

    # Category match reason
    cat = tool.get("category_id", "").replace("-", " ")
    reasons.append(f"This tool is in the {cat} category which matches your task.")

    # Free tier reason
    if wants_free:
        pt = tool.get("pricing_type", "")
        if pt == "Completely Free":
            reasons.append("It is completely free with no usage limits.")
        elif pt == "Freemium":
            ftd = tool.get("free_tier_details", {}) or {}
            limit_note = ftd.get("daily_limit") or ftd.get("monthly_limit") or ftd.get("credits")
            if limit_note:
                reasons.append(f"It has a free tier: {limit_note}.")
            else:
                reasons.append("It has a free tier available.")

    # Watermark reason
    if wants_no_watermark:
        ftd = tool.get("free_tier_details", {}) or {}
        hw = ftd.get("has_watermark") if isinstance(ftd, dict) else None
        if hw is False:
            reasons.append("The free tier does not add a watermark.")
        elif hw is True:
            reasons.append("Note: the free tier adds a watermark — a paid plan removes it.")

    # API reason
    if wants_api and tool.get("api_available"):
        reasons.append("It provides an API for programmatic integration.")

    # Capability match
    caps = tool.get("capabilities", [])
    task_words = set(task_lower.split())
    matched_caps = [c for c in caps if any(w in c.lower() for w in task_words)]
    if matched_caps:
        reasons.append(f"Relevant capabilities: {', '.join(matched_caps[:3])}.")

    # Use cases
    use_cases = tool.get("best_use_cases", [])
    matched_uses = [u for u in use_cases if any(w in u.lower() for w in task_words)]
    if matched_uses:
        reasons.append(f"Best for: {matched_uses[0]}.")

    return " ".join(reasons) if reasons else f"{tool.get('name')} is relevant to your task."


@router.post("", response_model=FinderResponse)
async def find_tools_for_task(body: FinderRequest):
    """
    Given a natural language task description, return ranked tool recommendations
    with reasoning explaining why each tool matches.
    """
    task = body.task.strip()
    if not task:
        raise HTTPException(status_code=422, detail="Task description must not be empty")

    task_lower = task.lower()
    wants_free = _detect_free_requirement(task)
    wants_no_watermark = _detect_no_watermark(task)
    wants_api = _detect_api_requirement(task)

    # Detect category hints from task keywords
    hinted_categories: set[str] = set()
    for keyword, cats in _TASK_CATEGORY_HINTS.items():
        if keyword in task_lower:
            hinted_categories.update(cats)

    # Fetch all active tools
    all_tools, _ = fetch_tools(limit=500, offset=0)

    # Score each tool
    scored: list[tuple[int, dict]] = []
    for tool in all_tools:
        score = 0

        # Category hint bonus
        if tool.get("category_id") in hinted_categories:
            score += 200

        # Word-level relevance scoring
        task_words = task_lower.split()
        for word in task_words:
            if word in tool.get("name", "").lower():
                score += 80
            if any(word in c.lower() for c in tool.get("capabilities", [])):
                score += 40
            if any(word in u.lower() for u in tool.get("best_use_cases", [])):
                score += 30
            if word in tool.get("description", "").lower():
                score += 10

        # Free tier bonus
        if wants_free:
            pt = tool.get("pricing_type", "")
            if pt == "Completely Free":
                score += 150
            elif pt in ("Freemium", "Free Trial") and tool.get("free_availability"):
                score += 80
            elif pt == "Paid Only":
                score -= 100

        # No watermark bonus
        if wants_no_watermark:
            ftd = tool.get("free_tier_details", {}) or {}
            hw = ftd.get("has_watermark") if isinstance(ftd, dict) else None
            if hw is False:
                score += 50
            elif hw is True:
                score -= 30

        # API bonus
        if wants_api and tool.get("api_available"):
            score += 60

        if score > 0:
            scored.append((score, tool))

    scored.sort(key=lambda x: x[0], reverse=True)
    top = scored[:6]

    recommendations = [
        ToolRecommendation(
            tool=t,
            score=s,
            reasoning=_generate_reasoning(t, task, wants_free, wants_no_watermark, wants_api),
        )
        for s, t in top
    ]

    return FinderResponse(task=task, recommendations=recommendations, total=len(recommendations))
