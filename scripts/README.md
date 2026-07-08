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
