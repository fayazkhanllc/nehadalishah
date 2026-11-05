# Dr. Nehad Ali Shah — Immersive 3D Academic Portfolio

React 18 + TypeScript + Three.js (React Three Fiber, Drei) + GSAP + Framer Motion + KaTeX + Lucide. Built with Vite.

## Run
    npm install --legacy-peer-deps
    npm run dev            # development
    npm run build          # production build -> dist/
    SINGLE=1 npx vite build  # one self-contained dist/index.html

## Update content (no code changes needed)
All academic information lives in `src/data/`:
- `profile.ts` — name, bio, links, metrics (supplied figures), portrait URL
- `publications.ts` — 20 featured publications (add `doi` / `url` only when verified)
- `collaborators.ts` — collaborators, affiliations and city-level globe positions
- `research.ts` — the six research areas

## Things to supply
- Verified Sejong University email -> `profile.links.email` (until then the site shows "to be added")
- Real portrait -> `profile.portrait`
- Verified Google Scholar profile URL -> `profile.links.scholar` (currently a Scholar author search link)
- LinkedIn -> `profile.links.linkedin` (hidden while empty)
- Contact form delivery: set `VITE_CONTACT_ENDPOINT` (e.g. a Formspree endpoint). Without it, the form validates and tells the visitor the message was NOT sent, offering copy / save options.

## Notes
- Visualizations are classical textbook models (potential flow, Lorenz, heat equation, dipole field, Caputo derivative of t) and are labelled as illustrative, not research results.
- The globe land mask is generated from Natural Earth via `scripts/landdots.mjs`.
- WebGL canvases mount only when near the viewport; quality adapts on slow devices; `prefers-reduced-motion` is respected; a non-WebGL fallback is provided.
