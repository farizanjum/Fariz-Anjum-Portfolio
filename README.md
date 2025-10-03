# Fariz Anjum - Portfolio

A clean, black and white portfolio website built for modern web hosting with an exclusive screenshot collection feature.

## Features

- Pure black background with white text
- Tor-compatible fonts
- RSS feed integration for newsletter
- **Screenshot Dump Section** with NSFW content warning
- **Admin Panel** with secure access protection
- **Drag & Drop** multi-image upload
- **Image Lightbox** for full-size viewing
- **Edit & Delete** functionality for screenshots
- **Pin Important Screenshots** feature
- Responsive design optimized for mobile
- Static site - no backend required

## Tech Stack

- HTML5
- CSS3 (Inline styles + advanced modals)
- JavaScript (Vanilla ES6+)
- RSS2JSON API for newsletter feed
- Local Storage for screenshot management
- Secure admin authentication

## Project Structure

```
fariz.tech/
├── index.html                    # Main portfolio page
├── screenshot_dump.html          # Exclusive screenshot collection
├── js/main.js                    # Newsletter RSS loader + smooth scrolling
├── images/                       # Profile image and uploaded screenshots
├── api/rss.js                    # Serverless RSS proxy for Vercel
├── vercel.json                   # Vercel deployment config
├── _redirects                    # Netlify deployment config
├── favicon.ico                   # Site favicon
├── .gitignore                    # Git ignore rules
└── README.md                     # Project documentation
```

## Deployment

This site is optimized for static hosting platforms:

### Vercel (Recommended)
1. Import from GitHub
2. Auto-deploys on push
3. Add custom domain `fariz.tech`
4. Serverless functions auto-detect

### Netlify
1. Connect GitHub repo
2. Auto-deploys on push
3. Add custom domain `fariz.tech`

## Key Features

### 📸 Screenshot Dump
- **NSFW Warning** popup before entry
- **Lightbox Viewer** - click any image to view full-size
- **Admin Panel** - secure access protection
- **Drag & Drop Upload** - multiple images at once
- **Edit Titles & Descriptions** - modify existing screenshots
- **Delete Screenshots** - remove unwanted content
- **Pin Important Screenshots** - highlight featured content
- **Secure Local Storage** - data persists in browser

### Admin Access
- **Secure Authentication** - protected access method
- **Invisible Interface** - no visible buttons for visitors
- **Full Content Management** - upload, edit, delete, pin
- **Batch Upload** - select multiple images at once
- **Real-time Updates** - changes reflect immediately

### Mobile Optimization
- **Bottom Navigation** on mobile devices
- **Responsive Lightbox** for image viewing
- **Touch-friendly** admin controls
- **Optimized Typography** for mobile reading

## Development

To run locally:
```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`

## Usage

### For Visitors:
1. Browse the portfolio normally
2. Visit "Screenshot Dumps" section
3. Accept NSFW warning to view collection
4. Click any image to view full-size in lightbox

### For Admin (You):
1. Go to `https://fariz.tech/screenshot_dump.html`
2. Use the secure access method to unlock admin panel
3. Drag & drop images or click to select
4. Edit titles/descriptions of existing screenshots
5. Pin important screenshots with the pin button
6. Delete screenshots with the × button

## Security

- **Zero Backend Dependencies** - everything runs client-side
- **Local Storage Only** - no external databases needed
- **Konami Code Protection** - obscure access method
- **No Admin UI Visible** - completely invisible to visitors

## License

MIT License - Feel free to use as inspiration for your own projects!

---

**Built with ❤️ by Fariz Anjum**
