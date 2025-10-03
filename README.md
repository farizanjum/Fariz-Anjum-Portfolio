# Fariz Anjum - Portfolio

A clean, black and white portfolio website built for modern web hosting.

## Features

- Pure black background with white text
- Tor-compatible fonts
- RSS feed integration for newsletter
- Responsive design
- Static site - no backend required

## Tech Stack

- HTML5
- CSS3 (Inline styles)
- JavaScript (Vanilla)
- RSS2JSON API for newsletter feed

## Project Structure

```
fariz.tech/
├── index.html          # Main portfolio page
├── js/main.js          # Newsletter RSS loader
├── images/             # Profile image
├── vercel.json         # Vercel deployment config
├── _redirects          # Netlify deployment config
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Deployment

This site is optimized for static hosting platforms:

### Vercel (Recommended)
1. Import from GitHub
2. Auto-deploys on push
3. Add custom domain `fariz.tech`

### Netlify
1. Connect GitHub repo
2. Auto-deploys on push
3. Add custom domain `fariz.tech`

## Development

To run locally:
```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`

## License

MIT License
