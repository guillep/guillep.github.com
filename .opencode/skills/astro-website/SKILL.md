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
- `content/blog/` contains blog posts. The blog listing is paginated.
- `content/projects/` contains project pages/content.
- `public/` contains static assets, including `public/mybib.bib`, the BibTeX input for the DBLP/publications widget.
- `src/pages/` contains Astro routes; `src/components/` contains UI components; `src/layouts/` contains layouts; `src/lib/` contains supporting code; `src/styles/` contains global styles.
- `dist/` is generated build output.

## Editing preferences and workflow

- Prefer editing Markdown files in `content/` whenever the requested change can be expressed as content. For publications, edit the BibTeX data in `public/mybib.bib` when the requested change is an entry or its metadata.
- Avoid editing Astro, HTML, TypeScript, or other implementation files in `src/` by default. If a requested change requires implementation changes, explain why and ask the user before editing those files, unless the user has explicitly authorized that implementation work.
- Formatting must be explicit, never implicit or inferred from page structure in CSS. Avoid structural selectors that add formatting because an element happens to follow another element or appear in a particular section; these are fragile when content is rearranged. When a page needs specific formatting (such as horizontal bars) or widgets, express it with explicit custom Markdoc tags backed by reusable Astro components, and place those tags in the Markdown content.
- Do not scan or browse repository source code to discover how something works. Use this skill as the repository map. If the needed implementation detail is not documented here, ask the user for instructions or explicit permission to inspect the relevant files; do not guess or perform a broad scan.
- When the user explicitly authorizes a scan, keep it limited to the scope they authorized and update this skill with stable, useful structural findings when appropriate.
- Preserve existing content and conventions when editing. Make the smallest change that fulfills the request.

## Verification

- For changes affecting the website build, run `npm run build` when appropriate and report the result.
- Do not make unrelated code or content changes as part of verification.
