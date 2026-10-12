# CLAUDE.md — reservas (Graft booking system)

Read this whole file before changing anything. If a PR changes something described here, update this file in the same PR.

## What this is

A booking system that Graft (a small custom-software studio in Argentina) builds for small businesses: a plumber's visit, a 1:1 class, a group class, a band renting a rehearsal room.

- **Today (legacy, Spanish code):** one business, one admin with a password, one weekly schedule, 1:1 bookings ("turnos") confirmed by hand and announced by email.
- **Where it's going (v2, English code):** providers sign in with Google. Each provider manages **services** and **availability**. Clients book without an account and manage their booking through a private link. Confirmed bookings become Google Calendar events for both sides, and clients answer yes/no to attendance.
- The roadmap lives in GitHub milestones M0 to M4. Don't build ahead of the issue you're working on.

## Vocabulary

| Term | Meaning |
|---|---|
| Provider | The business or person offering something. Signs in with Google. |
| Service | What a provider offers: duration, capacity, location. Capacity 1 = one booking per slot; capacity N = up to N bookings share a slot. |
| Availability | Weekly hours (several ranges per day allowed) plus exceptions (blocked days or time ranges). |
| Slot | A start time a client can book. Computed, never stored. |
| Booking | A client's reservation of a slot. Has a status (pending, confirmed, declined, cancelled) and an attendance answer (unknown, yes, no). |
| Client | The person booking. No account; manages the booking through a private link. |

## Stack and map

- `backend/` — Node 22, Express 4, Sequelize 6, PostgreSQL 16. CommonJS.
  - `src/index.js` server start · `src/models/` · `src/controllers/` · `src/routes/` · `src/services/` (availability and email logic)
- `frontend/` — React 18, Vite 5, react-router 6, axios. ESM.
  - `src/pages/` (`Reservar` = public booking, `Admin*` = admin panel) · `src/components/` · `src/api/client.js`

## Run it

Postgres is preinstalled but stopped in Claude Code cloud sessions:

```bash
pg_isready -q || service postgresql start || sudo service postgresql start
as_pg() { if [ "$(id -u)" = 0 ]; then su postgres -c "$1"; else sudo -u postgres sh -c "$1"; fi; }
as_pg "psql -qc \"ALTER USER postgres PASSWORD 'postgres';\""
as_pg "createdb turnos_db"   2>/dev/null || true
as_pg "createdb turnos_test" 2>/dev/null || true
```

- Backend: `cd backend && npm ci && cp -n .env.example .env`, set `DB_PASSWORD=postgres` and any long `JWT_SECRET` in `.env`, then `npm run dev` (http://localhost:3000).
- Frontend: `cd frontend && npm ci && cp -n .env.example .env && npm run dev` (http://localhost:5173).

## Before opening any PR (mandatory)

1. `cd backend && npm test` passes.
2. `cd frontend && npm run build` passes.

If `npm test` doesn't exist yet, the "Add automated tests and CI" issue comes first.

## Working rules

- Never push to `main` and never merge. One branch per issue, `claude/<issue-number>-<short-slug>`, and one PR per issue.
- Every bug fix ships with a test that fails without the fix.
- Schema changes only through a new migration. Never use `sequelize.sync({ alter: true })`.
- Never commit `.env` files or secrets. Creating a local `.env` from `.env.example` to run things is fine. A new environment variable goes into `.env.example` with a placeholder and a comment.
- Keep PRs small. If an issue turns out bigger than expected, ship the smallest useful part and list the rest in the PR.
- If a requirement is ambiguous or needs a product decision, don't guess. Comment on the issue with the question and 2–3 concrete options, then stop working on it.
- If the issue says "Depends on #N" and #N is still open, don't start it.
- A new dependency needs a one-line justification in the PR.

## PR description template

```
## What changed
## Why
## How to test it by hand
1. ...
## Risks and follow-ups
Closes #N
```

## Code conventions

- English for code, comments, commits, branches, PRs and issues. **User-facing text in Spanish, Rioplatense, with voseo** ("Elegí", "Probá").
- The legacy Spanish code (`Turno`, `Configuracion`, `DiaExcepcion`, `disponibilidad`, ...) is being replaced module by module in M1 and M2. Don't rename it in unrelated PRs; replace it when its issue comes.
- API errors: `{ "error": "<message in Spanish>" }` with the right status: 400 invalid input, 401 not signed in, 403 forbidden, 404 not found, 409 conflict. Invalid input must never produce a 500.
- Validate every input on the server. The frontend only helps the user; it is not a security boundary.
- Every query that touches provider data is scoped by provider. A missing scope leaks one customer's data to another: test it.
- Time: store instants as `timestamptz` (UTC). Compute "today", slots and anything displayed in the provider's time zone (default `America/Argentina/Buenos_Aires`). Never use `toISOString().slice(0, 10)` for "today": it returns the UTC date, which is already tomorrow from 21:00 in Argentina.
- Emails and calls to external services (Google) never block an HTTP response. Send them after responding (through the outbox once it exists).
- Google refresh tokens are stored encrypted and never logged.

## Known traps

- Production runs behind a reverse proxy. `trust proxy` must match the real number of proxies, or rate limiting breaks (too low) or can be dodged with fake IPs (too high).
- The partial unique index `turno_fecha_hora_unico_si_activo` is what really prevents double booking in the legacy code. v2 needs an equivalent guarantee at the database level: capacity must hold under concurrent requests, with a test proving it.
- Google OAuth apps in "Testing" status get refresh tokens that expire after 7 days.
- Never request Gmail or Drive scopes from Google. They would put the whole Google project in the "restricted" tier, which requires a paid security assessment.

## UI and brand

- Mobile first: most clients will open the booking link on a phone. Everything must work at 320px wide.
- Accessibility, WCAG 2.2 AA:
  - every input has a label and focus is always visible;
  - everything works with the keyboard, and toggle buttons use `aria-pressed`;
  - async errors are announced with `aria-live`;
  - touch targets are at least 44px.
- Graft brand (default theme):
  - Colors: paper `#F0EDE8`, surface `#E7E3DC`, ink `#141210`.
  - Cobalt `#1F38FF` for emphasis only, at most 5% of the screen (`#5468FF` in dark mode).
  - Signal green `#00B85C` only for functional states such as "disponible".
  - Fonts: Chivo and Chivo Mono. 1px hairlines instead of boxes and shadows.
- Copy: direct and warm. Avoid "soluciones", "innovador", "potenciar", "sin fricción".
