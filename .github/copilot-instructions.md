# Copilot Instructions for AI Coding Agents

## Project Overview
- This is a Next.js app using TypeScript, Tailwind CSS, and Prisma ORM.
- The architecture is modular: `app/` for routes/pages, `components/` for UI and forms, `actions/` for business logic, `data/` for models/tokens, and `lib/` for utilities and integrations.
- Auth flows (login, register, password reset, verification) are split into dedicated files and routes under `app/auth/` and `actions/`.
- Admin, client, server, and settings areas are separated in `app/(protected)/`.
- Product management is handled in `app/products/` and `actions/product.ts`.

## Developer Workflows
- **Start dev server:** `npm run dev` (default port 3000)
- **Prisma migrations:** Use `npx prisma migrate dev` (see `prisma/schema.prisma`)
- **Environment config:** Use `.env` for secrets and DB config (not in repo)
- **Build for production:** `npm run build`
- **Linting:** `npm run lint` (uses Next.js/TypeScript defaults)

## Key Patterns & Conventions
- **Actions:** All business logic (auth, product, user) is in `actions/` as async functions, called from API routes or pages.
- **API routes:** Located in `app/api/`, use Next.js route handlers. Auth API is in `app/api/auth/[...nextauth]/route.ts`.
- **Protected routes:** Use `app/(protected)/` and `components/auth/role-gate.tsx` for role-based access.
- **Forms:** UI forms are in `components/auth/` and use form/error/success helpers.
- **Database:** All DB access via Prisma (`lib/prismadb.ts`). Models defined in `prisma/schema.prisma`.
- **User/session:** Auth logic in `lib/auth.ts`, session helpers in `hooks/`.
- **Styling:** Tailwind CSS config in `tailwind.config.ts`, global styles in `app/globals.css`.

## Integration Points
- **Email:** Email verification and password reset use `lib/mail.ts`.
- **Firebase:** Integrated via `lib/firebase.ts` (if used).
- **External Auth:** NextAuth.js config in `app/api/auth/[...nextauth]/route.ts` and `lib/auth.ts`.

## Examples
- To add a new product: update `actions/product.ts` and `app/products/new/page.tsx`.
- To add a new auth flow: create a new file in `actions/` and corresponding page in `app/auth/`.
- To restrict access: wrap page in `components/auth/role-gate.tsx` and place under `app/(protected)/`.

## References
- See `README.md` for basic setup.
- See `prisma/schema.prisma` for DB models.
- See `components/auth/` for form patterns.
- See `app/api/` for API route structure.

---

If any section is unclear or missing, please provide feedback for improvement.