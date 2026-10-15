const isLocalhost = Boolean(
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
   window.location.hostname === "127.0.0.1" ||
   window.location.hostname === "[::1]")
);

export const API_BASE_URL =
  globalThis.BOOK_GALLERY_API_BASE_URL ||
  (isLocalhost ? "http://localhost:8080/api" : "https://rk-book-gallery-backend.onrender.com/api");
export const BOOK_COVER_FALLBACK_URL = new URL("../images/book-cover-fallback.svg", import.meta.url).href;

export const APP_CONFIG = {
  appName: "RK’s Book Gallery",
  defaultCurrency: "₹",
  defaultDeliveryCharge: 49,
  defaultDiscount: 0,
};
