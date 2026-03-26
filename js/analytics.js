/**
 * Analytics event tracking.
 * Replace the body of trackEvent() with your analytics provider (GA4, Plausible, etc.)
 */

function trackEvent(eventName, eventData) {
  // Google Analytics 4 (uncomment when GA is installed):
  // if (typeof gtag === 'function') {
  //   gtag('event', eventName, eventData);
  // }

  // Debug logging (remove in production):
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    console.log('[Analytics]', eventName, eventData);
  }
}
