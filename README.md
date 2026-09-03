# BiblioTech Frontend

Front-end for the BiblioTech library, on top of the NestJS API in
`../bibliotech_backend`. It is the static HTML/CSS prototype from `../../task-01`
ported to the App Router and wired to a real backend: the six mockup pages become
routes, the duplicated page shell becomes a layout, and the hard-coded tables
become paginated data.

## Stack

| Layer    | Choice                                             |
|----------|----------------------------------------------------|
| Framework| Next.js 16 (App Router, Turbopack, React 19)       |
| Language | TypeScript 5                                       |
| Styling  | One hand-written global stylesheet, no framework   |
| Data     | Server Components + Server Actions over `fetch`    |
| Session  | JWT from the API, kept in httpOnly cookies         |

No runtime dependencies beyond Next and React: no Tailwind, no form library, no
HTTP client.

## Requirements

The API must be running on `http://localhost:3000` with its database migrated
and seeded. From `../bibliotech_backend`:

```shell
docker compose up -d database
npm run migration:run
npm run seed
npm run start:dev
```

## Getting started

```shell
cp .env.example .env.local
npm install
npm run dev
```

The app listens on **http://localhost:3001** — the API already owns 3000.

`API_URL` is the only setting. It is read on the server only: the browser never
talks to the API directly, so the token never leaves the cookie.

Seeded accounts all share the password `Bibliotech123`:

| Account                    | Role   | Sees                          |
|----------------------------|--------|-------------------------------|
| `admin@bibliotech.test`    | admin  | Everything                    |
| `marcos@bibliotech.test`   | member | The catalogue, read-only      |

## Project structure

```
src/
  proxy.ts            Route and role gate (Next 16's renamed middleware)
  lib/
    api.ts            apiFetch, pagination helpers, ApiError
    session.ts        The httpOnly cookies
    session-cookie.ts The pure half, shared with proxy.ts
    dal.ts            requireSession / requireAdmin
    domain.ts         Derived loan status, date formatting, Spanish labels
    types.ts          The shapes the API answers with
  actions/            Server Actions, one file per entity
  components/         shell/ ui/ books/ loans/ users/
  app/
    (auth)/login      Outside the shell
    (app)/            Everything behind the sidebar
    logout/route.ts   Clears the session
```

## Authorization

Three gates, deliberately:

1. **`proxy.ts`** reads the session cookie and redirects — an optimistic check,
   which is all a proxy should do since it also runs on prefetches.
2. **`requireSession()` / `requireAdmin()`** run in every page *and every Server
   Action*, because a Server Function is reachable by a direct POST.
3. **The API**, which answers 401 and 403 regardless of what the UI allowed.

The rules mirror the backend's guards exactly:

| Section     | admin | member    |
|-------------|-------|-----------|
| `/books`    | CRUD  | read-only |
| `/loans`    | CRUD  | no access |
| `/users`    | CRUD  | no access |
| `/dashboard`| yes   | no access |

A member lands on `/books`, sees only *Libros* in the sidebar and gets no
management controls. An expired token sends the visitor through `/logout`, which
is the one place cookies can be cleared, back to the login form.

## What is deliberately inert

The API has no searching, no filtering and no counters, and its `ValidationPipe`
runs with `forbidNonWhitelisted`, so an invented query parameter answers 400
rather than being ignored. Rather than drop the mockup's chrome, these are kept
visible and disabled, and marked as such:

- the **filter bar** on every list — only `page` and `limit` reach the API;
- **Recordarme** on the login form — the token lasts a day and there is no
  refresh endpoint;
- the **Préstamos vencidos** metric — the other three counters are real, read
  from the `meta.total` every list endpoint reports.

Overdue is computed in the browser from `returnedAt` and `dueDate`; it is not a
column the API stores.

## Notable API rules the UI enforces

- A loan takes a `bookId` and a `userId`, so both are selects, narrowed to
  copies that are `available` and accounts that are `isActive`.
- `code` and `dueDate` never appear in a form: the server generates the first
  and derives the second from `loanedAt` plus a term of 14, 21 or 30 days.
- A loan never moves to another book or borrower — editing one only shifts its
  dates, and a returned loan cannot be edited at all.
- `on-loan` is owned by `/loans`: the book form offers only *Disponible* and
  *En reparación*.
- Books and users with loans on record cannot be deleted. The 409 is shown next
  to the row rather than swallowed; deactivating a user is the alternative.

## Scripts

```shell
npm run dev     # http://localhost:3001
npm run build
npm run start   # http://localhost:3001
npm run lint
```
