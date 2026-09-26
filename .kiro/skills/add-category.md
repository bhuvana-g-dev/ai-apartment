# Skill: Add a New AI Category

## Purpose
Add a new category to `backend/scripts/seed_categories.py` so tools can be assigned to it.

## When to use this skill
Use this skill when asked to add a new AI tool category (room) to the AI Apartment.

## Steps

1. Choose a slug — lowercase, hyphenated, unique (e.g., `3d-generation`)
2. Write a display name — Title Case (e.g., `3D Generation`)
3. Write a one-sentence description of what tools in this category do
4. Add the entry to CATEGORIES list in `backend/scripts/seed_categories.py`:

```python
{"slug": "your-slug", "name": "Your Name", "description": "What tools here do."},
```

5. Re-run the seed script (idempotent — safe to run multiple times):
   ```
   cd backend
   venv\Scripts\python.exe -m scripts.seed_categories
   ```

## Notes
- The slug becomes the Firestore document ID — keep it stable
- New categories appear automatically in the frontend with no code changes needed
- The frontend CategoryCard component auto-assigns an emoji icon based on slug
