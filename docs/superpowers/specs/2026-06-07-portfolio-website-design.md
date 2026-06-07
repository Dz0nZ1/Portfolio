# Portfolio Website — Design Spec

**Date:** 2026-06-07
**Owner:** Nikola (GitHub: Dz0nZ1)
**Status:** Approved (design), pending implementation plan

## Goal

A personal brand / online presence website for a software developer. The site
represents who the developer is rather than aggressively selling services or
chasing a single job application. It should make a strong visual impression,
rank well in search (good SEO), be cheap to host, and be easy to extend later
(blog, project detail pages) without re-architecting.

## Decisions Summary

| Topic | Decision |
|-------|----------|
| Purpose | Personal brand / presence |
| Field | Software developer |
| Sections | Hero, About, Projects, Contact |
| Structure | Single scrolling page, built to be extensible |
| Visual style | Bold / creative |
| Content language | Bilingual (EN + SR) |
| Default locale | English at root (no prefix); Serbian under `/sr/` |
| Framework | Astro (static) + React islands for animation |
| Hosting | Netlify (Git-based auto-deploy) |
| Contact form | Not now (mailto + social links); add Netlify Forms later |
| Theme | Single strong theme to start (dark-first); light/dark toggle deferred |

## Architecture

**Stack:** Astro static build + React islands (for animated/interactive parts) +
Netlify deploy from Git. Astro renders all content to static HTML and ships
minimal JS; interactive/animated regions are hydrated React islands so JS cost
stays localized.

**Internationalization (EN + SR):**
- Astro built-in i18n routing. **English is the default locale served at the
  root with no prefix** (`/`). **Serbian is prefixed** (`/sr/`). This is the
  SEO-strongest layout (primary language on root).
- UI strings (nav, buttons, labels) live in dictionaries: `src/i18n/en.json`,
  `src/i18n/sr.json`, with a small helper for lookups.
- Project content lives in Astro Content Collections, separated per language
  (`src/content/projects/en/*.md` and `src/content/projects/sr/*.md`) sharing a
  common `slug` so the language switcher maps to the equivalent project.
- A language switcher in the header remembers the choice and routes to the
  equivalent page in the other language.

**Folder structure (approximate):**

```
src/
  pages/
    index.astro             # EN single scroll page (root, no prefix)
    sr/index.astro          # SR single scroll page
  components/
    sections/   Hero, About, Projects, Contact
    islands/    (React) animated regions
    ui/         Header, Footer, LangSwitcher, (ThemeToggle later)
  content/
    projects/   en/ , sr/   # Markdown projects
  i18n/         en.json, sr.json + helper
  layouts/      BaseLayout.astro
  styles/       global.css, tokens.css (colors / typography / spacing)
```

**Design principle:** each section is an isolated component with one clear
purpose, so it can be understood, changed, and tested independently, and new
things (blog, project detail pages) can be added without touching existing
sections.

## Page Sections

Single scroll page, top to bottom:

1. **Hero** — name, short "who you are" headline, primary visual impression with
   a bold animation (the main "wow"). CTAs: "Projects" (scroll) and "Contact".
2. **About** — personal story, key skills / tech stack (e.g. badge grid),
   optional photo.
3. **Projects** — card grid sourced from Content Collections. Each card: title,
   short description, tech tags, GitHub and/or live link. Cards can later link to
   a detail page; the architecture already allows this.
4. **Contact** — email + social links (GitHub Dz0nZ1, LinkedIn, etc.). No form
   initially (no backend needed for a personal brand); Netlify Forms can be added
   later without changing the stack.

**Fixed elements:** Header (name/logo + nav + language switcher) and Footer.

## Data Model

Project entry frontmatter (Markdown in Content Collections):

```yaml
title: "Project name"
description: "Short description"
tags: ["Astro", "TypeScript"]
github: "https://github.com/Dz0nZ1/..."   # optional
live: "https://..."                        # optional
cover: "./cover.png"                        # optional
order: 1                                    # display order
featured: true                             # highlight flag
```

The collection schema validates these fields at build time. `slug` is shared
across the EN and SR versions of the same project.

## Visual Identity, Styling & Animation

**Bold / creative direction:**
- Design tokens as CSS custom properties: color palette, typography, spacing —
  one source of truth, easy to re-tune the whole mood.
- Typography carries the boldness: a strong display font for headings + a
  readable body font. Oversized type in the Hero.
- Colors: dark base + 1–2 strong accent colors (gradients / glow allowed). Exact
  values chosen during implementation.
- Theme: start with a single strong theme (dark-first). A light/dark toggle is an
  optional later addition — leave an architectural hook, do not build it now.

**Animations:**
- Main "wow" moments (Hero, scroll-reveal sections) via React islands + GSAP
  (ScrollTrigger) or Framer Motion — exact choice during implementation.
- Subtle effects (hover, fade-in) in pure CSS, no JS.
- Accessibility: honor `prefers-reduced-motion` — animations disabled for users
  who request it.

**CSS approach:** vanilla CSS with tokens vs Tailwind to be decided in the
implementation plan. Vanilla CSS gives the most control for a bold custom look;
Tailwind speeds iteration. Not blocking at design stage.

## Deployment

- Netlify auto-deploy from the GitHub repo (Dz0nZ1/Portfolio).
- Build: `astro build` → `dist/`.
- Deploy previews for each PR / branch.
- Custom domain when ready.

## Testing

Lightweight for a static site:
- Build must pass (Astro build + content schema validation).
- Basic checks: links resolve, i18n routes exist (`/` and `/sr/`),
  `prefers-reduced-motion` is respected.
- No heavy test framework setup.

## Explicitly Out of Scope (YAGNI, deferrable)

- Contact form / backend (add Netlify Forms later)
- Blog
- Project detail pages (architecture allows adding them)
- CMS
- Light/dark theme toggle (hook left in place)
