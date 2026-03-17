/**
 * GA4 Analytics — single initialization, env-var-driven measurement ID.
 *
 * Usage:
 *   import { initGA, trackEvent } from "./analytics";
 *   initGA();                                   // call once at app root
 *   trackEvent("assessment_completed", { … });  // fire anywhere
 */

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let initialized = false;

/** Load gtag.js script and initialise the dataLayer. Call once. */
export function initGA() {
  if (initialized || !GA_ID) return;
  initialized = true;

  // dataLayer + gtag shim (must exist before the script loads)
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false }); // we send page_view manually for SPA

  // Inject the gtag.js script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

/** Send a page_view event (call on every SPA route change). */
export function trackPageView(path, title) {
  if (!GA_ID) return;
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_title: title || document.title,
  });
}

/** Send a custom GA4 event. */
export function trackEvent(name, params = {}) {
  if (!GA_ID) return;
  window.gtag?.("event", name, params);
}
