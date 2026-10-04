# AI Apartment Power

This Kiro Power bundles domain knowledge and skills for the **AI Apartment** project — an AI tool discovery, comparison, and cataloguing platform built with React + FastAPI + Firebase Firestore.

---

## What This Power Includes

| Component | Description |
|---|---|
| **Steering** | Full data model, valid category IDs, pricing rules, architecture constraints, common commands |
| **Skill: seed-tool** | Step-by-step guide for adding a new AI tool record to the seed script |
| **Skill: add-category** | Step-by-step guide for adding a new category (room) to the seed script |

---

## Project Overview

**AI Apartment** organises the fragmented AI tool ecosystem into one place. The "apartment" metaphor: each room is a category of AI tools. Users can discover, compare, and find the right tool for their task — with accurate free-tier details and side-by-side comparisons.

**Core tagline:** One apartment. Different AI capabilities.

### Feature Set

1. **Category Exploration** — 13 rooms, each a category of tools
2. **Tool Catalogue** — Structured records with 17 fields per tool
3. **Free AI Focus** — Granular free-tier tracking (credits, limits, watermarks, commercial use)
4. **Search & Filter** — By name, category, capability, pricing, API availability, watermark
5. **Tool Detail Page** — Full breakdown with all fields exposed
6. **Side-by-Side Comparison** — Factual diff, no "winner" declared
7. **Task-Based Finder** — Natural language → AI recommends matching tools
8. **Favorites** — Saved tool list per user
9. **Admin Panel** — Add, edit, deactivate tools and update pricing

---

## Stack at a Glance

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS + React Router + Axios |
| Backend | FastAPI (Python) |
| Database | Firebase Firestore |
| AI APIs | Via backend only — never exposed to frontend |

**Architecture flow:**
```
React (Vite)  →  Axios  →  FastAPI  →  Firestore / AI APIs
```

---

## Data Model Quick Reference

| Field | Type | Notes |
|---|---|---|
| `id` | string | Firestore document ID (slug) |
| `name` | string | 1–200 chars |
| `description` | string | 1–2000 chars |
| `category_id` | string | Must match a valid category slug |
| `website_url` | string | Valid URL |
| `pricing_type` | enum | See Pricing Type Rules below |
| `free_availability` | boolean | |
| `free_tier_details` | object\|null | Null when `free_availability` is False |
| `capabilities` | string[] | Max 50 items |
| `input_types` | string[] | Max 20 items |
| `output_types` | string[] | Max 20 items |
| `watermark_info` | string\|null | Max 500 chars |
| `api_available` | boolean | |
| `best_use_cases` | string[] | Max 20 items |
| `limitations` | string[] | Max 20 items |
| `verified_date` | string | YYYY-MM-DD format |
| `active` | boolean | False = hidden from UI |

---

## Pricing Type Rules

Never use just "Free". Always use one of these exact four labels:

| Label | When to use |
|---|---|
| `"Completely Free"` | No payment ever required, no hidden limits |
| `"Freemium"` | Core features free, advanced features paid |
| `"Free Trial"` | Time- or usage-limited, then requires payment |
| `"Paid Only"` | No meaningful free access |

---

## Valid Category IDs

```
chat-ai          writing-ai       research-ai      image-generation
video-generation voice-audio      music-generation coding-ai
design-ai        productivity-ai  document-ai      translation-ai
ai-agents
```

---

## Skills

### `seed-tool`
Add a new AI tool record to `backend/scripts/seed_tools.py` with all 17 required fields validated.

Activate with: `@seed-tool` or ask Kiro to "add a new tool".

### `add-category`
Add a new category slug and name to `backend/scripts/seed_categories.py`.

Activate with: `@add-category` or ask Kiro to "add a new category".

---

## Common Commands (Windows PowerShell)

```powershell
# Run backend dev server
cd backend
venv\Scripts\uvicorn.exe app.main:app --reload

# Seed categories
venv\Scripts\python.exe -m scripts.seed_categories

# Seed tools
venv\Scripts\python.exe -m scripts.seed_tools

# Run frontend dev server
cd frontend
npm run dev
```

---

## Key Constraints

- React **never** calls Firestore or AI APIs directly
- All Axios calls from the frontend live in `frontend/src/services/` — not in components
- Backend routers are split by domain: `tools.py`, `categories.py`, `search.py`, `finder.py`
- `.env` files are **never** committed — use `.env.example` templates
- Categories and tools are **data**, not hardcoded UI — new categories need no frontend code changes
