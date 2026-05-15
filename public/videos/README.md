# Hero Videos

Put local hero background videos in this directory and register them in `manifest.json`.

Example:

```json
[
  {
    "src": "/videos/city-night.webm",
    "poster": "/videos/city-night.webp"
  },
  {
    "src": "/videos/abstract-flow.mp4",
    "poster": "/videos/abstract-flow.jpg"
  }
]
```

Recommended formats:

- Prefer `.webm` for smaller files.
- Keep each video short, muted, loop-friendly, and under 8 MB when possible.
- Add a poster image with the same visual tone so the first frame loads cleanly.
