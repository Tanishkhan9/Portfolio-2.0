Project: Tanish Khan — Portfolio (Vercel-ready)

Recommended folder structure (created):

- index.html                     (root static entry)
- style.css                      (existing stylesheet)
- script.js                      (existing script)
- data/                          (dynamic JSON data files)
- data-render.js                 (client renderer)
- public/                        (static assets for deployment, optional)
- assets/                        (images/icons - move here)
- scripts/                       (move or add JS helpers here)
- styles/                        (move CSS here if needed)
- api/                           (serverless functions for Vercel, optional)

How to deploy on Vercel (quick):

1. Install Vercel CLI (optional):

	npm i -g vercel

2. From the project root run (first-time):

	vercel

	Follow prompts and then create a production deployment:

	vercel --prod

Notes and suggestions:

- The site currently serves `index.html` from the project root. Vercel will serve static files by default.
- Optionally move images into `assets/` and update `src` paths in `index.html`.
- If you want automated builds, move compiled assets into `public/` and update `vercel.json` accordingly.
- To add server-side functionality (storing queries), add serverless functions to `api/` and update `data-render.js` to call them.

If you want, I can:
- Move existing assets into `assets/` and update paths.
- Add a simple serverless `/api/contact` function to store queries (needs a backend or third-party storage integration).
- Create a `public/` build step that copies optimized assets into a deploy-ready folder.
