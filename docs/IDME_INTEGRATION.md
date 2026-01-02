## ID.me Integration Blueprint (Non-invasive)

This project is **local-first**. ID.me should be **optional** and **must not** be required for core claim building.

### Why a backend is required
ID.me uses OAuth2 / OIDC with an authorization code exchange that requires a **client secret**. That secret must not be shipped to the browser, so a small backend (or serverless function) is required for the token exchange.

### Recommended flow (high level)
- **Login button** (frontend): redirects to ID.me authorize endpoint.
- **Callback route** (frontend): receives `?code=...` and POSTs it to your backend exchange endpoint.
- **Exchange endpoint** (backend): swaps code for tokens using `client_secret`.
- **Optional attributes**: backend uses access token to fetch verified attributes and returns only what the UI needs.

### Suggested environment variables
Frontend (Vite-exposed):
- `VITE_IDME_CLIENT_ID`
- `VITE_IDME_REDIRECT_URI` (e.g. `http://localhost:3000/auth/callback`)
- `VITE_IDME_AUTH_URL` (default: `https://api.id.me/oauth/authorize`)

Backend (server-only):
- `IDME_CLIENT_ID`
- `IDME_CLIENT_SECRET`
- `IDME_TOKEN_URL` (default: `https://api.id.me/oauth/token`)

### Notes
- Prefer storing **derived user state** (e.g. “verified veteran”) rather than raw tokens in localStorage.
- Keep the **core workflow** usable offline even if ID.me is unavailable.


