export const API_BASE_URL = globalThis.BOOK_GALLERY_API_BASE_URL || "http://localhost:8080/api";
export const BOOK_COVER_FALLBACK_URL = new URL("../images/book-cover-fallback.svg", import.meta.url).href;

export const APP_CONFIG = {
  appName: "RK’s Book Gallery",
  defaultCurrency: "₹",
  defaultDeliveryCharge: 49,
  defaultDiscount: 0,
};
