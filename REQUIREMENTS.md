# Roxiler Assessment — Requirement Traceability

This document maps the supplied Full Stack Intern Coding Challenge to the RateBoard implementation.

| Requirement | Implementation | Status |
|---|---|---|
| React frontend | `frontend/` React + Vite application | DONE |
| Express/Node backend | `backend/src/` Express REST API | DONE |
| MySQL database | `database/schema.sql` + `mysql2` pool | DONE |
| Single login for all roles | `/login` + `/api/auth/login` | DONE |
| Three roles | `admin`, `user`, `owner` enum and authorization middleware | DONE |
| Normal user signup | `/register` + `/api/auth/register` | DONE |
| Admin adds stores | Add Store page + POST `/api/admin/stores` | DONE |
| Admin adds normal/admin users | Add User page + POST `/api/admin/users` | DONE |
| Admin dashboard counts | `/api/admin/dashboard` + Admin page stat cards | DONE |
| Admin user list | `/api/admin/users` + Users table | DONE |
| Admin store list | `/api/admin/stores` + Stores table | DONE |
| Admin filters by name/email/address/role | Query parameters and filter controls | DONE |
| Admin sorting | Allowlisted server-side sort fields | DONE |
| Admin user details | GET `/api/admin/users/:id` + detail modal | DONE |
| Owner rating shown in user details | Owner average query + detail modal | DONE |
| Admin logout | Shared sidebar logout | DONE |
| User login/logout | Shared login + protected pages + logout | DONE |
| User password update | PATCH `/api/auth/password` | DONE |
| User views all stores | GET `/api/stores` | DONE |
| User searches by store name/address | Store search controls + query parameters | DONE |
| Store name/address/overall rating shown | Store cards | DONE |
| User's submitted rating shown | `myRating` from joined rating query | DONE |
| Submit rating | POST `/api/ratings` | DONE |
| Modify rating | PUT `/api/ratings/:id` | DONE |
| Rating must be 1–5 | Frontend and backend validation + MySQL CHECK | DONE |
| Store owner login/logout | Shared login + protected owner dashboard | DONE |
| Owner password update | Shared password page | DONE |
| Owner sees average rating | Owner dashboard aggregation | DONE |
| Owner sees users who rated | Owner dashboard rating activity table | DONE |
| Owner sees name/email/rating/date | Owner rating query and table | DONE |
| Owner can only see own store | Query scopes store by authenticated `owner_id` | DONE |
| Name validation 20–60 chars | Frontend + backend validators | DONE |
| Address max 400 chars | Frontend + backend validators + DB type | DONE |
| Password 8–16 + uppercase + special | Frontend + backend regex | DONE |
| Standard email validation | Frontend + backend validation | DONE |
| Table ascending/descending sorting | Users and stores sort controls | DONE |
| No ratings display | `No ratings yet` state/text | DONE |
| Loading states | Shared State component | DONE |
| Empty states | Shared State component | DONE |
| Error states | Page notices and API error handling | DONE |
| Responsive UI | Desktop/tablet/mobile CSS breakpoints | DONE |
| Clean code | Routes/controllers/services/validators separation | DONE |
| Parameterized SQL | `mysql2` prepared query parameters | DONE |
| Safe sort fields | Explicit server-side field allowlists | DONE |
| Passwords not returned | Public user mapper excludes `password_hash` | DONE |
| `.env` support | `backend/.env.example` + path-safe dotenv loading | DONE |
| `.gitignore` | Root `.gitignore` excludes secrets/dependencies/build files | DONE |
| Demo data | `backend/src/db/seed.js` with bcrypt hashes | DONE |
| SQL schema script | `database/schema.sql` | DONE |
| SQL seed helper | `database/seed.sql` | DONE |
| README | Setup, architecture, APIs, validation, security and testing | DONE |
| No mock core functionality | Dashboard/store/rating data comes from MySQL APIs | DONE |
| No unnecessary external APIs | Application uses only local REST + MySQL | DONE |

## Core security checks

- Backend authorization is independent of React route protection.
- A normal user cannot call admin endpoints successfully.
- An owner cannot call another role's endpoints successfully.
- Rating updates require the rating to belong to the authenticated user.
- Store-owner dashboard data is selected using `req.user.id`, not a client-provided owner ID.
- `(user_id, store_id)` is unique at the database level.
- Rating values are constrained to 1–5 at both application and database levels.

## Assessment workflow

```text
Login
  -> role is read from JWT
  -> role-specific page opens
  -> API request includes Bearer token
  -> Express authenticates token
  -> role middleware checks permission
  -> service runs parameterized MySQL query
  -> JSON response returns to React
  -> UI updates from real database data
```
