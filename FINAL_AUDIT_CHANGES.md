# Final audit changes

This package keeps the original RateBoard project structure and applies targeted fixes.

## Fixed
- Store Owner dashboard no longer crashes during render because the refresh handler is passed into the dashboard component correctly.
- Owner dashboard refresh continues to use the authenticated owner's dashboard endpoint.
- Normal User store search trims search input and sends a no-cache request so newly published stores are picked up reliably.
- Store search on the backend is case-insensitive for name and address.
- Admin store listing search is also case-insensitive.
- Existing JWT, role authorization, registration, rating, admin management and MySQL flows are preserved.

## Distribution notes
- `backend/.env` is intentionally excluded. Create it from `backend/.env.example`.
- `node_modules` is intentionally excluded. Run `npm install` in both `backend` and `frontend`.
- The source was syntax-checked after the changes.
