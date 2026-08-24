# Presentations Repo — Setup & Workflow Plan

## Goal
One GitHub repo hosting a single-file HTML page per talk/workshop via GitHub
Pages. Each talk gets a stable, permanent URL suitable for a QR code printed
on slides. Content must be editable after the fact **without** the URL ever
changing.

## Target repo structure
```
presentations/                          ← repo root
├── index.html                          ← optional landing page listing all talks
├── assets/                             ← optional shared css/js/images
├── health-complexity-workshop-2026/
│   └── index.html
├── swiss-public-health-2026/
│   └── index.html
└── <slug>/
    └── index.html
```

## One-time setup
1. Create a **public** GitHub repo under this folder
2. `git init` locally, add the GitHub remote.
3. Commit a placeholder root `index.html` and push to `main`.
4. In repo **Settings → Pages**: Source = "Deploy from a branch", branch =
   `main`, folder = `/ (root)`. Save.
5. Confirm the Pages URL resolves: `https://<username>.github.io/presentations/`
   (first deploy can take a couple of minutes).

## Workflow: adding a new talk
1. Pick the folder **slug** before generating any QR code — kebab-case,
   descriptive, e.g. `health-complexity-workshop-2026`. **Never rename a
   slug once its QR code has been printed** — this breaks the link.
2. Create `presentations/<slug>/index.html`.
3. Page should be **self-contained**: inline `<style>` and `<script>`, no
   build step, no external dependencies beyond CDN links if absolutely
   needed. This keeps it trivial for Claude Code to edit later.
4. Commit and push to `main`.
5. Wait ~1–2 min, then verify live at
   `https://<username>.github.io/presentations/<slug>/`.
6. Generate a QR code for that exact URL and drop it into the slide deck.
7. (Optional) Add a card/link to the new talk on the root `index.html`
   landing page.

## Workflow: updating an existing talk
1. Edit `presentations/<slug>/index.html`.
2. Commit and push to `main`.
3. Pages rebuilds automatically — same URL, same QR code, refreshed content.

## Conventions
- Folder slugs: lowercase, hyphenated, permanent once published.
- Each talk page is a single self-contained `index.html`.
- Keep `<title>` and meta description accurate per talk (helps if the link
  is ever shared outside the QR code / slides).
- Optional: shared styling lives in `/assets/style.css`, linked from each
  talk page, to keep a consistent look without duplicating CSS everywhere.

## Tasks for Claude Code
- [ ] Scaffold the repo structure locally as above.
- [ ] `git init`, create the GitHub repo (via `gh repo create` if the GitHub
      CLI is authenticated, otherwise prompt me to create it manually),
      push initial commit.
- [ ] Enable GitHub Pages (via `gh api` if permitted, otherwise give me the
      exact Settings → Pages steps to click through manually).
- [ ] Create a placeholder root `index.html` (simple landing page, can list
      talks as they're added).
- [ ] Create the first talk folder + `index.html` from a reusable template
      (ask me for the talk title/content, or use placeholder content if not
      yet provided).
- [ ] Verify the deployed URL is live and report it back to me.

## Notes for future talks
When asked to "add a new talk", Claude Code should:
1. Ask for (or infer from context) the talk title and target date.
2. Propose a slug and confirm before creating the folder.
3. Build the `index.html` content from whatever material I provide
   (slide text, summary, links, etc.).
4. Commit, push, and report the live URL back so I can generate the QR
   code.
