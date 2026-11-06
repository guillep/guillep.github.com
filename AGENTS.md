# Repository guidance

This repository is a personal website built with Astro, Markdown, and Markdoc.

- Keep editorial and page content in `content/` or the appropriate data file. Do not hardcode page copy in UI components. The homepage copy lives in `content/homepage.md`.
- Prefer reusable components and Markdoc tags for repeated or structured UI. Keep one-off content in Markdown when it needs no component behavior.
- Keep publication entries and metadata in `public/mybib.bib`; update it when adding or correcting publications.
- Track future site improvements in `TODO.md`.
- For the site structure and workflow, read `.agents/skills/astro-website/SKILL.md` when working on this site.
