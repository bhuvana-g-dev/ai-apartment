---
inclusion: auto
name: kiro-lessons
description: Activate when user asks about Kiro features, lessons, or how this project uses Kiro capabilities
---

# Kiro University Lessons — AI Apartment

This document records how AI Apartment demonstrates each Kiro University lesson. It is injected automatically into context when relevant.

## Lesson 1: Spec-Driven Development

This project was built entirely spec-first. The spec lives at `.kiro/specs/ai-apartment-mvp/`:

- `requirements.md` — 11 requirements, 90+ acceptance criteria in EARS format
- `design.md` — full system architecture, API contract, Firestore schema, 17 correctness properties
- `tasks.md` — 56 implementation tasks in 11 dependency waves

Workflow used: **Requirements-First** (requirements → design → tasks → implementation).

The spec drove every file created. No code was written without a corresponding requirement and design decision.

**How to use spec-driven development in your own project:**
1. Open Kiro chat and describe your feature
2. Choose "Build a Feature" → "Requirements"
3. Kiro generates requirements.md, then design.md, then tasks.md
4. Click "Run All Tasks" to implement

## Lesson 2: Steering Documents

This project has 4 steering files in `.kiro/steering/`:

| File | Inclusion | Purpose |
|---|---|---|
| `product.md` | always | Platform vision, core features, principles |
| `tech.md` | always | Tech stack, architecture rules, code conventions |
| `structure.md` | always | Directory layout, naming conventions, current status |
| `lessons.md` (this file) | auto | Kiro University lesson documentation |

Steering files shape every AI response in this project. Kiro reads them before answering any question, so they act as persistent team standards.

**Steering file inclusion modes:**
- `inclusion: always` — injected in every session automatically
- `inclusion: auto` — injected when the topic matches (this file)
- `inclusion: manual` — only when you reference it with `#steering-file-name` in chat
- `inclusion: fileMatch` + `fileMatchPattern` — injected when matching files are in context

## Lesson 3: Hooks

This project has two hook files in `.kiro/hooks/`:

| File | Hooks |
|---|---|
| `kironomics.json` | Tool counter, prompt counter, session reporter (challenge tracking) |
| `project-hooks.json` | Python syntax check on save, frontend lint reminder on save, test reminder after task |

**Hook triggers used:**
- `PostFileSave` — fires when any file is saved; matcher filters by file extension
- `PostTaskExec` — fires after a spec task completes
- `UserPromptSubmit` — fires when user sends a message
- `Stop` — fires when agent execution ends

Hooks enable automation without manual intervention — linting, testing reminders, and progress tracking happen automatically.

## Lesson 4: Property-Based Testing (IDE only)

Property-based tests live in `backend/tests/test_properties.py`.

**Library:** Hypothesis (Python) — installed in `requirements.txt`

**Properties tested (7 of 17 from design.md):**
- Property 2: Pagination covers all tools exactly once
- Property 3: Filter AND semantics (every result satisfies all filters)
- Property 4: Capabilities filter is monotonically narrowing
- Property 5: Search only returns active tools
- Property 6: Pricing type label invariant
- Property 11: Search case-insensitivity
- Property 13: Search result count ≤ 50

**Run the tests:**
```bash
cd backend
venv\Scripts\python.exe -m pytest tests/test_properties.py -v
```

PBT differs from unit tests: instead of hand-crafting examples, Hypothesis generates hundreds of random inputs and tries to falsify each property. If a property fails, it shrinks the input to the minimal failing case.

## Lesson 5: Powers

A Kiro Power for this project is packaged at `.kiro/powers/ai-apartment-power/`.

The power bundles:
- `power.json` — metadata, description, keywords
- `steering/ai-apartment-context.md` — project context steering
- A custom skill for seeding and managing AI tool data

Powers are distributable: another developer can install this power into their Kiro workspace to instantly get AI Apartment domain knowledge and tools.

**Install a power:** Open Kiro → Powers panel → Install from path or registry.

## Lesson 6: Model Context Protocol (MCP)

MCP configuration lives at `.kiro/settings/mcp.json`.

This project configures two MCP servers:
- **aws-docs** — fetches live AWS documentation (useful for Firestore/Firebase docs lookup)
- **filesystem** — gives Kiro structured read access to project files

MCP servers extend Kiro with external tools that go beyond the built-in capabilities. When an MCP server is active, its tools appear automatically in Kiro's tool palette.

**To activate:** Open `.kiro/settings/mcp.json` and ensure `disabled: false`.

## Lesson 7: Custom Agents

A custom agent is defined at `.kiro/agents/data-manager.md`.

The **AI Apartment Data Manager** agent specialises in:
- Adding new AI tools to the Firestore seed scripts
- Updating pricing and free-tier information
- Verifying tool records against the data model schema
- Generating batch seed data from a description

**Usage:** In Kiro chat, type `@data-manager add a new tool for Gemini in the chat-ai category`.

Custom agents carry specialised context and instructions that general Kiro doesn't have. They're ideal for domain-specific repetitive tasks.

## Lesson 8: Kiro Web, Cloud Sessions, and Cloud Configuration

See `.kiro/steering/cloud-sessions.md` for the full setup guide.

Key points for AI Apartment:
- Cloud sessions allow continuing work on any machine — your spec, steering, and hooks sync automatically
- The `.kiro/` folder is committed to GitHub, so cloud sessions pick up project context immediately
- `ugmdu.json` stores the Kiro University campaign ID and participant ID for progress tracking
- Never commit `backend/.env` — use `.env.example` as the template

## Lesson 9: Package a Kiro Power

The AI Apartment power is packaged at `.kiro/powers/ai-apartment-power/`.

**Power structure:**
```
.kiro/powers/ai-apartment-power/
├── power.json              — metadata, keywords, skills list
├── steering/
│   └── ai-apartment-context.md  — domain knowledge steering
└── skills/
    └── seed-tool.md        — skill: add a new AI tool record
```

To publish a power to the Kiro registry, zip the power directory and submit via the Kiro Powers portal. Other developers then install it with one click.
