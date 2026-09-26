# Skill: Add a New AI Tool Record

## Purpose
Add a new tool entry to `backend/scripts/seed_tools.py` following the exact data model schema.

## Instructions

When asked to add a new AI tool, follow these steps:

1. **Gather all required fields** — ask for any missing required information:
   - Tool name and official website URL
   - Which category it belongs to (must be a valid category_id)
   - Pricing type (must be one of the four exact labels)
   - Whether it has a free tier; if yes, what are the limits
   - Key capabilities, input types, output types
   - Best use cases and limitations

2. **Determine the tool ID** — use a lowercase-hyphenated slug (e.g., `gemini`, `dall-e-3`, `whisper`)

3. **Build the tool dict** following the exact schema in `ai-apartment-context.md`

4. **Add it to the TOOLS list** in `backend/scripts/seed_tools.py` — append after the last entry, before the closing `]`

5. **Verify the entry** — check that:
   - `pricing_type` is exactly one of the four permitted values
   - `free_tier_details` is `None` if `free_availability` is `False`
   - `verified_date` is today's date in YYYY-MM-DD format
   - `active` is `True`

6. **Tell the user the seed command:**
   ```
   cd backend
   venv\Scripts\python.exe -m scripts.seed_tools
   ```

## Example Output

```python
{
    "id": "gemini",
    "name": "Gemini",
    "description": "Google's multimodal AI assistant available via web, mobile, and API. Supports text, image, audio, and video inputs.",
    "category_id": "chat-ai",
    "website_url": "https://gemini.google.com",
    "pricing_type": "Freemium",
    "free_availability": True,
    "free_tier_details": {
        "credits": None,
        "generation_limit": None,
        "daily_limit": "Limited requests on Gemini Pro in free tier",
        "monthly_limit": None,
        "has_watermark": False,
        "watermark_details": None,
        "feature_restrictions": "Gemini Advanced requires Google One subscription",
        "api_restrictions": "API free tier: 15 requests/minute, 1 million tokens/day",
        "commercial_use_allowed": True,
    },
    "capabilities": ["text generation", "image understanding", "code generation", "multimodal reasoning"],
    "input_types": ["text", "image", "audio", "video"],
    "output_types": ["text"],
    "watermark_info": None,
    "api_available": True,
    "best_use_cases": ["multimodal Q&A", "document analysis", "coding", "research"],
    "limitations": ["Gemini Advanced requires paid plan", "some features region-locked"],
    "verified_date": "2025-09-25",
    "active": True,
},
```
