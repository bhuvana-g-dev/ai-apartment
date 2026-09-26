# Skill: Add a New AI Tool Record

## Purpose
Add a new tool entry to `backend/scripts/seed_tools.py` following the exact data model schema.

## When to use this skill
Use this skill when asked to add a new AI tool to the AI Apartment catalogue.

## Steps

1. Gather all required fields:
   - Tool name and official website URL
   - Which category it belongs to (must match a valid category_id slug)
   - Pricing type — must be exactly one of: "Completely Free", "Freemium", "Free Trial", "Paid Only"
   - Whether it has a free tier; if yes, what are the specific limits
   - Key capabilities, input types, output types
   - Best use cases and known limitations

2. Determine the tool ID — use a lowercase hyphenated slug (e.g., `gemini`, `dall-e-3`)

3. Build the tool dict following the schema in `backend/app/models/tool.py`

4. Append to the TOOLS list in `backend/scripts/seed_tools.py`

5. Verify:
   - `pricing_type` is exactly one of the four permitted values
   - `free_tier_details` is `None` when `free_availability` is `False`
   - `verified_date` is today's date in YYYY-MM-DD format
   - `active` is `True`

6. Seed command:
   ```
   cd backend
   venv\Scripts\python.exe -m scripts.seed_tools
   ```

## Schema reference
See `backend/app/models/tool.py` for the full Pydantic model.
Valid category IDs: chat-ai, writing-ai, research-ai, image-generation, video-generation, voice-audio, music-generation, coding-ai, design-ai, productivity-ai, document-ai, translation-ai, ai-agents
