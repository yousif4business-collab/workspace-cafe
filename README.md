# WorkSpace Baghdad — Café, Rooftop Padel & Business Suites

Bilingual (Arabic / English) website for WorkSpace in Hay Al-Jamia, Baghdad: a specialty café, a rooftop padel club, a sixth-floor meeting room and serviced business suites, all in one site.

**Live:** [workspace-cafe.pages.dev](https://workspace-cafe.pages.dev)

## Features

- **Gateway page** — visitors pick one of four areas: café menu, padel, meeting room, or business suites.
- **Café menu and cart** — categorised menu with a cart drawer; the order is sent as a pre-filled WhatsApp message.
- **Padel court and meeting-room booking** — pick a date and time, send the request on WhatsApp, and add it to Google Calendar in one click.
- **Padel shop** — product catalogue with filters and product details, ordered through WhatsApp.
- **Business suites page** — office solutions, photo gallery, client logo marquee and contact actions.
- **Full Arabic and English versions** — every screen switches language, with right-to-left layout in Arabic.
- **AI site assistant** — a chat widget answers visitor questions in Arabic or English, grounded in the venue's real facts (hours, prices, contact).

## How the AI assistant is secured

The browser never talks to the AI model directly:

```
Browser ──POST /api/chat──▶ Pages Function ──service binding──▶ Worker (workers/chat-api.ts) ──▶ Workers AI
```

- The Worker has no public URL (`workers_dev: false`, no preview URLs) and is reachable only through the Pages service binding.
- Rate limit of 10 requests per minute per visitor IP (Cloudflare rate-limiting binding).
- Request body capped at 32 KB, each message at 1,000 characters, history at the last 8 messages.
- Strict security headers on every response (CSP, HSTS, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).
- Model: `@cf/meta/llama-3.3-70b-instruct-fp8-fast`, with a system prompt that forbids inventing prices, availability or policies.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, lucide-react icons |
| Hosting | Cloudflare Pages |
| API | Cloudflare Pages Functions + a Cloudflare Worker |
| AI | Cloudflare Workers AI (Llama 3.3 70B) |
| Linting | Oxlint |

## Project structure

```
src/
  App.tsx              pages: Gateway, Menu, Reservation, Padel Shop, Office Solutions
  ChatBotWidget.tsx    floating AI assistant
  ErrorBoundary.tsx
functions/api/chat.ts  Pages Function that forwards /api/chat to the Worker
workers/chat-api.ts    the Worker: validation, rate limit, Workers AI call
public/                images, logos, favicon
wrangler.jsonc         Pages project config (service binding to the Worker)
wrangler.chat.jsonc    Worker config (AI binding, rate limit)
```

## Run locally

```bash
npm install
npm run dev          # frontend only, Vite dev server
npm run dev:pages    # full stack: Pages + Functions + the chat Worker via wrangler
```

## Deploy

```bash
npm run deploy:pages # builds, deploys the chat Worker, then the Pages site
```

Requires a Cloudflare account logged in with `wrangler login`.
