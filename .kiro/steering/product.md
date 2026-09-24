# Product: AI Apartment

## Overview

AI Apartment is an AI tool discovery, comparison, and recommendation platform.

The "apartment" metaphor: an apartment has different rooms, each room is a category of AI tools. The platform organizes the fragmented AI tool landscape into one place so users can discover, understand, compare, and find the right tool for their task.

**Core tagline:** One apartment. Different AI capabilities.

## Primary Problem

Users struggle to navigate the AI tool ecosystem. They don't know:
- Which tool suits a particular task
- What a tool actually does
- Whether it has a free tier and what the real limits are
- Whether it adds watermarks or has commercial restrictions
- How it compares with similar tools

## Core Features

1. **AI Category Exploration** — Tools organized into rooms (categories): Chat, Writing, Research, Image Generation, Video Generation, Voice & Audio, Music, Coding, Design, Productivity, Document AI, Translation, AI Agents. Architecture must support adding new categories.

2. **AI Tool Catalogue** — Structured tool records: name, description, category, website, pricing type, free availability, free-tier limits, capabilities, input/output types, watermark info, API availability, best use cases, limitations, last verified date, active status.

3. **Free AI Focus** — A key differentiator. Never just label a tool "Free". Distinguish: Completely Free / Freemium / Free Trial / Paid Only. Track limits (credits, generations, daily/monthly caps, watermarks, feature restrictions, commercial-use restrictions). Always show last verified date because pricing changes frequently.

4. **Search & Filter** — Search by name, category, capability, use case, keyword. Filter by category, pricing type, free availability, capabilities, input/output type, API availability, watermark, and other attributes.

5. **AI Tool Detail Page** — Full breakdown of a tool: what it does, capabilities, pricing, free limits, use cases, limitations, verification date. Actions: visit website, add to favorites, add to comparison.

6. **Tool Comparison** — Side-by-side comparison of multiple tools across capabilities, pricing, free limits, watermarks, API, input/output, use cases. Present factual differences — do not declare a "winner".

7. **Task-Based AI Finder** — User describes a task in natural language (e.g. "I want to create a 30-second cinematic video from an image for free"). System identifies requirements and recommends tools with reasoning explaining why each tool matches.

8. **Favorites** — Users can save tools for later reference.

9. **Admin / Data Management** — Internal capability to add, edit, deactivate tools; update pricing, free-tier limits, capabilities, and verification dates.

## Principles

- Build a real functional application, not a visual mockup
- Do not make unsupported claims about AI tools
- Prefer structured data over hardcoded UI content
- Keep AI tool information maintainable — pricing and free tiers change frequently
- Build incrementally
