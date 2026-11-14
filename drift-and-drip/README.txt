Drift & Drip - coffee shop website

FILES
  index.html  page structure
  style.css   colors, layout, animations
  script.js   menu, cart, delivery, map, stamp card

HOW TO RUN IN VISUAL STUDIO CODE
  1. Open the drift-and-drip folder in VS Code.
  2. Install the "Live Server" extension, right-click index.html, choose "Open with Live Server".

WHAT TO EDIT FIRST (top of script.js, the SHOP block and MENU list)
  phone    shop WhatsApp number, country code first, no + or spaces (example 639171234567)
  addr     address shown on the Visit screen
  geo      [latitude, longitude] of the shop. Currently the middle of Bago Aplaya, not the exact spot.
           Find the exact spot in Google Maps, right-click the pin, click the numbers to copy them.
  place    text used by the Open in Google Maps button
  cur      currency symbol
  fee      delivery fee, radius = delivery distance in km
  hours    opening hours per day
  MENU     your drinks, descriptions and prices
  Promo code DRIP10 is in script.js (search for DRIP10).

PUBLISHING
  Upload the whole folder to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages).
  The site must be on https:// for the "Use my current location" button to work.
  Orders are sent as WhatsApp messages. Customer details and stamps are saved only in each customer's browser.
