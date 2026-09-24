# Tech Stack

## Frontend

| Layer | Technology |
|---|---|
| Framework | React |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| HTTP client | Axios |

## Backend

| Layer | Technology |
|---|---|
| Framework | FastAPI (Python) |
| Database | Firebase Firestore |
| AI services | AI APIs (accessed through backend only) |

## Architecture

```
React (Vite)
    ↓  Axios
FastAPI (Python)
    ↓
Firestore / AI service APIs
```

**Security rule:** AI API keys and sensitive credentials must never be exposed in the React frontend. All AI API calls go through the FastAPI backend.

## Code Conventions

- Frontend API/service calls must live in a dedicated service or API layer — not inline in components
- Use reusable React components
- Validate user input on both frontend and backend
- Handle loading, empty, and error states explicitly
- Do not hardcode sensitive credentials anywhere in the codebase
- Avoid unnecessary dependencies; prefer the libraries listed above

## Common Commands

> To be filled in as the project is scaffolded. Typical commands will include:

```bash
# Frontend
npm install
npm run dev       # Vite dev server (run manually in terminal)
npm run build
npm run preview

# Backend
pip install -r requirements.txt
uvicorn main:app --reload   # FastAPI dev server (run manually in terminal)
```

## Environment

- OS: Windows (PowerShell)
- Use PowerShell-compatible syntax: `;` as command separator, `$env:VAR` for environment variables
- Store secrets in `.env` files; never commit them to version control
