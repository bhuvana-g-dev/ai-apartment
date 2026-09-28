# 🏠 AI Apartment

> **One apartment. Different AI capabilities.**

AI Apartment is a web platform for discovering, comparing, and understanding AI tools — organized into rooms by category. Stop Googling "best free AI image generator" and start exploring a structured catalogue that tells you exactly what's free, what's limited, and what to watch out for.

---

## What it does

- **Browse 13 AI categories** — Chat, Writing, Research, Image Generation, Video Generation, Voice & Audio, Music, Coding, Design, Productivity, Document AI, Translation, AI Agents
- **75+ real AI tools** with structured data: pricing type, free-tier limits, capabilities, input/output types, watermark info, API availability, and a verified date
- **Search** across tool names, descriptions, capabilities, and use cases
- **Filter** by category, pricing type, free tier, API availability, watermark status
- **Compare** up to 4 tools side by side — factual data only, no "winner" declared
- **Favorites** — save tools for later, persisted in localStorage

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS + React Router + Axios |
| Backend | Python 3.12 + FastAPI |
| Database | Firebase Firestore |
| Testing | Hypothesis (property-based) + Vitest |

**Architecture:** React → Axios → FastAPI → Firestore. The frontend never touches Firestore or AI APIs directly.

---

## Project structure

```
ai-apartment/
├── frontend/                  # React + Vite app
│   └── src/
│       ├── components/        # 16 reusable components
│       ├── pages/             # 8 page components
│       ├── services/          # Axios API layer
│       ├── hooks/             # useFavorites, useCompareSet, useFilters, usePagination
│       └── context/           # CompareContext (shared comparison state)
├── backend/                   # FastAPI app
│   ├── app/
│   │   ├── routers/           # tools.py, categories.py, search.py
│   │   ├── models/            # Pydantic schemas
│   │   ├── services/          # filter, pagination, search ranking logic
│   │   └── db/                # Firestore access layer
│   ├── scripts/               # seed_categories.py, seed_tools.py, seed_tools_new.py
│   └── tests/                 # test_properties.py (Hypothesis)
└── .kiro/                     # Kiro IDE configuration
    ├── specs/ai-apartment-mvp/ # requirements.md, design.md, tasks.md
    ├── steering/               # product.md, tech.md, structure.md, lessons.md
    ├── hooks/                  # kironomics.json, project-hooks.json
    ├── agents/                 # data-manager.md
    ├── skills/                 # seed-tool.md, add-category.md
    └── powers/ai-apartment-power/ # plugin.json, POWER.md
```

---

## Local setup

### Prerequisites
- Python 3.12+
- Node.js 18+
- A Firebase project with Firestore enabled in Native mode
- A Firebase service account JSON key

### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env and fill in:
# GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\your-service-account.json
# FIRESTORE_PROJECT_ID=your-project-id
# CORS_ALLOWED_ORIGINS=http://localhost:5173

# Seed data (run once)
python -m scripts.seed_categories
python -m scripts.seed_tools
python -m scripts.seed_tools_new

# Start the API server
uvicorn app.main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger UI)
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
copy .env.example .env
# VITE_API_BASE_URL=http://localhost:8000

# Start dev server
npm run dev
# → http://localhost:5173
```

### Run property-based tests

```bash
cd backend
python -m pytest tests/test_properties.py -v
# 7 Hypothesis properties, all passing
```

---

## API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Liveness check |
| GET | `/categories` | All active categories |
| GET | `/categories/{id}/tools` | Tools for a category |
| GET | `/tools` | All tools (paginated + filtered) |
| GET | `/tools/{id}` | Single tool detail |
| GET | `/tools/search?q=` | Full-text search |
| POST | `/tools` | Create tool (admin) |
| PATCH | `/tools/{id}` | Update tool (admin) |

All list responses return `{ data, total, limit, offset }`. All errors return `{ detail: "..." }`.

---

## Kiro University — One line per lesson

This project was built with Kiro IDE for the Kiro University / AWS User Group Madurai challenge. Each Kiro feature was used as a first-class part of the build process, not added as an afterthought.

| # | Lesson | How I used it |
|---|---|---|
| 1 | **Spec-driven development** | Generated `requirements.md` (11 requirements, 90+ acceptance criteria in EARS format), `design.md` (full API contract, Firestore schema, 17 correctness properties), and `tasks.md` (56 tasks in 11 dependency waves) before writing a single line of code — at `.kiro/specs/ai-apartment-mvp/` |
| 2 | **Steering documents** | Created 5 steering files (`product.md`, `tech.md`, `structure.md`, `lessons.md`, `cloud-sessions.md`) in `.kiro/steering/` that enforce architecture rules (e.g. "React never calls Firestore directly") in every Kiro session automatically |
| 3 | **Hooks** | Added `project-hooks.json` with a `PostFileSave` Python syntax check, a `PostFileSave` JSX lint reminder, and a `PostTaskExec` test reminder — plus the Kironomics hooks for challenge progress tracking |
| 4 | **Property-based testing** | Wrote 7 Hypothesis properties in `backend/tests/test_properties.py` covering pagination completeness, filter AND semantics, capabilities monotonic narrowing, search active-only, pricing label invariant, search case-insensitivity, and result count bounds |
| 5 | **Powers** | Built and installed the `ai-apartment-power` locally (`~/.kiro/powers/ai-apartment-power/`) with domain knowledge steering and 2 skills for adding tools and categories to the catalogue |
| 6 | **Model Context Protocol (MCP)** | Configured the filesystem MCP server in `.kiro/settings/mcp.json` using `npx @modelcontextprotocol/server-filesystem` to give Kiro structured access to backend and frontend source files |
| 7 | **Custom agents** | Created a `data-manager` agent at `.kiro/agents/data-manager.md` that specialises in adding tool records with correct pricing labels, category IDs, and verified dates to the Firestore seed scripts |

---

## Data model

Every AI tool is stored with these fields:

```
name · description · category_id · website_url
pricing_type: "Completely Free" | "Freemium" | "Free Trial" | "Paid Only"
free_availability · free_tier_details (credits, limits, watermark, commercial use)
capabilities · input_types · output_types
watermark_info · api_available
best_use_cases · limitations
verified_date · active
```

Pricing is **never** just labelled "Free" — the platform distinguishes all four types and always shows the verified date because pricing changes frequently.

---

## Repo

**GitHub:** https://github.com/bhuvana-g-dev/ai-apartment

**Kiro Power:** `.kiro/powers/ai-apartment-power/plugin.json`
