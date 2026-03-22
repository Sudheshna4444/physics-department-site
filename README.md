# Physics Department Site

An aesthetic department website built with Next.js, designed for public student access and owner-only uploads.

## What is safe about the documents

This project is designed so uploaded department files do not live on the website server filesystem.

- Vercel hosts the website
- Supabase Storage keeps the PDFs and other uploaded files
- Supabase Postgres stores document metadata
- Supabase Auth restricts uploads to your admin account

That means redeploying the website does not delete the files.

## Important truth

No platform can honestly guarantee that files can never be lost unless you also keep backups.

This is the correct safer setup:

1. Use Supabase Storage as the primary cloud storage.
2. Keep a second backup copy in Google Drive or a department archive folder.
3. Export a monthly backup of important academic files.

This project already avoids the biggest mistake: storing documents only inside the deployed app.

## Setup

1. Create a Supabase project.
2. In Supabase Auth, create your admin user with your email and password.
3. Run the SQL in `supabase/schema.sql`.
4. After that, run this once in the Supabase SQL editor:

```sql
insert into public.admin_users (email)
values ('your-admin-email@example.com')
on conflict (email) do nothing;
```
5. Copy `.env.example` to `.env.local`.
6. Fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ADMIN_EMAIL=your-admin-email
NEXT_PUBLIC_ADMIN_USERNAME=your-login-username
```

7. Install dependencies with `npm install`.
8. Run locally with `npm run dev`.
9. Deploy to Vercel and add the same environment variables there.

## Routes

- `/` public website
- `/login` admin username + password login
- `/admin` owner-only upload dashboard
