---
inclusion: always
---

# AI Apartment — Power Context

## What This Power Provides

This power gives Kiro deep context about the AI Apartment project — a web platform for discovering, comparing, and filtering AI tools organized by category.

## Data Model (Tool Record)

Every AI tool in the system has these exact fields:

| Field | Type | Constraint |
|---|---|---|
| `id` | string | document ID in Firestore |
| `name` | string | 1–200 chars |
| `description` | string | 1–2000 chars |
| `category_id` | string | must match a categories document slug |
| `website_url` | string | valid URL |
| `pricing_type` | enum | "Completely Free" \| "Freemium" \| "Free Trial" \| "Paid Only" |
| `free_availability` | boolean | |
| `free_tier_details` | object\|null | see FreeTierDetails below |
| `capabilities` | string[] | max 50 items |
| `input_types` | string[] | max 20 items |
| `output_types` | string[] | max 20 items |
| `watermark_info` | string\|null | max 500 chars |
| `api_available` | boolean | |
| `best_use_cases` | string[] | max 20 items |
| `limitations` | string[] | max 20 items |
| `verified_date` | string | YYYY-MM-DD format |
| `active` | boolean | false = hidden from UI |

## FreeTierDetails Object

```json
{
  "credits": "string or null",
  "generation_limit": "string or null",
  "daily_limit": "string or null",
  "monthly_limit": "string or null",
  "has_watermark": "boolean or null",
  "watermark_details": "string or null",
  "feature_restrictions": "string or null",
  "api_restrictions": "string or null",
  "commercial_use_allowed": "boolean or null"
}
```

## Valid Category IDs

```
chat-ai | writing-ai | research-ai | image-generation | video-generation
voice-audio | music-generation | coding-ai | design-ai | productivity-ai
document-ai | translation-ai | ai-agents
```

## Pricing Type Rules

NEVER use just "Free". Always use the full label:
- **"Completely Free"** — no payment ever required, no hidden limits
- **"Freemium"** — core features free, advanced features paid
- **"Free Trial"** — time or usage limited, then requires payment
- **"Paid Only"** — no meaningful free access

## Architecture Rules

- React frontend NEVER calls Firestore directly
- All data goes through FastAPI backend at `http://localhost:8000`
- Seed scripts live in `backend/scripts/`
- Backend uses `venv\Scripts\python.exe` on Windows
