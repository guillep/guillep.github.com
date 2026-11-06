---
name: astro-website
description: Use ONLY when changing this Astro website, its Markdown content, paginated blog, publications, or DBLP/BibTeX data. Provides repository structure and editing preferences.
---

# Astro Website

## Technology and project structure

- Static website built with Astro 7 and TypeScript.
- Content is authored in Markdown and processed with Markdoc.
- Tailwind CSS is used for styling.
- `npm run dev` starts the development server; `npm run build` builds the static site; `npm run preview` previews the build.
- `content/homepage.md` contains homepage copy and Markdoc tags. The homepage route (`src/pages/index.astro`) reads and renders this file.
- `content/blog/` contains blog posts. The blog listing is paginated.
- `content/projects/` contains project pages/content.
- `public/` contains static assets, including `public/mybib.bib`, the BibTeX input for the publications page and selected-publications widget.
- `src/pages/` contains Astro routes; `src/components/` contains reusable UI; `src/layouts/` contains layouts; `src/lib/` contains supporting code; `src/styles/` contains global styles.
- `.agents/skills/astro-website/SKILL.md` is the detailed website workflow for agents that support skills. `TODO.md` tracks improvement ideas.
- `dist/` is generated build output.

## Blog post metadata

- Save published posts as `content/blog/YYYY-MM-DD-slug.md`.
- Start each post with YAML frontmatter containing `external: false`, `title`, `description`, `date` (ISO `YYYY-MM-DD`), and `tags` (a YAML list). Follow the existing posts for formatting.
- Use the frontmatter title as the page title; do not repeat it as a top-level heading in the article unless the author intends a duplicate.
- Keep working drafts outside `content/blog/` so they are not treated as published posts.

## Preserve author-written content

- Never edit, rewrite, remove, reorder, normalize, or silently correct author-written text unless the user explicitly asks for that text to be changed. This applies to titles, descriptions, frontmatter and other metadata, paragraphs, headings, tags, punctuation, spelling, and wording.
- For file moves or format changes, preserve the content exactly. Only add or change metadata when explicitly requested, and preserve all existing metadata values unless the user directs otherwise. If required metadata is missing and the user has not authorized choosing it, ask before inventing a value.

## Content and component policy

- Put editorial content in `content/` (or the appropriate content data file), not hardcoded in page or UI components. Components should render content and implement presentation/behavior, not own page copy.
- The homepage content is currently in `content/homepage.md`; preserve this separation when changing it.
- Prefer reusable Astro components and Markdoc tags for repeated or structured UI. Keep one-off content in Markdown when no component behavior is needed.
- For publications, maintain entries and metadata in `public/mybib.bib`; update this file when adding or correcting publication records. Keep bibliography rendering and display logic reusable rather than embedding individual publication details in components.
- Add future improvement ideas to `TODO.md`.

## Editing preferences and workflow

- Prefer editing Markdown files in `content/` whenever the requested change can be expressed as content. For publications, edit the BibTeX data in `public/mybib.bib` when the requested change is an entry or its metadata.
- Avoid editing Astro, HTML, TypeScript, or other implementation files in `src/` by default. If a requested change requires implementation changes, explain why and ask the user before editing those files, unless they have explicitly authorized that implementation work.
- Formatting must be explicit, never implicit or inferred from page structure in CSS. Avoid structural selectors that add formatting because an element happens to follow another element or appear in a particular section; these are fragile when content is rearranged. When a page needs specific formatting (such as horizontal bars) or widgets, express it with explicit custom Markdoc tags backed by reusable Astro components, and place those tags in the Markdown content.
- Do not scan or browse repository source code to discover how something works. Use this skill as the repository map. If the needed implementation detail is not documented here, ask the user for instructions or explicit permission to inspect the relevant files; do not guess or perform a broad scan.
- When the user explicitly authorizes a scan, keep it limited to the scope they authorized and update this skill with stable, useful structural findings when appropriate.
- Preserve existing content and conventions when editing. Make the smallest change that fulfills the request.

## Verification

- For changes affecting the website build, run `npm run build` when appropriate and report the result.
- Do not make unrelated code or content changes as part of verification.
