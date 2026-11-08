# SETCHI (ستچی)

پلتفرم استایل‌دهی مردانه — AI-assisted men's fashion & outfit recommendation.

## Phase 1 Features

- **Homepage** — Hero, featured outfits, how it works, categories, brand intro
- **Outfit Discovery** — Filterable gallery by style, occasion, color, budget
- **Outfit Detail** — Full breakdown of clothing items + related looks
- **Style Assistant** — Multi-step preference form with real recommendation engine
- **Product Catalog** — Basic product listing and detail pages
- **RTL Persian UI** — Full right-to-left support with Vazirmatn font
- **Responsive** — Mobile-first design

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
- Static data layer (ready for Supabase / DB)

## Getting Started

```bash
cd setchi
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/                 # Routes (home, outfits, style-assistant, products)
  components/          # Header, Footer, OutfitCard, ...
  data/                # products.ts, outfits.ts
  lib/                 # recommend.ts (scoring engine)
  types/               # Shared TypeScript types
```

## Recommendation Engine

The style assistant collects preferences and scores every outfit using:

- Style match weight
- Occasion match
- Color preference
- Budget range
- Diversity selection

No fake AI — results are deterministic based on user input + curated outfit data.

## Next Phases

- Auth (Supabase)
- Favorites & user profiles
- Admin dashboard
- Real AI / image generation APIs
- E-commerce checkout

## Brand

- Background: `#F5F4F0`
- Text: `#171717`
- Accent: `#C45C26` (warm terracotta)
- Aesthetic: Premium streetwear, editorial, minimal
