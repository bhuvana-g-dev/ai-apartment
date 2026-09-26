# Skill: Add a New AI Category

## Purpose
Add a new category to `backend/scripts/seed_categories.py` so tools can be assigned to it.

## Instructions

1. **Choose a slug** — lowercase, hyphenated, unique (e.g., `3d-generation`)
2. **Write the name** — Title Case display name (e.g., `3D Generation`)
3. **Write a description** — one sentence, what tools in this category do
4. **Add the entry** to the CATEGORIES list in `seed_categories.py`

## New Category Entry Format

```python
{"slug": "your-slug", "name": "Your Category Name", "description": "What AI tools in this category do."},
```

5. **Re-run the seed script:**
   ```
   cd backend
   venv\Scripts\python.exe -m scripts.seed_categories
   ```

Since seeds use the slug as the document ID, re-running is safe — it overwrites existing docs without creating duplicates.
