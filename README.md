# InMedica Devices — Website

Marketing and lead-generation site for InMedica Devices (Bhubaneswar, Odisha), built from the design handoff in `design_handoff_inmedica_website/`.

**Stack:** Next.js 16 (App Router) · TypeScript · MongoDB (Mongoose) · Nodemailer. Deploys to Vercel or any Node host.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in MongoDB + SMTP (optional in dev)
npm run dev                  # http://localhost:3000
```

Production build: `npm run build && npm start`.

## Project layout

| Path | What it holds |
|---|---|
| `src/app/` | Routes: `/`, `/about`, `/products/[category]`, `/product/[id]`, `/projects`, `/project/[id]`, `/resources`, `/clients`, `/contact`, plus `api/enquiry`, `sitemap.xml` and `robots.txt` |
| `src/data/` | All site content, ported verbatim from the design's `inmedica-data.js` (products, projects, brochures, team, clients, FAQs) |
| `src/lib/catalog.ts` | **The only place pages read content from.** To move content into MongoDB or a CMS later, change this file and nothing else |
| `src/lib/enquiry.ts` | Enquiry types and validation, shared by the browser form and the API |
| `src/models/Enquiry.ts` | Mongoose model for enquiries (`enquiries` collection, with status `new` / `contacted` / `closed`) |
| `src/components/` | Layout (header, mega-menu, footer, background FX, scroll reveal), the global modal / toast / lightbox, and page widgets |
| `src/app/globals.css` | Design tokens and every component style, translated 1:1 from the prototype |
| `public/` | Images (`assets/`), product brochures (`brochures/`), certificates (`certificates/`) |

## Enquiries (`POST /api/enquiry`)

Body: `{ type, name, org, mobile, email, product, message }`, where `type` is `quote`, `demo`, `sales` or `service`.

- Validation: a name is required, the mobile number must match `^[6-9]\d{9}$` (last 10 digits), and the email format is checked if one is given.
- If `MONGODB_URI` is set, the enquiry is saved to MongoDB.
- If the `SMTP_*` variables are set, the enquiry is emailed to `ENQUIRY_TO` (default `inmedicadevices@gmail.com`). For Gmail, use an App Password.
- In development, with neither one configured, the enquiry is only logged to the console. In production the API returns 503, so leads are never silently lost.

## Deploying

- **Vercel:** import the repo and add the env vars from `.env.example`. Every page except the API is prerendered statically.
- **MongoDB Atlas:** create a free cluster, allow access from your host (on Vercel, `0.0.0.0/0`), and set `MONGODB_URI`.
- **Other clouds (AWS / GCP / Azure):** `npm run build && npm start` on Node 20 or later, or wrap it in a container.

## Open items (from the client)

- Product photos: Syringe Pump, Infusion Pump, OT Light, Bedside Lockers, Wheelchairs, Digital Fixed X-Ray. These currently show the striped placeholder.
- Brochures: M6, Syringe Pump, Infusion Pump. These currently show the dashed button with a toast.
- Certificates: Startup Odisha, GeM. These currently show "file needed".
- Instagram URL: the link in the design file is corrupted. Set `CONTACT.instagram` in `src/data/company.ts`.
- X (Twitter) link, product videos, client logos (the initials avatars are placeholders), confirming the phone number.
