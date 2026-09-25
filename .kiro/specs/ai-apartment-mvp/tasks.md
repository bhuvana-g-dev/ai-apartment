# Implementation Plan: AI Apartment MVP

## Overview

This plan converts the AI Apartment MVP design into an ordered sequence of coding tasks. Tasks are grouped into 14 phases so that each phase's output is a prerequisite for the next. Frontend and backend foundations are built in parallel before being connected through the services layer and page components. Property-based tests are written close to the code they validate so errors surface early.

Tech stack: React + Vite + Tailwind CSS + React Router + Axios (JavaScript) on the frontend; Python + FastAPI + Firebase Firestore on the backend.

---

## Tasks

- [x] 1. Project scaffolding and configuration
  - [x] 1.1 Create root `.gitignore` covering Python virtualenvs, `__pycache__`, `.env` files, `node_modules`, Vite build output (`dist/`), and Firebase credential JSON files
    - Add entries: `*.pyc`, `__pycache__/`, `.env`, `*.env.*`, `node_modules/`, `dist/`, `*.json` (service account pattern), `.venv/`
    - _Requirements: 10.6_

  - [x] 1.2 Scaffold the `backend/` directory structure
    - Create `backend/app/__init__.py`, `backend/app/routers/__init__.py`, `backend/app/models/__init__.py`, `backend/app/services/__init__.py`, `backend/app/db/__init__.py`
    - Create `backend/requirements.txt` with pinned versions: `fastapi==0.111.0`, `uvicorn[standard]==0.29.0`, `firebase-admin==6.5.0`, `pydantic[email]==2.7.1`, `python-dotenv==1.0.1`, `hypothesis==6.100.2`, `pytest==8.2.0`, `pytest-asyncio==0.23.6`, `httpx==0.27.0`
    - Create `backend/.env.example` with keys: `GOOGLE_APPLICATION_CREDENTIALS`, `FIRESTORE_PROJECT_ID`, `CORS_ALLOWED_ORIGINS`
    - _Requirements: 10.1, 10.6_

  - [x] 1.3 Scaffold the `frontend/` directory structure
    - Create `frontend/src/assets/`, `frontend/src/components/`, `frontend/src/pages/`, `frontend/src/services/`, `frontend/src/hooks/`, `frontend/src/utils/`, `frontend/src/types/`
    - Create `frontend/.env.example` with key: `VITE_API_BASE_URL=http://localhost:8000`
    - _Requirements: 11.1, 11.9_

- [ ] 2. Backend foundation
  - [ ] 2.1 Create `backend/app/main.py` — FastAPI application entry point
    - Instantiate the FastAPI app with a title and version
    - Load `.env` using `python-dotenv` at startup
    - Register a global exception handler that catches unhandled `Exception` and returns HTTP 500 with `{ "detail": "An internal error occurred. Please try again." }` — no stack traces
    - Implement `GET /health` returning `{ "status": "ok" }`
    - _Requirements: 10.5, 10.7_

  - [ ] 2.2 Add CORS middleware to `backend/app/main.py`
    - Read `CORS_ALLOWED_ORIGINS` from environment; parse comma-separated string into a list
    - Apply `CORSMiddleware` only when the variable is set; allowed origins = parsed list
    - _Requirements: 10.8_

  - [ ] 2.3 Create `backend/app/db/firestore_client.py` — Firestore client initialisation
    - Read `GOOGLE_APPLICATION_CREDENTIALS` and `FIRESTORE_PROJECT_ID` from environment
    - Initialise `firebase_admin` app once using `credentials.Certificate`; expose a `get_db()` function that returns the Firestore client
    - Raise a clear startup error if required env vars are missing
    - _Requirements: 10.6_

- [ ] 3. Data models (Pydantic)
  - [ ] 3.1 Create `backend/app/models/tool.py`
    - Define `FreeTierDetails` model with all optional fields: `credits`, `generation_limit`, `daily_limit`, `monthly_limit`, `has_watermark`, `watermark_details`, `feature_restrictions`, `api_restrictions`, `commercial_use_allowed`
    - Define `ToolRecord` with all 17 fields from Requirement 3.1, using `Literal["Completely Free", "Freemium", "Free Trial", "Paid Only"]` for `pricing_type`, `HttpUrl` for `website_url`
    - Define `ToolCreate` extending `ToolRecord` with auto-generated `id` via `default_factory`
    - Define `ToolUpdate` as a partial model (all fields `Optional`) for PATCH operations
    - Enforce field-length constraints (name 1–200, description 1–2000, watermark_info 0–500) using Pydantic `Field`
    - _Requirements: 3.1, 3.5, 3.8_

  - [ ] 3.2 Create `backend/app/models/category.py`
    - Define `CategoryRecord` with fields: `id`, `name`, `description`, `slug`, `icon` (optional), `active`
    - _Requirements: 2.1, 2.3_

  - [ ] 3.3 Create `backend/app/models/responses.py`
    - Define `PaginatedResponse` as a generic Pydantic model with fields: `data: list[T]`, `total: int`, `limit: int`, `offset: int`
    - _Requirements: 10.10_

  - [ ]* 3.4 Write property test for Tool serialization round-trip (Property 1)
    - **Property 1: Tool serialization round-trip**
    - In `backend/tests/test_properties.py`, use `hypothesis.strategies.builds(ToolRecord, ...)` to generate valid Tool records
    - Assert that `ToolRecord.model_validate(tool.model_dump())` equals the original for all 17 fields; absent optional fields are `null` not missing
    - **Validates: Requirements 3.1, 3.6**

- [ ] 4. Backend DB layer
  - [ ] 4.1 Create `backend/app/db/tools_db.py`
    - Implement `fetch_tools(filters: dict, limit: int, offset: int) -> tuple[list[dict], int]` — queries Firestore `tools` collection, returns matching docs and total count
    - Implement `fetch_tool_by_id(tool_id: str) -> dict | None` — fetches a single document by ID
    - Implement `write_tool(data: dict) -> str` — creates a document, returns the new ID
    - Implement `update_tool(tool_id: str, data: dict) -> None` — partial update via Firestore `update()`
    - No business logic; all Firestore SDK calls are here only
    - _Requirements: 3.2, 3.3, 3.4, 10.1_

  - [ ] 4.2 Create `backend/app/db/categories_db.py`
    - Implement `fetch_categories() -> list[dict]` — queries Firestore `categories` collection for active records, sorted by name
    - Implement `fetch_category_by_id(category_id: str) -> dict | None`
    - _Requirements: 2.3, 2.4, 2.5, 2.6_

- [ ] 5. Backend services layer
  - [ ] 5.1 Create `backend/app/services/tools_service.py`
    - Implement `apply_filters(tools: list[dict], filters: dict) -> list[dict]`
      - AND logic across all provided filter keys
      - `capabilities` filter: tool must contain ALL specified values
      - `has_watermark` derived from `free_tier_details.has_watermark`
    - Implement `paginate(items: list, limit: int, offset: int) -> tuple[list, int]` — returns page slice and total count
    - Implement `rank_search_results(tools: list[dict], query: str) -> list[dict]`
      - Case-insensitive matching across `name`, `description`, `category_id`, `capabilities`, `best_use_cases`
      - Relevance order: name match > capability match > description match
      - Returns at most 50 results
    - _Requirements: 5.3, 5.10, 5.11, 6.4, 6.5_

  - [ ] 5.2 Create `backend/app/services/categories_service.py`
    - Implement `resolve_slug(slug: str, categories: list[dict]) -> dict | None` — finds category whose `slug` matches
    - _Requirements: 2.2_

  - [ ]* 5.3 Write property tests for filter AND semantics (Properties 3 and 4)
    - **Property 3: Filter AND semantics**
    - In `backend/tests/test_properties.py`, generate random tool lists and filter sets using Hypothesis; assert every returned tool satisfies all filters simultaneously
    - **Property 4: Capabilities filter is monotonically narrowing**
    - Generate capability lists of increasing length; assert result set size never grows as more capability constraints are added
    - **Validates: Requirements 6.4, 6.5**

  - [ ]* 5.4 Write property tests for pagination (Property 2)
    - **Property 2: Pagination covers all tools exactly once**
    - Generate catalogues of size N and page sizes L using Hypothesis; iterate all pages and collect tool IDs; assert set size equals N with no duplicates
    - **Validates: Requirements 3.2, 10.9, 10.10**

  - [ ]* 5.5 Write property tests for search correctness (Properties 5, 11, 12, 13, 17)
    - **Property 5: Search only returns active tools** — generate mixed active/inactive catalogues; assert all results have `active=true`
    - **Property 11: Search case-insensitivity** — generate query Q and case variants Q'; assert identical result ID sets
    - **Property 12: Search result field matching** — assert every result contains Q in at least one of the five searchable fields
    - **Property 13: Search result count upper bound** — assert `len(results) <= 50` for any query and catalogue size
    - **Property 17: Whitespace-only search returns 422** — generate whitespace-only strings; assert HTTP 422 response
    - **Validates: Requirements 5.3, 5.4, 5.7, 5.10, 5.11**

- [ ] 6. Backend routers and API endpoints
  - [ ] 6.1 Create `backend/app/routers/categories.py`
    - Implement `GET /categories` — returns `PaginatedResponse[CategoryRecord]` of all active categories sorted alphabetically by name
    - Implement `GET /categories/{category_id}/tools` — returns `PaginatedResponse[ToolRecord]` of active tools for the category, sorted by name; returns 404 if category not found
    - Register router in `main.py`
    - _Requirements: 2.3, 2.4, 2.5, 2.6_

  - [ ] 6.2 Create `backend/app/routers/tools.py`
    - Implement `GET /tools` with query params: `limit` (1–100, default 20), `offset` (≥0, default 0), `category_id`, `pricing_type`, `free_availability`, `capabilities`, `input_type`, `output_type`, `api_available`, `has_watermark`
    - Validate `pricing_type` against the four permitted values; return 422 for invalid values
    - Validate `limit` range 1–100; return 422 for out-of-range values
    - Return `PaginatedResponse[ToolRecord]`
    - Implement `GET /tools/{tool_id}` — returns `ToolRecord` or 404 if not found or `active=false`
    - Implement `POST /tools` (admin write) — validates `ToolCreate`, writes to Firestore, returns 201 with `ToolRecord`; returns 422 for missing required fields or invalid `pricing_type`
    - Implement `PATCH /tools/{tool_id}` (admin update) — partial update; returns 200 with updated `ToolRecord` or 404
    - Register router in `main.py`
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 3.8, 3.9, 6.3, 6.4, 6.6, 10.9_

  - [ ] 6.3 Create `backend/app/routers/search.py`
    - Implement `GET /tools/search` with required `q` parameter (1–200 chars, non-whitespace); return 422 if absent or whitespace-only
    - Call `rank_search_results()` from the services layer; return `PaginatedResponse[ToolRecord]` with at most 50 results
    - Register router in `main.py` **before** `tools.py` so `/tools/search` is not shadowed by `/tools/{tool_id}`
    - _Requirements: 5.3, 5.4, 5.7, 5.10, 5.11_

  - [ ]* 6.4 Write property tests for API response shape and pricing invariants (Properties 6, 7, 14, 15)
    - **Property 6: Pricing type label invariant on read** — for every tool returned by any list or detail endpoint, assert `pricing_type` is one of the four permitted values
    - **Property 7: Pricing type validation on write** — generate arbitrary strings not in the enum; assert every POST /tools returns 422 with the invalid value named
    - **Property 14: Inactive tool returns 404** — for any tool with `active=false`, assert `GET /tools/{id}` returns 404
    - **Property 15: API list envelope shape** — for every list endpoint response, assert JSON has `data`, `total`, `limit`, `offset` fields
    - **Validates: Requirements 3.4, 3.5, 7.1, 7.5, 10.10**

  - [ ] 6.5 Checkpoint — run all backend tests; all should pass
    - Run `pytest backend/tests/` and confirm zero failures before proceeding to frontend work
    - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Frontend foundation
  - [x] 7.1 Initialise the Vite + React project in `frontend/`
    - Run `npm create vite@5.2.0 frontend -- --template react` (JavaScript template, not TypeScript)
    - Install dependencies with pinned versions: `react-router-dom@6.23.1`, `axios@1.7.2`
    - Install dev dependencies: `tailwindcss@3.4.3`, `postcss@8.4.38`, `autoprefixer@10.4.19`, `fast-check@3.19.0`, `vitest@1.6.0`, `@testing-library/react@15.0.6`, `@testing-library/user-event@14.5.2`, `@vitest/ui@1.6.0`, `jsdom@24.0.0`
    - _Requirements: 11.2_

  - [ ] 7.2 Configure Tailwind CSS
    - Run `npx tailwindcss init -p` in `frontend/` to generate `tailwind.config.js` and `postcss.config.js`
    - Set `content` paths to `["./index.html", "./src/**/*.{js,jsx}"]`
    - Add Tailwind directives to `frontend/src/index.css`
    - _Requirements: 11.8_

  - [ ] 7.3 Create `frontend/src/services/api.js` — Axios instance
    - Export a default Axios instance with `baseURL` read from `import.meta.env.VITE_API_BASE_URL`
    - _Requirements: 11.9, 3.7_

  - [ ] 7.4 Configure React Router with all routes in `frontend/src/App.jsx`
    - Define routes: `/`, `/categories`, `/categories/:categorySlug`, `/tools/:toolId`, `/search`, `/tools`, `/compare`, `/favorites`
    - Each route maps to a placeholder page component (import from `pages/`) so routing is wired even before pages are fully implemented
    - Wrap the app in `BrowserRouter`
    - _Requirements: 11.2_

  - [ ] 7.5 Configure Vitest in `frontend/vite.config.js`
    - Add `test` section: `environment: "jsdom"`, `globals: true`, `setupFiles: ["./src/setupTests.js"]`
    - Create `frontend/src/setupTests.js` importing `@testing-library/jest-dom`
    - _Requirements: 11.1_

- [ ] 8. Frontend services layer
  - [ ] 8.1 Create `frontend/src/services/toolsService.js`
    - `getTools(params)` — `GET /tools` with filter and pagination params
    - `getToolById(toolId)` — `GET /tools/{toolId}`
    - `getToolsByCategory(categoryId, params)` — `GET /categories/{categoryId}/tools`
    - All functions use the Axios instance from `api.js`; return `response.data`; do not catch errors (let the caller handle)
    - _Requirements: 3.7, 11.1_

  - [ ] 8.2 Create `frontend/src/services/categoriesService.js`
    - `getCategories()` — `GET /categories`
    - `getCategoryBySlug(slug)` — calls `GET /categories` and filters client-side by slug, or `GET /categories/{slug}` if backend supports it
    - _Requirements: 3.7, 11.1_

  - [ ] 8.3 Create `frontend/src/services/searchService.js`
    - `searchTools(query, params)` — `GET /tools/search?q={query}` with optional additional params
    - _Requirements: 3.7, 11.1_

- [ ] 9. Frontend hooks
  - [ ] 9.1 Create `frontend/src/hooks/useFavorites.js`
    - Reads/writes `ai_apartment_favorites` in `localStorage` as a JSON array of tool IDs, newest-first
    - Exports: `favorites` (array), `addFavorite(id)`, `removeFavorite(id)`, `isFavorite(id)`, `clearFavorites()`
    - `addFavorite` enforces max 500 entries; returns `{ success: false, reason: "limit_reached" }` if full
    - Updates React state synchronously so UI reflects changes immediately
    - _Requirements: 9.1, 9.2, 9.3, 9.5, 9.9_

  - [ ]* 9.2 Write property tests for `useFavorites` (Properties 8 and 9)
    - **Property 8: Favorites localStorage round-trip**
    - In `frontend/src/__tests__/properties/useFavorites.test.js`, use `fast-check` to generate sequences of add/remove operations; assert `favorites` equals the expected set, newest-first, no duplicates, count ≤ 500
    - **Property 9: Favorites capacity invariant**
    - Generate a list already at 500 items; assert adding any ID leaves the list unchanged at 500 and returns `reason: "limit_reached"`
    - **Validates: Requirements 9.2, 9.9**

  - [ ] 9.3 Create `frontend/src/hooks/useCompareSet.js` and `frontend/src/context/CompareContext.jsx`
    - `CompareContext` provides the compare set to the whole app; persisted in `sessionStorage`
    - Exports: `compareSet` (array, max 4), `addToCompare(id)`, `removeFromCompare(id)`, `clearCompare()`, `isInCompare(id)`
    - `addToCompare` is a no-op if the set already has 4 items or the ID is already present
    - _Requirements: 8.1, 8.2, 8.4, 8.8, 8.9_

  - [ ]* 9.4 Write property tests for `useCompareSet` (Property 10)
    - **Property 10: Comparison set capacity and deduplication invariant**
    - Use `fast-check` to generate sequences of add/remove operations; assert set never exceeds 4 items and never contains duplicates
    - **Validates: Requirements 8.1, 8.4**

  - [ ] 9.5 Create `frontend/src/hooks/useFilters.js`
    - Reads and writes filter state from URL query params using React Router `useSearchParams`
    - Exports: `filters` (object), `setFilter(key, value)`, `clearFilters()`
    - _Requirements: 6.1, 6.9, 6.10_

  - [ ] 9.6 Create `frontend/src/hooks/usePagination.js`
    - Accepts `total` and `limit`; computes `currentPage`, `totalPages`, `offset`
    - Exports: `offset`, `currentPage`, `goToPage(n)`, `nextPage()`, `prevPage()`
    - _Requirements: 3.2, 10.9_

- [ ] 10. Shared and reusable components
  - [ ] 10.1 Create `frontend/src/components/LoadingSpinner.jsx` and `frontend/src/components/ErrorMessage.jsx`
    - `LoadingSpinner`: accepts optional `label` prop; renders an accessible animated spinner with `role="status"` and `aria-label`
    - `ErrorMessage`: accepts `message` (string) and optional `onRetry` (function); renders error text and a retry button when `onRetry` is provided
    - _Requirements: 1.6, 1.7, 11.4, 11.5_

  - [ ] 10.2 Create `frontend/src/components/EmptyState.jsx`
    - Accepts `message` (string) and optional `cta` (`{ label, to }` for a React Router `<Link>`)
    - _Requirements: 1.9, 2.8, 11.6_

  - [ ] 10.3 Create `frontend/src/components/PricingBadge.jsx`
    - Accepts `pricingType` prop; renders the exact label ("Completely Free", "Freemium", "Free Trial", "Paid Only") with colour-coded Tailwind classes — never "Free" in isolation
    - Colour mapping: "Completely Free" → green, "Freemium" → blue, "Free Trial" → yellow, "Paid Only" → gray
    - _Requirements: 4.3, 7.1, 7.2_

  - [ ]* 10.4 Write unit tests for `PricingBadge`
    - Assert all four exact labels render correctly
    - Assert no variant renders the isolated string "Free"
    - _Requirements: 4.3, 7.1, 7.2_

  - [ ] 10.5 Create `frontend/src/components/VerifiedDateBadge.jsx`
    - Accepts `date` (YYYY-MM-DD string); displays the date with a label
    - When the date is more than 90 days before today, renders a staleness warning label (e.g. "Information may be outdated")
    - _Requirements: 4.5, 7.4_

  - [ ]* 10.6 Write property test for `VerifiedDateBadge` (Property 16)
    - **Property 16: Verified date staleness flag**
    - Use `fast-check` to generate dates; assert staleness warning renders for any date > 90 days ago and does not render for dates ≤ 90 days ago
    - **Validates: Requirements 7.4**

  - [ ] 10.7 Create `frontend/src/components/FreeTierDetails.jsx`
    - Accepts `details` (object or null) and `freeAvailability` (boolean)
    - Renders each free-tier field when present; hides entirely when `freeAvailability` is false
    - Shows "Free-tier restriction details unavailable" notice when `freeAvailability` is true and `details` is absent/empty for Freemium or Free Trial tools
    - _Requirements: 4.4, 7.3, 7.6, 7.7_

  - [ ]* 10.8 Write unit tests for `FreeTierDetails`
    - Assert component is hidden when `freeAvailability` is false even if `details` is populated
    - Assert unavailability notice shows for Freemium/Free Trial with no details
    - _Requirements: 7.6, 7.7_

  - [ ] 10.9 Create `frontend/src/components/CategoryCard.jsx`
    - Accepts `category` prop; renders category name as a clickable card that navigates to `/categories/{slug}`
    - _Requirements: 1.3, 1.4_

  - [ ] 10.10 Create `frontend/src/components/ToolCard.jsx`
    - Accepts `tool`, `showCompare` (bool), `showFavorite` (bool) props
    - Displays: tool name, category, `PricingBadge`, brief description
    - Renders `CompareToggleButton` when `showCompare` is true; renders `FavoriteToggleButton` when `showFavorite` is true
    - _Requirements: 5.5, 1.5, 11.3_

  - [ ] 10.11 Create `frontend/src/components/CompareToggleButton.jsx` and `frontend/src/components/FavoriteToggleButton.jsx`
    - `CompareToggleButton`: accepts `toolId`, `inSet`, `disabled`, `onToggle`; disables the button and shows tooltip when `disabled` is true (compare set full)
    - `FavoriteToggleButton`: accepts `toolId`, `isFavorite`, `onToggle`; renders filled icon when `isFavorite=true`, unfilled when false
    - _Requirements: 8.1, 8.4, 9.1, 9.4_

  - [ ]* 10.12 Write unit tests for `ToolCard` compare behaviour
    - Assert add-to-compare button is disabled when compare set contains 4 items
    - _Requirements: 8.4_

  - [ ] 10.13 Create `frontend/src/components/FilterPanel.jsx`
    - Accepts `filters` (object), `options` (available filter choices), `onChange` (callback), `onClear` (callback)
    - Renders controls for: Category (select), Pricing_Type (select), Free_Availability (checkbox), Capabilities (multi-select), Input_Type (select), Output_Type (select), API_Availability (checkbox), Watermark presence (checkbox)
    - Shows total count of active filters; "Clear all" button resets all filters in one click
    - _Requirements: 6.1, 6.9, 6.10_

  - [ ]* 10.14 Write unit tests for `FilterPanel`
    - Assert clear button resets all filters in a single interaction
    - Assert active filter count is displayed correctly
    - _Requirements: 6.9, 6.10_

  - [ ] 10.15 Create `frontend/src/components/Pagination.jsx`
    - Accepts `total`, `limit`, `offset`, `onChange`; renders previous/next controls and page indicator
    - _Requirements: 3.2_

  - [ ] 10.16 Create `frontend/src/components/ComparisonIndicator.jsx`
    - Accepts `count` (number), `onOpen` (callback); renders a floating badge showing the number of tools in the comparison set; only visible when `count > 0`
    - _Requirements: 8.2, 8.3_

  - [ ] 10.17 Create `frontend/src/components/SearchBar.jsx`
    - Accepts `onSubmit` callback and optional `initialValue`
    - Validates query: 1–200 characters, at least one non-whitespace character
    - Shows inline error message if validation fails; does NOT submit to backend on validation failure
    - _Requirements: 1.2, 5.1, 11.7_

  - [ ]* 10.18 Write unit tests for `SearchBar`
    - Assert empty query is not submitted
    - Assert whitespace-only query is not submitted
    - Assert valid query calls `onSubmit`
    - _Requirements: 11.7_

- [ ] 11. Layout and navigation
  - [ ] 11.1 Create `frontend/src/components/NavBar.jsx`
    - Renders platform name/logo linking to `/`
    - Includes `SearchBar` (persistent; navigates to `/search?q=...` on submit)
    - Includes `ComparisonIndicator` reading from `CompareContext`
    - Includes navigation links: Categories (`/categories`), Favorites (`/favorites`)
    - _Requirements: 5.1, 8.2, 8.3_

  - [ ] 11.2 Create `frontend/src/components/Layout.jsx`
    - Renders `NavBar` at the top and a `<main>` containing `<Outlet>` for child routes
    - Wrap all routes with `Layout` in `App.jsx`
    - _Requirements: 11.2_

  - [ ] 11.3 Wrap the app in `CompareContext.Provider` in `frontend/src/main.jsx`
    - Ensures `useCompareSet` and `ComparisonIndicator` share the same comparison state across all pages
    - _Requirements: 8.2_

- [ ] 12. Page components
  - [ ] 12.1 Create `frontend/src/pages/HomePage.jsx`
    - Fetches categories via `getCategories()` and featured tools via `getTools({ limit: 8 })`
    - Renders: platform name, tagline ("One apartment. Different AI capabilities."), description (≤300 chars), prominent `SearchBar`, `CategoryGrid` of `CategoryCard[]` (navigates on click), featured `ToolCard[]` (4–12 tools)
    - Shows `LoadingSpinner` while fetching; `ErrorMessage` with retry on failure; "No categories available" message if categories array is empty
    - Handles 320px–1920px viewports with responsive Tailwind classes (no horizontal scrolling)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_

  - [ ] 12.2 Create `frontend/src/pages/CategoryListPage.jsx`
    - Fetches all active categories via `getCategories()`; renders alphabetically sorted list of `CategoryCard[]`
    - Shows `LoadingSpinner` while loading; `ErrorMessage` on failure; `EmptyState` if zero categories
    - _Requirements: 2.1_

  - [ ] 12.3 Create `frontend/src/pages/CategoryDetailPage.jsx`
    - Reads `:categorySlug` from URL; resolves to a category and fetches its tools via `getToolsByCategory()`
    - Renders: category name, description, alphabetically sorted `ToolCard[]` (with compare and favorite toggles)
    - Shows `LoadingSpinner` while loading; `ErrorMessage` if backend returns an error or slug not found (with "category not found" message); `EmptyState` if category has no active tools
    - _Requirements: 2.2, 2.7, 2.8, 2.9, 2.11_

  - [ ] 12.4 Create `frontend/src/pages/ToolDetailPage.jsx`
    - Reads `:toolId` from URL; fetches via `getToolById()`
    - Renders all 17 tool fields: name, description, category, `PricingBadge`, `FreeTierDetails`, `VerifiedDateBadge`, capabilities, input/output types, `watermark_info`, API availability, best use cases, limitations
    - Renders website link (opens in new tab); hides link if `website_url` is absent
    - Renders `CompareToggleButton` and `FavoriteToggleButton`
    - Shows `LoadingSpinner` visible within 200ms of navigation; specific not-found message + back link for 404; generic `ErrorMessage` for other errors (no partial data)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9_

  - [ ] 12.5 Create `frontend/src/pages/SearchResultsPage.jsx`
    - Reads `?q=` from URL search params; fetches via `searchTools(q)`
    - Renders `FilterPanel`, matching `ToolCard[]`, `Pagination`
    - Shows `LoadingSpinner` while loading; preserves search input on error; `EmptyState` if no results
    - _Requirements: 5.2, 5.5, 5.6, 5.8, 5.9_

  - [ ] 12.6 Create `frontend/src/pages/CataloguePage.jsx`
    - Fetches tools with active `filters` and `pagination` state from `useFilters` and `usePagination` hooks; URL query-string driven
    - Renders `FilterPanel`, `ToolCard[]`, `Pagination`
    - Results appear within 3 seconds of filter application
    - `EmptyState` with clear-filters prompt when no tools match; `LoadingSpinner` while loading
    - _Requirements: 6.1, 6.2, 6.7, 6.9, 6.10_

  - [ ] 12.7 Create `frontend/src/pages/ComparePage.jsx`
    - Reads tool IDs from `CompareContext`; fetches each tool's data in parallel
    - Renders side-by-side table/grid (`ComparisonTable` → `ComparisonColumn[]`) with all comparison fields; "Not available" for missing field values
    - Shows `LoadingSpinner` while loading; per-column error for tools that fail to load (other columns still render); "Not available" indicators for missing fields
    - "Remove" button per tool and "Clear all" button; navigates away with message when fewer than 2 tools remain after removal
    - Does NOT declare a "best" tool
    - _Requirements: 8.5, 8.6, 8.7, 8.8, 8.9, 8.10, 8.11, 8.12_

  - [ ] 12.8 Create `frontend/src/pages/FavoritesPage.jsx`
    - Reads favorite tool IDs from `useFavorites`; fetches each tool's data
    - Renders `ToolCard[]` sorted newest-added-first; `EmptyState` with link to catalogue if no favorites
    - `LoadingSpinner` while loading (suppresses list until complete)
    - Placeholder entry with dismiss control for tool IDs that return 404 from backend
    - Shows error if adding a 500th favorite
    - _Requirements: 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9_

- [ ] 13. Checkpoint — full integration test
  - Ensure all frontend and backend tests pass, ask the user if questions arise.
  - Run `pytest backend/tests/ --tb=short` and `npm run test --run` in `frontend/`
  - Manually verify: home page loads, a category page shows tools, tool detail page renders all fields, compare works with 2 tools, favorites persist across refresh

- [ ] 14. Seed data
  - [ ] 14.1 Create `backend/scripts/seed_categories.py`
    - Writes the 13 initial category documents to Firestore: Chat, Writing, Research, Image Generation, Video Generation, Voice & Audio, Music, Coding, Design, Productivity, Document AI, Translation, AI Agents
    - Each document follows the `CategoryRecord` schema; `active: true`
    - Script is idempotent — uses category slug as document ID so re-running does not duplicate
    - _Requirements: 2.3, 2.6_

  - [ ] 14.2 Create `backend/scripts/seed_tools.py`
    - Writes at least 10 sample tool documents to Firestore covering at least 4 categories
    - Each document includes all required fields from Requirement 3.1 with realistic values; `verified_date` set to today's date; `active: true`
    - Includes at least one tool per `pricing_type` to allow testing all four labels
    - Script is idempotent — uses a deterministic tool ID as document ID
    - _Requirements: 3.1, 1.5_

- [ ] 15. Final checkpoint — full system smoke test
  - Ensure all tests pass, ask the user if questions arise.
  - After running seed scripts, start backend (`uvicorn app.main:app --reload`) and frontend (`npm run dev`) manually; verify end-to-end flows: browse categories, view tool detail, search, compare two tools, add/remove favorites

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP; they will not be automatically implemented
- Property tests are placed close to the code they test so correctness regressions are caught early
- Frontend env var `VITE_API_BASE_URL` must be set before starting the dev server (copy `.env.example` to `.env`)
- Backend `.env` must be configured with Firebase credentials before starting the API server
- The search router (`search.py`) must be registered in `main.py` before `tools.py` to prevent `/tools/search` being matched as `/tools/{tool_id}`
- Comparison set uses `sessionStorage` (survives same-tab refresh but resets on new tab); favorites use `localStorage` (persistent across sessions)
- All 17 correctness properties from the design document are covered by property-based test sub-tasks

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["2.1", "2.3", "7.1"] },
    { "id": 2, "tasks": ["2.2", "3.1", "3.2", "3.3", "7.2", "7.3", "7.4", "7.5"] },
    { "id": 3, "tasks": ["3.4", "4.1", "4.2", "8.1", "8.2", "8.3"] },
    { "id": 4, "tasks": ["5.1", "5.2", "9.1", "9.3", "9.5", "9.6"] },
    { "id": 5, "tasks": ["5.3", "5.4", "5.5", "9.2", "9.4", "10.1", "10.2", "10.3", "10.5", "10.7", "10.9", "10.17"] },
    { "id": 6, "tasks": ["6.1", "6.2", "6.3", "10.4", "10.6", "10.8", "10.10", "10.11", "10.13", "10.15", "10.16", "10.18"] },
    { "id": 7, "tasks": ["6.4", "10.12", "10.14", "11.1", "11.2", "11.3"] },
    { "id": 8, "tasks": ["6.5", "12.1", "12.2", "12.3", "12.4", "12.5", "12.6", "12.7", "12.8"] },
    { "id": 9, "tasks": ["13"] },
    { "id": 10, "tasks": ["14.1", "14.2"] },
    { "id": 11, "tasks": ["15"] }
  ]
}
```
