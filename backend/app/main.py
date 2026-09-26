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
# CORS middleware
# ---------------------------------------------------------------------------
_cors_origins_raw = os.getenv("CORS_ALLOWED_ORIGINS", "")
_cors_origins: list[str] = (
    [origin.strip() for origin in _cors_origins_raw.split(",") if origin.strip()]
    if _cors_origins_raw
    else []
)

if _cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=_cors_origins,
        allow_credentials=True,
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
from app.routers import search, tools, categories

app.include_router(search.router)
app.include_router(tools.router)
app.include_router(categories.router)
