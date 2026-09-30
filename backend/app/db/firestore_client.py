"""
Firestore client initialisation.

Supports two credential modes:
1. GOOGLE_APPLICATION_CREDENTIALS — path to a service account JSON file (local dev)
2. FIREBASE_SERVICE_ACCOUNT_JSON  — the full JSON string (production / Render / cloud)

FIRESTORE_PROJECT_ID is required in both cases.
"""

import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

_db = None


def _init_firebase() -> None:
    if firebase_admin._apps:
        return  # already initialised

    project_id = os.environ.get("FIRESTORE_PROJECT_ID", "").strip()
    if not project_id:
        raise EnvironmentError(
            "FIRESTORE_PROJECT_ID environment variable is required but not set."
        )

    # Mode 1 — JSON string (production: Render, Railway, etc.)
    sa_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON", "").strip()
    if sa_json:
        try:
            sa_dict = json.loads(sa_json)
        except json.JSONDecodeError as e:
            raise ValueError(
                f"FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON: {e}"
            )
        cred = credentials.Certificate(sa_dict)
        firebase_admin.initialize_app(cred, {"projectId": project_id})
        return

    # Mode 2 — file path (local dev)
    cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "").strip()
    if cred_path:
        if not os.path.isfile(cred_path):
            raise FileNotFoundError(
                f"Firebase credentials file not found at '{cred_path}'. "
                "Check GOOGLE_APPLICATION_CREDENTIALS."
            )
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred, {"projectId": project_id})
        return

    raise EnvironmentError(
        "No Firebase credentials found. Set either:\n"
        "  FIREBASE_SERVICE_ACCOUNT_JSON — full service account JSON string (production)\n"
        "  GOOGLE_APPLICATION_CREDENTIALS — path to service account JSON file (local dev)"
    )


def get_db():
    global _db
    if _db is None:
        _init_firebase()
        _db = firestore.client()
    return _db
