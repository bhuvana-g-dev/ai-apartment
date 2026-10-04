# Skill: Add a New AI Tool Record

## Purpose

Add a complete, validated tool entry to `backend/scripts/seed_tools.py` following the exact 17-field data model.

---

## When to Use This Skill

Use this skill when the user says any of:
- "Add a new tool"
- "Seed a new AI tool"
- "Add [tool name] to the catalogue"
- "I want to add [tool name]"

---

## Step-by-Step Instructions

### Step 1 — Gather Required Information

Ask for any missing required information before writing any code:

**Must have (always):**
- Tool name and official website URL
- Category — must be one of the 13 valid `category_id` slugs
- Pricing type — must be one of the four exact labels
- `free_availability` — True or False

**Must have if `free_availability` is True:**
- Generation/credit/daily/monthly limits (if any)
- Whether it adds a watermark
- API rate limits on the free tier (if applicable)
- Whether commercial use is allowed on the free tier

**Should gather:**
- Capabilities (what the tool does — short lowercase phrases)
- Input types and output types
- Best use cases
- Limitations (honest, factual)

### Step 2 — Determine the Tool ID

Create a lowercase hyphenated slug that matches the tool's canonical name:

| Tool Name | Correct ID |
|---|---|
| ChatGPT | `chatgpt` |
| DALL·E 3 | `dall-e-3` |
| Whisper | `whisper` |
| Stable Diffusion | `stable-diffusion` |
| Adobe Firefly | `adobe-firefly` |
| ElevenLabs | `elevenlabs` |

Rules:
- All lowercase
- Hyphens between words (no underscores, no spaces)
- No version numbers unless the tool is version-specific (e.g. `dall-e-3` is its own product)
- Keep it short — match the URL slug if the tool has one

### Step 3 — Build the Tool Dict

Use this exact template:

```python
{
    "id": "tool-slug",
    "name": "Tool Name",
    "description": "One to three sentence description of what the tool does, who it's for, and what makes it notable.",
    "category_id": "valid-category-slug",
    "website_url": "https://example.com",
    "pricing_type": "Freemium",          # Must be one of the four exact labels
    "free_availability": True,
    "free_tier_details": {
        "credits": None,                 # e.g. "100 credits/month" or None
        "generation_limit": None,        # e.g. "25 images/month" or None
        "daily_limit": None,             # e.g. "10 requests/day" or None
        "monthly_limit": None,           # e.g. "50 requests/month" or None
        "has_watermark": False,
        "watermark_details": None,
        "feature_restrictions": None,    # What requires payment
        "api_restrictions": None,        # Free API rate limits if any
        "commercial_use_allowed": True,
    },
    "capabilities": ["capability one", "capability two", "capability three"],
    "input_types": ["text", "image"],
    "output_types": ["text"],
    "watermark_info": None,
    "api_available": True,
    "best_use_cases": ["use case one", "use case two"],
    "limitations": ["limitation one", "limitation two"],
    "verified_date": "YYYY-MM-DD",       # Today's date
    "active": True,
},
```

**When `free_availability` is False:**
```python
"free_availability": False,
"free_tier_details": None,              # Must be None — never an object
```

### Step 4 — Add to the Seed Script

Open `backend/scripts/seed_tools.py` and append the new dict **inside the TOOLS list**, after the last existing entry and before the closing `]`.

Check the end of the file looks like:
```python
    # ... last existing tool ...
    {
        "id": "last-tool",
        # ...
    },
    # ← INSERT NEW TOOL HERE
]
```

### Step 5 — Validate Before Saving

Run through this checklist mentally before writing the file:

- [ ] `id` is a unique lowercase hyphenated slug
- [ ] `category_id` is one of the 13 valid slugs exactly as listed
- [ ] `pricing_type` is one of: `"Completely Free"` / `"Freemium"` / `"Free Trial"` / `"Paid Only"`
- [ ] If `free_availability` is `False`, `free_tier_details` is `None` (not `{}`)
- [ ] If `free_availability` is `True`, `free_tier_details` is a dict (not `None`)
- [ ] `verified_date` is today's date in `YYYY-MM-DD` format
- [ ] `active` is `True`
- [ ] `website_url` starts with `https://`
- [ ] `capabilities`, `input_types`, `output_types`, `best_use_cases`, `limitations` are all lists of strings

### Step 6 — Tell the User to Run the Seed Script

After saving, output this exact command:

```powershell
# From the ai-apartment root directory:
cd backend
venv\Scripts\python.exe -m scripts.seed_tools
```

---

## Full Example — Gemini

```python
{
    "id": "gemini",
    "name": "Gemini",
    "description": "Google's multimodal AI assistant available via web, mobile, and API. Supports text, image, audio, and video inputs with strong reasoning and coding capabilities.",
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
        "feature_restrictions": "Gemini Advanced (2.0 Ultra) requires Google One AI Premium subscription",
        "api_restrictions": "API free tier: 15 requests/minute, 1 million tokens/day on Gemini 1.5 Flash",
        "commercial_use_allowed": True,
    },
    "capabilities": [
        "text generation", "image understanding", "code generation",
        "multimodal reasoning", "document analysis", "web search"
    ],
    "input_types": ["text", "image", "audio", "video"],
    "output_types": ["text"],
    "watermark_info": None,
    "api_available": True,
    "best_use_cases": [
        "multimodal Q&A", "document analysis", "coding assistance",
        "research summarisation", "image description"
    ],
    "limitations": [
        "Gemini Advanced requires paid Google One subscription",
        "Some features are region-locked",
        "Free tier has rate limits on Gemini Pro models"
    ],
    "verified_date": "2025-09-25",
    "active": True,
},
```

---

## Full Example — Paid Only Tool

```python
{
    "id": "jasper",
    "name": "Jasper",
    "description": "AI writing platform for marketing teams. Generates long-form content, ad copy, product descriptions, and social posts with brand voice customisation.",
    "category_id": "writing-ai",
    "website_url": "https://www.jasper.ai",
    "pricing_type": "Paid Only",
    "free_availability": False,
    "free_tier_details": None,
    "capabilities": [
        "long-form content generation", "ad copy", "product descriptions",
        "brand voice customisation", "SEO content", "social media posts"
    ],
    "input_types": ["text"],
    "output_types": ["text"],
    "watermark_info": None,
    "api_available": True,
    "best_use_cases": [
        "marketing copy", "blog posts", "email campaigns",
        "product descriptions", "social media content"
    ],
    "limitations": [
        "No free tier — paid plans start at $49/month",
        "Outputs require human review for accuracy",
        "Brand voice setup takes time"
    ],
    "verified_date": "2025-09-25",
    "active": True,
},
```
