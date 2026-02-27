# Backend Setup (Expo API Routes + Supabase)

This project now uses a single backend architecture:

- `app/api/trpc/[trpc]+api.ts` for API routes in Expo Router
- `server/routers/*` for tRPC procedures
- Supabase client auth directly in the app (`lib/auth/auth-context.tsx`)

## Supabase

1. Create a Supabase project.
2. In **Project Settings → API** copy:
   - `Project URL` → `EXPO_PUBLIC_SUPABASE_URL`
   - `publishable/anon key` → `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. In **Authentication → URL Configuration** configure a reset password redirect URL, for example:
   - `noctua://reset-password` (native deep link)
   - or your web app URL

## Environment variables

Fill `.env.local` using `.env.example`:

```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
EXPO_PUBLIC_SUPABASE_PASSWORD_REDIRECT_URL=noctua://reset-password
SUPABASE_PROJECT_ID=...
```

## Local run

Start the Expo server:

```bash
npm run start
```

Expo serves both app routes and `app/api/*` routes.
