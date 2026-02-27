# Backend Setup (Supabase + Vercel)

## Supabase

1. Create a Supabase project.
2. In **Project Settings → API** copy:
   - `Project URL` → `SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
3. In **Authentication → URL Configuration** set a redirect URL for password reset (e.g. `noctua://reset-password` or a web URL).

## Environment variables

Fill `.env.local` using `.env.example`:

```
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_PASSWORD_REDIRECT_URL=...
```

## Vercel deploy

1. Install Vercel CLI and login.
2. Configure environment variables in the Vercel project (same as above).
3. Deploy from repo root.

The backend endpoints are in `/api/auth/*` and follow the OpenAPI contract in [`openapi.yaml`](../openapi.yaml).

## Local run

Start Expo and Vercel functions:

```
npm run start
vercel dev --listen 3000
```

The app uses `EXPO_PUBLIC_API_URL` to call the backend.
