"""
Firestore client initialisation.

Reads credentials and project ID from environment variables, initialises the
firebase_admin app exactly once, and exposes get_db() for use by the DB layer.

Required environment variables:
    GOOGLE_APPLICATION_CREDENTIALS  — path to a Firebase service-account JSON file
    FIRESTORE_PROJECT_ID            — the Google Cloud project ID
"""

import os

import firebase_admin
from firebase_admin import credentials, firestore

# Lazily-cached Firestore client; populated on first call to get_db().
_db = None


def _init_firebase() -> None:
    """Initialise the firebase_admin app once.

    Raises:
        EnvironmentError: if either required environment variable is missing.
        FileNotFoundError: if the credentials file path does not exist.
    """
    cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    project_id = os.environ.get("FIRESTORE_PROJECT_ID")

    missing = [
        name
        for name, value in [
            ("GOOGLE_APPLICATION_CREDENTIALS", cred_path),
            ("FIRESTORE_PROJECT_ID", project_id),
        ]
        if not value
    ]
    if missing:
        raise EnvironmentError(
            f"Missing required environment variable(s): {', '.join(missing)}. "
            "Ensure they are set before starting the application."
        )

    if not os.path.isfile(cred_path):
        raise FileNotFoundError(
            f"Firebase credentials file not found at '{cred_path}'. "
            "Check the value of GOOGLE_APPLICATION_CREDENTIALS."
        )

    # firebase_admin raises ValueError if the default app is already initialised;
    # check first so that this function is safe to call multiple times (e.g. in tests).
    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred, {"projectId": project_id})


def get_db():
    """Return the Firestore client, initialising firebase_admin on the first call.

    Returns:
        google.cloud.firestore.Client: the Firestore client instance.
    """
    global _db
    if _db is None:
        _init_firebase()
        _db = firestore.client()
    return _db
