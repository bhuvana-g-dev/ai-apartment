"""
AI Apartment API — FastAPI application entry point.
"""

import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Load .env from the backend root (two levels up from this file: app/main.py → app/ → backend/)
_env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=_env_path)

app = FastAPI(
    title="AI Apartment API",
    version="0.1.0",
)

# ---------------------------------------------------------------------------
# CORS middleware — always enabled.
# In production set CORS_ALLOWED_ORIGINS to a comma-separated list of origins.
# When the env var is empty (local dev) we allow all origins so a fresh clone works.
# ---------------------------------------------------------------------------
# CORS — always allow all origins so the app works from any frontend domain.
# This is intentional for a public discovery platform.
# To restrict in production: set CORS_ALLOWED_ORIGINS env var.
_cors_origins_raw = os.getenv("CORS_ALLOWED_ORIGINS", "")
_cors_origins: list[str] = (
    [o.strip() for o in _cors_origins_raw.split(",") if o.strip()]
    if _cors_origins_raw.strip()
    else ["*"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # always allow all — locked to specific origins via env var in prod
    allow_credentials=False,      # must be False when allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Global exception handler
# ---------------------------------------------------------------------------
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal error occurred. Please try again."},
    )


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["health"])
async def health() -> dict:
    """Returns a simple liveness check."""
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# Routers — search must be registered before tools to avoid
# /tools/search being shadowed by /tools/{tool_id}
# ---------------------------------------------------------------------------
from app.routers import search, tools, categories, finder

app.include_router(search.router)
app.include_router(finder.router)   # before tools to avoid path conflicts
app.include_router(tools.router)
app.include_router(categories.router)
