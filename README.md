# Book Gallery Frontend

Static HTML, CSS, and JavaScript frontend for RK's Book Gallery. No build step or package manager required.

## Deploy to Production

Upload the entire `project-frontend/` folder to a static hosting platform (e.g., Netlify, Vercel, GitHub Pages, Nginx, or AWS S3).

Before deploying, set the API base URL by adding a `<script>` block to `index.html` before `app.js` loads:

```html
<script>
  globalThis.BOOK_GALLERY_API_BASE_URL = "https://your-api-domain.com/api";
</script>
```

Also make sure the backend's `CORS_ALLOWED_ORIGINS` env var includes your frontend's exact origin (e.g., `https://your-frontend-domain.com`).

## Run Locally

Serve this directory with VS Code Live Server (open `index.html`) or any static HTTP server. The backend API must be running at `http://localhost:8080/api`.

## Contents

- `index.html` — application entry point
- `assets/css/style.css` — all styles
- `assets/js/app.js` — main application logic
- `assets/js/api.js` — API client (reads `BOOK_GALLERY_API_BASE_URL`)
- `assets/js/config.js` — app configuration
- `assets/js/data.js` — fallback sample data (shown if API is unreachable)
- `assets/images/` — local image assets including favicon
