"""
AI Apartment API — FastAPI application entry point.
"""

import os

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Load environment variables from .env at startup before anything else
load_dotenv()

app = FastAPI(
    title="AI Apartment API",
    version="0.1.0",
)

# ---------------------------------------------------------------------------
# CORS middleware (task 2.2 will flesh this out; placeholder registered here
# so the middleware chain exists from the start)
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
# Global exception handler — catches any unhandled exception and returns a
# sanitised HTTP 500.  No stack traces, no module paths, no exception names.
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
# Router stubs — actual implementations land in tasks 6.1-6.3.
# Registered in the order search → tools → categories so that
# /tools/search is never shadowed by /tools/{tool_id}.
# ---------------------------------------------------------------------------
# from app.routers import search, tools, categories   # uncomment in task 6.x
# app.include_router(search.router)
# app.include_router(tools.router)
# app.include_router(categories.router)
