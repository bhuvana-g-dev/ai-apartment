# Project Structure

The project is at the foundation stage. The structure below reflects the intended layout as development proceeds.

```
ai-apartment/
├── frontend/                   # React + Vite application
│   ├── public/
│   ├── src/
│   │   ├── assets/             # Static assets (images, icons)
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page-level components (one per route)
│   │   ├── services/           # Axios API calls to the backend
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Pure utility functions
│   │   ├── types/              # TypeScript/JSDoc type definitions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                    # FastAPI application
│   ├── app/
│   │   ├── routers/            # Route handlers grouped by domain
│   │   ├── models/             # Pydantic request/response models
│   │   ├── services/           # Business logic and AI API integrations
│   │   ├── db/                 # Firestore access layer
│   │   └── main.py             # FastAPI app entry point
│   ├── requirements.txt
│   └── .env                    # Secrets (never committed)
│
├── .kiro/                      # Kiro IDE configuration
│   └── steering/               # AI steering documents
├── .gitignore
└── README.md
```

## Key Conventions

- **Frontend ↔ Backend separation:** React never calls Firestore or AI APIs directly. All data goes through FastAPI.
- **Services layer:** `frontend/src/services/` holds all Axios calls. Components do not construct API requests themselves.
- **Routers by domain:** Backend routers are split by concern (e.g., `tools.py`, `categories.py`, `search.py`, `recommendations.py`).
- **Data model is central:** The AI tool data model (fields listed in product.md) drives both the Firestore schema and the API response shape.
- **Extensibility:** Categories and tools are data, not hardcoded UI. New categories require no frontend code changes — only new data records.
- **Environment files:** Never commit `.env` files. Provide `.env.example` templates instead.

## Current Status

Repository is at the foundation stage — only `.kiro/` configuration and `README.md` exist. Scaffold frontend and backend directories before beginning feature development.
