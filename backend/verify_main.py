"""Verification script for task 2.1 — run with: python verify_main.py"""
import sys

# Ensure user-installed packages are on the path
user_site = r"C:\Users\ELCOT\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.12_qbz5n2kfra8p0\LocalCache\local-packages\Python312\site-packages"
if user_site not in sys.path:
    sys.path.insert(0, user_site)

try:
    from app.main import app
except ImportError as e:
    print(f"FAIL — import error: {e}")
    sys.exit(1)

errors = []

# 1. Title and version
if app.title != "AI Apartment API":
    errors.append(f"title: expected 'AI Apartment API', got '{app.title}'")
if app.version != "0.1.0":
    errors.append(f"version: expected '0.1.0', got '{app.version}'")

# 2. /health route exists
routes = {r.path for r in app.routes}
if "/health" not in routes:
    errors.append("/health route not registered")

# 3. Global exception handler registered
if Exception not in app.exception_handlers:
    errors.append("Global Exception handler not registered")

if errors:
    for e in errors:
        print(f"FAIL — {e}")
    sys.exit(1)

print("All checks passed:")
print(f"  title   = {app.title}")
print(f"  version = {app.version}")
print(f"  routes  = {sorted(routes)}")
print(f"  exception handlers = {list(app.exception_handlers.keys())}")
