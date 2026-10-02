# 🏠 AI Apartment

> **AI tools, organized. One apartment. Different AI capabilities.**

AI Apartment is a web platform for discovering, comparing, and understanding AI tools — organized into rooms by category. Honest free-tier information, verified pricing, and side-by-side comparison.

**Live:** https://ai-apartment-five.vercel.app  
**API:** https://ai-apartment.onrender.com/docs  
**Repo:** https://github.com/bhuvana-g-dev/ai-apartment

---

## Features

- **14 AI categories (rooms)** — Chat, Writing, Research, Image Generation, Video Generation, Voice & Audio, Music, Coding, Design, Productivity, Document AI, Translation, AI Agents, API Providers
- **90+ real AI tools** — structured data: pricing type, free-tier limits, capabilities, I/O types, watermark info, API availability, verified date
- **AI Finder** — guided wizard (task + requirements) → rule-based scoring + Gemini-powered reasoning → ranked recommendations with "why this tool" explanation
- **Search** with inline filters (pricing, free tier) — word-level matching with synonym expansion
- **Filter catalogue** by category, pricing, free tier, API, watermark
- **Compare** up to 4 tools side by side — free tier details, capabilities, verified dates, no winner declared
- **Favorites** — saved in localStorage, persists across sessions
- **Admin dashboard** — add/edit tools and categories via UI (API key protected)
- **Optional Google Sign-In** — non-blocking, all features work without it
- **Mobile responsive** — hamburger nav, responsive grids, touch-friendly

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS + React Router + Axios + Lucide |
| Backend | Python 3.12 + FastAPI |
| Database | Firebase Firestore |
| Auth | Firebase Authentication (Google Sign-In, optional) |
| AI | Gemini 1.5 Flash (Finder reasoning, rule-based fallback) |
| Testing | Hypothesis (PBT, 7 properties) |
| Deploy | Vercel (frontend) + Render (backend) |

---

## Local setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt

# Configure secrets
copy .env.example .env
# Fill in:
#   GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
#   FIRESTORE_PROJECT_ID=your-project-id
#   CORS_ALLOWED_ORIGINS=http://localhost:5173
#   GEMINI_API_KEY=your-gemini-key       (optional — enables AI reasoning in Finder)
#   ADMIN_API_KEY=your-admin-password    (optional — protects POST/PATCH /tools)

# Seed Firestore (run once)
python -m scripts.seed_categories
python -m scripts.seed_tools
python -m scripts.seed_tools_new
python -m scripts.seed_api_providers

# Start API
uvicorn app.main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger UI)
```

### Frontend

```bash
cd frontend
npm install

copy .env.example .env
# Fill in:
#   VITE_API_BASE_URL=http://localhost:8000
#   VITE_ADMIN_KEY=your-admin-password
#   VITE_FIREBASE_API_KEY=AIzaSy...
#   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
#   VITE_FIREBASE_PROJECT_ID=your-project-id

npm run dev
# → http://localhost:5173
```

### Tests

```bash
# Backend — 7 Hypothesis property-based tests
cd backend
python -m pytest tests/test_properties.py -v

# Frontend
cd frontend
npm run test
```

---

## API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Liveness check |
| GET | `/categories` | All active categories |
| GET | `/categories/{id}` | Single category by slug |
| GET | `/categories/{id}/tools` | Tools in a category |
| GET | `/tools` | All tools (paginated + filtered) |
| GET | `/tools/{id}` | Tool detail |
| GET | `/tools/search?q=` | Full-text search with synonym expansion |
| POST | `/finder` | AI Finder — natural language → recommendations |
| POST | `/tools` | Create tool (requires `X-Admin-Key`) |
| PATCH | `/tools/{id}` | Update tool (requires `X-Admin-Key`) |

All list responses: `{ data, total, limit, offset }`.  
All errors: `{ detail: "..." }`.

---

## Architecture

```
Vercel  (React + Vite)
    │  HTTPS / Axios
    ▼
Render  (FastAPI + Python)
    │  Firebase Admin SDK
    ▼
Firestore  (categories / tools)
    +
Gemini API  (Finder reasoning — optional)
```

Frontend only knows `VITE_API_BASE_URL`. It never calls Firestore or Gemini directly.

---

## Kiro University — One line per lesson

This project was built with Kiro IDE for the Kiro University / AWS User Group Madurai challenge.

| # | Lesson | How used in this project |
|---|---|---|
| 1 | **Spec-driven development** | Built entirely from `.kiro/specs/ai-apartment-mvp/` — `requirements.md` (11 requirements, 90+ EARS criteria), `design.md` (API contract, Firestore schema, 17 correctness properties), `tasks.md` (56 tasks in 11 dependency waves). No code written without a prior spec decision. |
| 2 | **Steering documents** | 5 steering files in `.kiro/steering/` shape every AI session: `product.md` (vision), `tech.md` (stack rules), `structure.md` (layout), `lessons.md` (auto-inclusion), `cloud-sessions.md` (deployment guide) |
| 3 | **Hooks** | `project-hooks.json` — Python syntax check on `.py` save, JSX lint reminder on `.jsx` save, test reminder after spec task; `kironomics.json` — Kiro University progress tracking |
| 4 | **Property-based testing** | 7 Hypothesis properties in `backend/tests/test_properties.py`: pagination completeness, filter AND semantics, capabilities monotonic narrowing, search active-only, pricing label invariant, case-insensitivity, result count ≤ 50. All pass. |
| 5 | **Powers** | `ai-apartment-power` installed locally at `~/.kiro/powers/` with `plugin.json`, 2 skills (`seed-tool`, `add-category`), and domain knowledge steering for the data model |
| 6 | **MCP** | Filesystem MCP server configured in `.kiro/settings/mcp.json` — gives Kiro structured read access to `backend/` and `frontend/src/` |
| 7 | **Custom agents** | `data-manager.md` agent specialises in adding AI tool records with correct pricing labels, category IDs, verified dates, and the 4-value pricing type enum |
