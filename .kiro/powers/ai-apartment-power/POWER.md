# AI Apartment Power

This Kiro Power bundles domain knowledge and skills for the AI Apartment project — an AI tool discovery, comparison, and cataloguing platform built with React + FastAPI + Firebase Firestore.

## What this power includes

- **Steering**: AI Apartment data model, valid category IDs, pricing type rules, architecture constraints
- **Skills**: Add new AI tools and categories to the Firestore seed scripts

## Skills

### seed-tool
Guides adding a new AI tool record to `backend/scripts/seed_tools.py` with all 17 required fields validated.

### add-category
Guides adding a new AI tool category (room) to `backend/scripts/seed_categories.py`.

## Installation

This power is included in the AI Apartment repository at `.kiro/powers/ai-apartment-power/`.

To install in another project, copy the `ai-apartment-power/` directory to your project's `.kiro/powers/` folder.

## Data Model Quick Reference

| Field | Type | Notes |
|---|---|---|
| `pricing_type` | enum | "Completely Free" \| "Freemium" \| "Free Trial" \| "Paid Only" |
| `category_id` | string | Must match a valid category slug |
| `verified_date` | string | YYYY-MM-DD format |
| `active` | boolean | false = hidden from UI |

## Valid Category IDs

`chat-ai` · `writing-ai` · `research-ai` · `image-generation` · `video-generation` · `voice-audio` · `music-generation` · `coding-ai` · `design-ai` · `productivity-ai` · `document-ai` · `translation-ai` · `ai-agents`
