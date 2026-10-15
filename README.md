# Book Gallery Frontend

Static HTML, CSS, and JavaScript frontend for RK's Book Gallery. No frontend
build step or package manager is required.

## Run locally

Serve this directory with VS Code Live Server (open `index.html`) or another
static HTTP server. The backend API should be running at
`http://localhost:8080/api`.

The API base URL defaults to `http://localhost:8080/api`. For another API
origin, define `globalThis.BOOK_GALLERY_API_BASE_URL` in a script before
`assets/js/app.js` is loaded, for example:

```html
<script>
  globalThis.BOOK_GALLERY_API_BASE_URL = "https://api.example.com/api";
</script>
```

When deploying to a different origin, add the frontend's exact origin to the
backend's `CORS_ALLOWED_ORIGINS` environment variable.

## Contents

- `index.html` — application entry point
- `assets/css/` — styles
- `assets/js/` — application, API client, configuration, and sample data
- `assets/images/` — local image assets
