---
inclusion: always
---

# AI Apartment — Power Context

This steering file is loaded automatically whenever the `ai-apartment-power` is active. It gives Kiro complete knowledge of the AI Apartment project so every suggestion and edit is consistent with the platform's data model, architecture, and conventions.

---

## Project Identity

**AI Apartment** is an AI tool discovery, comparison, and recommendation platform. Tools are organised into "rooms" — each room is a category. Users can browse, search, filter, compare, and get task-based recommendations.

**Core tagline:** One apartment. Different AI capabilities.

---

## Architecture

```
React (Vite + Tailwind + React Router + Axios)
        ↓  HTTP (Axios)
FastAPI (Python)
        ↓
Firebase Firestore    AI APIs (OpenAI, Gemini, etc.)
```

### Hard Rules

- React **never** calls Firestore or AI APIs directly — all data flows through FastAPI
- All Axios calls live in `frontend/src/services/` — components never construct API requests
- AI API keys live only in `backend/.env` — never in the frontend
- Backend routes are split by domain: `tools.py`, `categories.py`, `search.py`, `finder.py`
- `.env` files are never committed; `.env.example` templates are provided instead

---

## Directory Layout

```
ai-apartment/
├── frontend/
│   └── src/
│       ├── assets/         # Static images and icons
│       ├── components/     # Reusable UI components
│       ├── pages/          # One component per route
│       ├── services/       # All Axios API calls
│       ├── hooks/          # Custom React hooks
│       ├── utils/          # Pure utility functions
│       └── types/          # JSDoc / TypeScript type definitions
│
├── backend/
│   └── app/
│       ├── routers/        # Route handlers by domain
│       ├── models/         # Pydantic request/response models
│       ├── services/       # Business logic & AI API calls
│       ├── db/             # Firestore access layer
│       └── main.py         # FastAPI app entry point
│   ├── scripts/            # Firestore seed scripts
│   └── requirements.txt
```

---

## Tool Data Model (17 fields)

Every AI tool stored in Firestore has exactly these fields:

| Field | Type | Constraint |
|---|---|---|
| `id` | string | Firestore document ID; lowercase hyphenated slug |
| `name` | string | 1–200 chars |
| `description` | string | 1–2000 chars |
| `category_id` | string | Must match a valid category slug (see list below) |
| `website_url` | string | Valid HTTP/HTTPS URL |
| `pricing_type` | enum | Must be one of the four exact labels — see Pricing Rules |
| `free_availability` | boolean | True if any meaningful free access exists |
| `free_tier_details` | object\|null | **Must be null** when `free_availability` is False |
| `capabilities` | string[] | Max 50 items; short lowercase phrases |
| `input_types` | string[] | Max 20 items (e.g. "text", "image", "audio", "video") |
| `output_types` | string[] | Max 20 items (e.g. "text", "image", "audio", "code") |
| `watermark_info` | string\|null | Null if no watermark; describe if present |
| `api_available` | boolean | True if a public API exists |
| `best_use_cases` | string[] | Max 20 items; short descriptive phrases |
| `limitations` | string[] | Max 20 items; honest, factual constraints |
| `verified_date` | string | ISO date: YYYY-MM-DD (today when adding) |
| `active` | boolean | False = hidden from UI; always True when seeding |

---

## FreeTierDetails Object Schema

Used when `free_availability` is True. All fields are nullable.

```python
{
    "credits": None,                  # string|None  — e.g. "100 credits/month"
    "generation_limit": None,         # string|None  — e.g. "25 images/month"
    "daily_limit": None,              # string|None  — e.g. "10 requests/day"
    "monthly_limit": None,            # string|None  — e.g. "50 requests/month"
    "has_watermark": None,            # bool|None
    "watermark_details": None,        # string|None  — describe watermark if present
    "feature_restrictions": None,     # string|None  — what's locked behind paywall
    "api_restrictions": None,         # string|None  — free API rate limits if any
    "commercial_use_allowed": None,   # bool|None
}
```

---

## Pricing Type Rules

**Never use plain "Free".** Always use one of these four exact string labels:

| Label | Definition |
|---|---|
| `"Completely Free"` | No payment ever required, no hidden limits, no watermarks |
| `"Freemium"` | Core features free indefinitely; advanced features require payment |
| `"Free Trial"` | Time-limited or credit-limited access, then requires payment |
| `"Paid Only"` | No meaningful free access exists |

---

## Valid Category IDs

These are the only accepted values for `category_id`. A tool must belong to exactly one.

| slug | Display Name |
|---|---|
| `chat-ai` | Chat AI |
| `writing-ai` | Writing AI |
| `research-ai` | Research AI |
| `image-generation` | Image Generation |
| `video-generation` | Video Generation |
| `voice-audio` | Voice & Audio |
| `music-generation` | Music Generation |
| `coding-ai` | Coding AI |
| `design-ai` | Design AI |
| `productivity-ai` | Productivity AI |
| `document-ai` | Document AI |
| `translation-ai` | Translation AI |
| `ai-agents` | AI Agents |

To add a new category, use the `add-category` skill.

---

## Seed Scripts

Seed scripts populate Firestore with initial data. They are idempotent — re-running overwrites existing docs without creating duplicates.

| Script | Purpose |
|---|---|
| `backend/scripts/seed_categories.py` | Seeds all category documents |
| `backend/scripts/seed_tools.py` | Seeds all tool documents |
| `backend/scripts/seed_tools_new.py` | Additional tool batch |
| `backend/scripts/seed_tools_batch3.py` | Additional tool batch |

### Running Seed Scripts (Windows PowerShell)

```powershell
# From the backend/ directory:
venv\Scripts\python.exe -m scripts.seed_categories
venv\Scripts\python.exe -m scripts.seed_tools
```

---

## Common Commands (Windows PowerShell)

```powershell
# Start backend dev server
cd backend
venv\Scripts\uvicorn.exe app.main:app --reload

# Start frontend dev server
cd frontend
npm run dev

# Install backend dependencies
cd backend
venv\Scripts\pip.exe install -r requirements.txt

# Install frontend dependencies
cd frontend
npm install

# Build frontend for production
cd frontend
npm run build
```

Backend runs at: `http://localhost:8000`
Frontend runs at: `http://localhost:5173`

---

## API Endpoint Conventions

| Method | Path pattern | Purpose |
|---|---|---|
| GET | `/categories` | List all active categories |
| GET | `/categories/{slug}` | Single category |
| GET | `/tools` | List tools (supports query params: `category`, `pricing_type`, `free_only`, `api_only`) |
| GET | `/tools/{id}` | Single tool detail |
| GET | `/search?q=...` | Full-text search across tools |
| POST | `/finder` | Task-based tool recommendation |

---

## Frontend Code Conventions

- Every API call lives in a file under `frontend/src/services/` — e.g. `toolsService.js`, `categoriesService.js`
- Components use hooks to call services — never raw `axios` in JSX files
- Always handle three states: **loading**, **error**, **empty**
- Use `PricingBadge` component for pricing display — never format pricing inline
- Use `CategoryIcon` component for category icons
- Tailwind utility classes only — no custom CSS files

---

## Backend Code Conventions

- Pydantic models in `app/models/` define request and response shapes
- Firestore access only in `app/db/` — routers and services never import `firestore` directly
- Routers call services; services call db layer — keep the layers clean
- All routes return typed Pydantic response models, never raw dicts
- Input validated with Pydantic validators; never trust raw request data

---

## Environment Variables

### Backend (`backend/.env`)
```
GOOGLE_APPLICATION_CREDENTIALS=./ai-apartment-firebase-adminsdk.json
OPENAI_API_KEY=...          # For task-based finder
GEMINI_API_KEY=...          # Alternative AI provider
```

### Frontend (`frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:8000
```

Never commit `.env` files. Use `.env.example` for templates.
