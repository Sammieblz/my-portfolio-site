# Privacy notice

Last updated: July 28, 2026.

This portfolio does not include analytics, advertising, fingerprinting, or third-party
runtime scripts.

## Data handled by the site

- The memory game stores high scores only in the visitor's browser using `localStorage`.
- The contact form sends the submitted name, email address, subject, message, and
  anti-spam field to this site's same-origin endpoint. After validation, the message is
  delivered to Formspree. Do not submit sensitive information.
- Weather defaults to Samuel's published city-level coordinates. Exact browser
  geolocation is requested only after a visitor selects **Use my location**. Coordinates
  are sent in a POST body to this site's weather endpoint, rounded to two decimal places,
  and then sent to OpenWeatherMap or Open-Meteo to return current conditions. They are
  not placed in the request URL, cached, or persisted by this application.
- The projects endpoint requests public repository data from GitHub and does not send
  visitor identifiers to GitHub.
- Hosting and upstream providers may process standard network logs such as IP address,
  user agent, request path, and timestamp under their own policies.

Visitors can clear memory-game data through browser storage settings, decline location
permission, or use email instead of the contact form.

The service worker caches public application assets and portfolio pages for offline use.
It does not cache API responses or résumé documents.

Privacy questions can be sent to
[samuelndubuisi32@gmail.com](mailto:samuelndubuisi32@gmail.com).
