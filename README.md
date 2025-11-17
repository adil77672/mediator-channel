# Mediator Channel Platform

Full-featured sandbox application for intermediaries to upload group resources, track VXUM earnings, simulate payments, and receive delayed settlements.

## Feature Highlights

- **Authenticated multi-role access** – register/login with JWT cookies, middleware-protected `/dashboard/*` routes, and role tags (intermediary/mediator/admin).
- **Multi-page dashboard** – overview, uploads list, earnings analytics, notifications center, and QA/load-testing lab.
- **Group upload workflow** – Web3-style form with validation for group IDs, categories, pricing models (per person/per group), member counts, and automated VXUM rewards (5–10 VXUM).
- **Real-time data** – SWR polling every ≤3 seconds for earnings + notifications with auto-settlement indicators.
- **Delayed settlement** – cron endpoint moves pending earnings to paid after 10 days.
- **Load testing** – sandbox utilities simulate up to 500 concurrent deposits and generate success-rate reports.
- **Notification pipeline** – deposit simulator inserts payment alerts into MongoDB and surfaces them via the dashboard.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 18, TypeScript, Tailwind CSS, SWR.
- **Backend**: Next.js route handlers (Express-style API), Zod validation, JWT-based auth.
- **Database**: MongoDB 5.x with automatic indexes on users, uploads, earnings, deposits, and notifications.
- **Tooling**: ESLint (flat config), Yarn, Vercel Analytics, Radix UI primitives + custom Web3 styling.

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 5.x (local or Atlas)

### Installation

```bash
git clone https://github.com/yourusername/mediator-channel.git
cd mediator-channel
yarn install   # or pnpm install / npm install
```

### Environment variables

Create `.env.local`:

```
MONGODB_URI=mongodb://localhost:27017
AUTH_SECRET=super-secret-jwt-string
```

`AUTH_SECRET` powers JWT cookies. Use a strong random value in production.

### Development workflow

```bash
yarn dev        # http://localhost:3000
yarn lint       # ESLint via eslint-config-next
```

1. Visit `/register`, create an account (default role: intermediary).
2. After redirect you can use `/dashboard` pages for uploads, earnings, testing, etc.

## Dashboard Pages

| Route | Description |
|-------|-------------|
| `/` | Public landing page with roadmap + CTA. |
| `/login`, `/register` | Auth flows using JWT cookies (httpOnly). |
| `/dashboard` | Mission control: upload form, earnings overview, notifications snapshot. |
| `/dashboard/uploads` | Full list of group submissions, reward tiers, timestamps. |
| `/dashboard/earnings` | Settlement policy card, real-time totals, detailed timeline. |
| `/dashboard/notifications` | Payment alert feed + flow documentation. |
| `/dashboard/testing` | Load test runner (500 users default), cron trigger, DB cleanup. |

All dashboard pages inherit `app/dashboard/layout.tsx`, which renders sidebar navigation (desktop), mobile nav, and logout controls via middleware-protected session data.

## Authentication & Middleware

- `/api/auth/register` – create user, hash password (bcrypt), auto-login.
- `/api/auth/login` – verify credentials, set `mc_session` cookie (JWT).
- `/api/auth/logout` – clears cookie.
- `/api/auth/me` – returns current user profile for SWR hooks.
- `middleware.ts` – protects `/dashboard/*` and sensitive API routes, returning `401` for unauthenticated API calls or redirecting users to `/login`.

Client components use `hooks/use-session.ts` for live session data, while server layouts read JWT payloads via `cookies()`.

## API Reference (authenticated unless noted)

### Upload group – `POST /api/upload`

```jsonc
{
  "group_id": "GROUP123ABC",
  "category": "Finance",
  "price": 0.25,
  "pricing_mode": "per-person",
  "member_count": 120
}
```

Returns `{ "status": "success" | "duplicate", "reward": 6, "reward_usd": 2 }`.

### List uploads – `GET /api/uploads`
Returns last 50 uploads for the authenticated uploader.

### Earnings overview – `GET /api/earnings`
Returns `{ earnings: [...], totals: { pending, paid, total } }`.

### Notifications – `GET /api/notifications`
Latest 25 payment alerts for the authenticated uploader.

### Payment simulator – `POST /api/payment/simulate`
Sandbox-only endpoint to emulate user deposits:

```jsonc
{
  "user_id": "user_123",
  "group_id": "GROUP123ABC",
  "deposit_amount": 0.1
}
```

### Settlement cron – `GET /api/cron/settle-earnings`
Marks pending earnings older than 10 days as paid. Schedule daily (e.g., Vercel cron).

### Load-testing helpers

- `POST /api/test/simulate-payment-flow` – insert deposits + notifications for up to 500 users (scoped per uploader, unique `TESTXXXXXX` group IDs).
- `POST /api/test/clear-test-data` – purge the authenticated user’s `TESTXXXXXX*` data.

## MongoDB Schema

| Collection | Fields |
|------------|--------|
| `users` | `email` (unique), `password`, `name`, `role`, `created_at` |
| `group_uploaded` | `group_id` (unique), `category`, `price`, `pricing_mode`, `member_count`, `reward_vxum`, `reward_usd`, `uploader_id`, `timestamp` |
| `earnings` | `uploader_id`, `group_id`, `amount`, `status` (`pending`/`paid`), `created_at`, `paid_at` |
| `user_deposit` | `user_id`, `deposit_amount`, `group_id`, `timestamp` |
| `notifications` | `message`, `temp_id` (uploader), `timestamp` |

Indexes are created automatically (`lib/db.ts`) for `users.email`, `group_uploaded.group_id`, `earnings.uploader_id`, etc.

## Reward & Revenue Model

- Self-upload mode yields **90%** of all payments (70% base + 20% commission).
- VXUM reward tiers (per upload) based on member count:
  - 50–100 → 5 VXUM / $1
  - 101–200 → 6 VXUM / $2
  - 201–300 → 7 VXUM / $3
  - 301–400 → 8 VXUM / $4
  - 401–500 → 10 VXUM / $5
- Simulator `deposit_amount × 0.9` populates the `earnings` collection, then settles after 10 days.

## Load Testing & Performance

- Launch `/dashboard/testing`, set user count (default 500), run the simulator, and capture stats (success rate ≥ 90%, <2s UI, <1s API).
- Settlement cron (`/api/cron/settle-earnings`) can be triggered manually from the same page to validate delayed payouts.
- Performance targets:
  - UI responses < 2 seconds
  - API responses < 1 second
  - Mongo queries < 2 seconds
  - ≥ 90% success during 500-user load test

## Project Structure

```
mediator-channel/
├── app/
│   ├── api/
│   │   ├── auth/(login|logout|register|me)/route.ts
│   │   ├── upload/route.ts
│   │   ├── uploads/route.ts
│   │   ├── earnings/route.ts
│   │   ├── notifications/route.ts
│   │   ├── payment/simulate/route.ts
│   │   ├── cron/settle-earnings/route.ts
│   │   └── test/(simulate-payment-flow|clear-test-data)/route.ts
│   ├── dashboard/(layout + pages: index, uploads, earnings, notifications, testing)
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── page.tsx
│   └── layout.tsx
├── components/
│   ├── upload-form.tsx
│   ├── earnings-dashboard.tsx
│   ├── earnings-table.tsx
│   ├── notification-panel.tsx
│   ├── logout-button.tsx
│   ├── sidebar-nav.tsx
│   └── ui/* (Radix + shadcn-inspired kit)
├── hooks/
│   └── use-session.ts
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   └── validators.ts
├── middleware.ts
├── eslint.config.mjs
└── README.md
```

## Deployment Notes

1. Push to GitHub repository `mediator-channel`.
2. Configure DigitalOcean / Vercel deployment (internal team handles HTTPS + WebSocket).
3. Provide environment variables (`MONGODB_URI`, `AUTH_SECRET`).
4. Schedule `GET /api/cron/settle-earnings` daily (Vercel cron or DO cron).

## Testing Checklist

- [x] Registration/login/logout flows create/remove JWT cookies.
- [x] Upload form enforces group ID format, category, price ranges, member counts.
- [x] Duplicate IDs return `{ status: "duplicate" }` without DB insert.
- [x] Earnings dashboard + table refresh every 3 seconds.
- [x] Notifications feed updates when simulator runs.
- [x] Cron endpoint marks pending earnings older than 10 days as paid.
- [x] `/dashboard/testing` successfully simulates ≥500 users with ≥90% success rate.
- [x] ESLint passes (`yarn lint`).

## License & Support

MIT — open an issue or PR for enhancements, bug fixes, or load-test reports. For NDA / deployment coordination, contact the internal DigitalOcean ops team.

# mediator-channel
