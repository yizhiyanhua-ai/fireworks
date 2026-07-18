# Site Data Sync

## X Feed

The homepage reads public X timeline data from:

```text
public/assets/x-feed.json
```

Keep X/MCP/API credentials out of the browser bundle. A safe sync flow should run outside GitHub Pages, fetch `@teach_fireworks` posts with authenticated X MCP/API access, normalize only public fields, then overwrite `public/assets/x-feed.json`.

The expected shape is:

```json
{
  "account": {
    "name": "烟花老师",
    "handle": "teach_fireworks",
    "url": "https://x.com/teach_fireworks"
  },
  "updatedAt": "2026-07-07T00:00:00+08:00",
  "posts": [
    {
      "id": "2050190799837741377",
      "url": "https://x.com/teach_fireworks/status/2050190799837741377",
      "createdAt": "2026-05-06",
      "text": "Post text for public display",
      "tags": ["Agent Workflow"],
      "metrics": "X"
    }
  ]
}
```

Run the authenticated sync with:

```bash
X_BEARER_TOKEN=... npm run sync:x-feed
```

## WeChat Articles

The homepage reads the public article archive from `public/assets/wechat-articles.json`.
Use an official account access token or app credentials outside the browser bundle:

```bash
WECHAT_ACCESS_TOKEN=... npm run sync:wechat-articles
```

## GitHub Project Metrics

Stars and forks are loaded from `public/assets/github-projects.json`. Refresh the eight
featured repositories through GitHub's public API:

```bash
npm run sync:github-projects
```

Set `GITHUB_TOKEN` in CI to avoid the unauthenticated API rate limit. Every generated
snapshot includes `updatedAt`, and the site labels it as a dated public snapshot.

## Design Review Screenshots (local dev)

Real-time headless-Chrome captures for visual verification (macOS Chrome required,
dev server or preview server running):

```bash
node scripts/shot-cdp.mjs "http://localhost:4173/fireworks/" 8000 /tmp/hero.png 1440 900        # hero at 8s
node scripts/shot-cdp.mjs "http://localhost:4173/fireworks/" 2500 /tmp/sec.png 1440 900 2300    # scrolled section
node scripts/shot-cdp.mjs "http://localhost:4173/fireworks/" 2500 /tmp/reduced.png 1440 900 0 reduced  # prefers-reduced-motion
node scripts/shot-fullpage.mjs "http://localhost:4173/fireworks/" /tmp/full.png 1440            # full page
```

Both scripts also print WebGL canvas status, particle stats, and page console errors.
