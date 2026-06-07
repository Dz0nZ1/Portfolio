# Portfolio

Personal portfolio of Nikola Leleković — .NET & Azure software engineer.
Bilingual (EN / SR), built with Astro + React islands + Tailwind CSS v4,
deployed on Netlify.

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
npm test         # run unit tests (Vitest)
```

## Adding a project

Add a Markdown file under `src/content/projects/en/` and `src/content/projects/sr/`
with a matching `key`. See `src/content.config.ts` for the frontmatter schema.
