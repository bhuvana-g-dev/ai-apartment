"""
Seed script: writes the 13 AI Apartment categories to Firestore.
Idempotent — uses the category slug as the Firestore document ID.

Usage (from repo root, with backend .env configured):
    cd backend
    python -m scripts.seed_categories
"""

import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from app.db.firestore_client import get_db

CATEGORIES = [
    {"slug": "chat-ai",          "name": "Chat & Conversational AI", "description": "AI assistants and conversational agents for dialogue, Q&A, and reasoning."},
    {"slug": "writing-ai",       "name": "Writing AI",               "description": "AI tools for drafting, editing, summarising, and improving written content."},
    {"slug": "research-ai",      "name": "Research AI",              "description": "AI tools that assist with research, fact-finding, and knowledge synthesis."},
    {"slug": "image-generation", "name": "Image Generation",         "description": "AI tools that generate or edit images from text prompts or reference images."},
    {"slug": "video-generation", "name": "Video Generation",         "description": "AI tools that create, edit, or transform video content."},
    {"slug": "voice-audio",      "name": "Voice & Audio",            "description": "AI tools for voice synthesis, cloning, transcription, and audio processing."},
    {"slug": "music-generation", "name": "Music Generation",         "description": "AI tools that compose, generate, or remix music and sound."},
    {"slug": "coding-ai",        "name": "Coding AI",                "description": "AI assistants that help write, review, explain, and debug code."},
    {"slug": "design-ai",        "name": "Design AI",                "description": "AI tools for UI/UX design, graphic design, and visual asset creation."},
    {"slug": "productivity-ai",  "name": "Productivity AI",          "description": "AI tools that automate tasks, manage workflows, and boost personal productivity."},
    {"slug": "document-ai",      "name": "Document AI",              "description": "AI tools for reading, summarising, extracting, and working with documents."},
    {"slug": "translation-ai",   "name": "Translation AI",           "description": "AI tools that translate text or speech across languages."},
    {"slug": "ai-agents",        "name": "AI Agents",                "description": "Autonomous AI agents that plan, act, and complete multi-step tasks."},
]


def seed():
    db = get_db()
    col = db.collection("categories")
    for cat in CATEGORIES:
        doc_id = cat["slug"]
        col.document(doc_id).set({**cat, "active": True, "icon": None})
        print(f"  \u2713 {cat['name']}")
    print(f"\nSeeded {len(CATEGORIES)} categories.")


if __name__ == "__main__":
    seed()
