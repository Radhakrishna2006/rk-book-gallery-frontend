# RK's Book Gallery — Modern Frontend

[![Live Site](https://img.shields.io/badge/Vercel-Live%20Site-black?logo=vercel&logoColor=white)](https://rk-book-gallery.vercel.app)
[![Backend API](https://img.shields.io/badge/Render-Backend%20API-46E3B7?logo=render&logoColor=white)](https://rk-book-gallery-backend.onrender.com/api/books)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%20Modules-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Modern%20Design-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

A responsive, modern single-page application for **RK’s Book Gallery**, deployed on **Vercel** and integrated with the Spring Boot backend on **Render**.

---

## 🌐 Live Links

- **Live Storefront**: [https://rk-book-gallery.vercel.app](https://rk-book-gallery.vercel.app)
- **Alternate Domain**: [https://rk-book-gallery-kodari2.vercel.app](https://rk-book-gallery-kodari2.vercel.app)
- **Backend API**: [https://rk-book-gallery-backend.onrender.com](https://rk-book-gallery-backend.onrender.com)
- **Backend Repository**: [https://github.com/Radhakrishna2006/rk-book-gallery-backend](https://github.com/Radhakrishna2006/rk-book-gallery-backend)

---

## ✨ Features

- **Book Catalog**: Browse by genre (Stories, Comics, Biographies, Novels, Education), search by title/author/ISBN, and view rich book details.
- **Shopping Cart**: Real-time cart synchronization with item count badges and price calculation.
- **User Authentication**: Sign Up and Sign In modal with JWT authentication and session persistence.
- **Admin Dashboard**: Full CRUD management of books and customer order fulfillment.
- **Checkout Flow**: Delivery address capture and instant order placement.
- **Modern UI**: Clean typography (Google Fonts Inter), glassmorphism effects, responsive layout for mobile and desktop, and fallback covers.

---

## 🔑 Demo Admin Credentials

- **Email**: `admin@rkbookgallery.com`
- **Password**: `Admin@123`

---

## 📁 Project Structure

```
project-frontend/
├── index.html                   # HTML entry point with API endpoint configuration
├── vercel.json                  # Clean URL rewrites for Vercel deployment
├── README.md                    # Documentation
└── assets/
    ├── css/
    │   └── style.css            # Complete design system and styling
    ├── js/
    │   ├── api.js               # REST API client using fetch
    │   ├── app.js               # Main application controller and router
    │   ├── config.js            # Configuration and environment detection
    │   ├── data.js              # Offline fallback dataset
    │   ├── state.js             # Client-side state manager
    │   └── ui.js                # DOM rendering components
    └── images/
        ├── favicon.jpg          # Favicon
        └── book-cover-fallback.svg
```

---

## 💻 Local Development

Serve the directory with any static server:

```powershell
# Using Python
python -m http.server 5500

# Using Node.js npx
npx serve .
```

The frontend will automatically communicate with the local backend at `http://localhost:8080/api` when on localhost, and switch to the live Render backend when deployed.
