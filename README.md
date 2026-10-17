# LawyerDex – MERN + Tailwind CSS lawyer directory

Search verified lawyers by practice area and location, compare profiles, and request a consultation.
Lawyers register, build a profile, and go live after admin verification.

| Layer     | Stack |
|-----------|-------|
| Database  | MongoDB + Mongoose 9 |
| API       | Node.js + Express 5, Zod 4 validation, JWT in HTTP-only cookies |
| Web app   | React 19, React Router 8, TanStack Query 5, React Hook Form |
| Styling   | Tailwind CSS 4 (CSS-first `@theme`, `@tailwindcss/vite`) |
| Build     | Vite 8 |

See `VERSIONS.pdf` for the exact versions.

## Quick start

```bash
# prerequisites: Node >= 22.22, a running MongoDB (local or Atlas)
npm install
cp server/.env.example server/.env     # then set JWT_SECRET (32+ chars) and MONGODB_URI
npm run seed                           # demo categories, lawyers, articles, users
npm run dev                            # API on :5000, web on :5173
```

Seeded logins (password `Password123!`): `admin@lawyerdex.test`, `client@lawyerdex.test`,
`amelia-hartwell@lawyerdex.test` (lawyer). Seed bar numbers are placeholders.

## Features
- Home with hero search, how-it-works, practice-area directory, legal resources
- Lawyer search: keyword (text index), practice area, city, state, rating, sort, pagination (URL-driven)
- Lawyer profile with reviews and a consultation request form (guests allowed, rate-limited)
- Three roles: client, lawyer, admin (role guards on API and routes)
- Lawyer dashboard: profile editor, verification status, consultation inbox
- Admin verification queue (approve/reject with note; approval requires bar number + state)
- Editing bar number or state on an approved profile sends it back to review

## Security notes
- Passwords hashed with bcrypt (cost 12); generic login error to prevent user enumeration
- JWT in an HTTP-only, SameSite=Lax cookie (Secure in production)
- Helmet, CORS allow-list, rate limits (global, auth, consultation form), 100 kb body limit
- Zod validation on every body/query; Mongoose `sanitizeFilter` against operator injection
- Public endpoints never expose bar numbers or admin notes

## Production
`npm run build` outputs `client/dist`. Serve it from a static host/CDN (set `CLIENT_ORIGIN` on the API),
or put both behind one reverse proxy so `/api` and the site share an origin.
Not included yet: email notifications, password reset, refresh-token rotation, tests with a live DB.
