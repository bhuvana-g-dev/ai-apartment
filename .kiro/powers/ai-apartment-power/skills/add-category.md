# Skill: Add a New AI Tool Category

## Purpose

Add a new category (room) to `backend/scripts/seed_categories.py` so that tools can be assigned to it.

---

## When to Use This Skill

Use this skill when the user says any of:
- "Add a new category"
- "Create a new room"
- "I want a [category name] category"
- "Add [category name] to the platform"

---

## Existing Categories (Do Not Duplicate)

Before creating a new category, confirm the slug doesn't already exist:

| Slug | Display Name |
|---|---|
| `chat-ai` | Chat AI |
| `writing-ai` | Writing AI |
| `research-ai` | Research AI |
| `image-generation` | Image Generation |
| `video-generation` | Video Generation |
| `voice-audio` | Voice & Audio |
| `music-generation` | Music Generation |
| `coding-ai` | Coding AI |
| `design-ai` | Design AI |
| `productivity-ai` | Productivity AI |
| `document-ai` | Document AI |
| `translation-ai` | Translation AI |
| `ai-agents` | AI Agents |

If the user's intent fits an existing category, point that out and suggest using the existing one.

---

## Step-by-Step Instructions

### Step 1 — Choose a Slug

Rules for the slug:
- Lowercase letters and hyphens only (no underscores, no spaces, no numbers unless needed)
- Descriptive and short — it becomes the Firestore document ID and the URL segment
- Must be unique — not already in the list above

Examples:
| Proposed Category | Good Slug |
|---|---|
| 3D Generation | `3d-generation` |
| Avatar & Character | `avatar-ai` |
| Data Analysis | `data-analysis` |
| Presentation AI | `presentation-ai` |

### Step 2 — Write the Display Name

- Title Case
- Should match what a user would see in the navigation
- Keep it short (2–3 words max)

### Step 3 — Write the Description

- One sentence only
- Describes what AI tools in this category do
- Start with a verb: "Generate…", "Automate…", "Analyse…", "Create…"

Examples:
- `"Generate realistic 3D models and scenes using AI prompts."`
- `"Automate data analysis, chart generation, and insight extraction with AI."`
- `"Create AI-powered presentations and slide decks from text or outlines."`

### Step 4 — Add to the Seed Script

Open `backend/scripts/seed_categories.py`. Find the `CATEGORIES` list and append the new entry **before the closing** `]`:

```python
{"slug": "your-slug", "name": "Your Category Name", "description": "What AI tools in this category do."},
```

Full entry format:
```python
{
    "slug": "3d-generation",
    "name": "3D Generation",
    "description": "Generate 3D models, scenes, and assets from text prompts or images using AI."
},
```

Both dict formats (single-line and multi-line) are acceptable — match the style used in the existing file.

### Step 5 — Run the Seed Script

Seeds are idempotent — re-running overwrites existing docs using the slug as the document ID. No duplicates are created.

```powershell
# From the ai-apartment root directory:
cd backend
venv\Scripts\python.exe -m scripts.seed_categories
```

### Step 6 — Update the Valid Category ID List

After adding the new category, remind the user (or do it yourself if applicable) to update:

1. `POWER.md` — add the new slug to the Valid Category IDs section
2. `steering/ai-apartment-context.md` — add it to the Valid Category IDs table
3. Any seed tool that should belong to this new category — use `seed-tool` skill to add tools

---

## Full Example — Adding "3D Generation"

Entry to append to `backend/scripts/seed_categories.py`:

```python
{"slug": "3d-generation", "name": "3D Generation", "description": "Generate 3D models, scenes, and textured assets from text descriptions or reference images using AI."},
```

Then run:
```powershell
cd backend
venv\Scripts\python.exe -m scripts.seed_categories
```

After the seed runs, the category is live in Firestore and the frontend will display it automatically — no frontend code changes needed.

---

## Notes

- The frontend reads categories from the API at runtime — adding a category to Firestore is sufficient
- There is no hardcoded category list in the React code; categories are data-driven
- The `CategoryIcon` component in the frontend has a default fallback icon for unknown categories, so new categories render immediately even without a dedicated icon
- To add a dedicated icon for the new category, update `frontend/src/components/CategoryIcon.jsx` with a mapping for the new slug
