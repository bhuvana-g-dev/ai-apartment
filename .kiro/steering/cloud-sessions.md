---
inclusion: manual
---

# Kiro Web, Cloud Sessions, and Cloud Configuration

## What Are Cloud Sessions?

Cloud sessions let you continue your Kiro work from any machine or browser. Your conversation history, spec state, and agent context persist in Kiro's cloud — not just on your local machine.

## How This Project Uses Cloud Sessions

### What Syncs Automatically
- `.kiro/specs/` — all spec documents (requirements, design, tasks)
- `.kiro/steering/` — all steering files that shape AI responses
- `.kiro/hooks/` — all automation hooks
- `.kiro/agents/` — custom agent definitions
- `.kiro/ugmdu.json` — challenge tracking state

### What Must Stay Local (Never Commit)
- `backend/.env` — contains Firebase credentials
- Firebase service account JSON files
- Any file matching patterns in `.gitignore`

## Setup for a New Machine

```bash
# 1. Clone the repo (gets all .kiro config)
git clone https://github.com/bhuvana-g-dev/ai-apartment.git
cd ai-apartment

# 2. Create backend secrets (never committed)
copy backend\.env.example backend\.env
# Fill in GOOGLE_APPLICATION_CREDENTIALS and FIRESTORE_PROJECT_ID

# 3. Install dependencies
cd backend && pip install -r requirements.txt
cd ../frontend && npm install

# 4. Open in Kiro — steering and hooks load automatically
```

## Cloud Configuration Files

| File | Purpose | Committed? |
|---|---|---|
| `.kiro/ugmdu.json` | Challenge tracking, participant ID | ✅ Yes |
| `.kiro/steering/*.md` | Project rules and context | ✅ Yes |
| `.kiro/hooks/*.json` | Automation hooks | ✅ Yes |
| `.kiro/specs/**` | Feature specs | ✅ Yes |
| `backend/.env` | Firebase secrets | ❌ Never |
| Firebase service account JSON | Credentials | ❌ Never |

## Kiro Web

Kiro Web (browser-based Kiro) reads the same `.kiro/` configuration from your connected repository. When you open a cloud session:
1. Kiro pulls the latest `.kiro/` folder from your GitHub repo
2. Steering files are loaded automatically
3. Spec progress is visible in the Specs panel
4. Hooks are registered for the session
