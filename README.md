# Easy Rosary

A simple guide to praying the rosary. Plain HTML, CSS, and JavaScript, with no build step.

## Structure

```
home.html         Home: hero, today's mysteries (served at /home)
index.html        Tiny redirect from / to /home (GitHub Pages needs an index.html at the root)
pray.html         Guided rosary, one prayer at a time, with a back arrow to home (served at /pray)
history.html      A short history of the rosary (served at /history)
rosaries.html     What to look for in a rosary and where to find one (served at /rosaries)
css/styles.css    Design tokens (light and dark) and all styles
js/prayers.js     Prayer texts, the four sets of mysteries, step sequence builder
js/rosary-svg.js  Draws the rosary and gives each bead an id
js/home.js        Fills in today's mysteries on the home page
js/pray.js        Guided mode: steps, bead highlighting, progress, keyboard, display options
js/pwa.js         Registers the service worker and shows the install button
sw.js             Service worker for offline use (bump VERSION when files change)
manifest.webmanifest  Details for installing the site as an app
icons/            App icons
```

## Run it

Links have no `.html`, so serve the folder with a server that supports that:

```
npx serve .
```

Python's `http.server` does not map `/pray` to `pray.html`.

## Deploy

Any static host works (Cloudflare Pages, Netlify, GitHub Pages). Point easyrosary.site at it.

## Notes

- Prayers can be switched between English and Latin on the guided page. The Latin texts follow prayinglatin.com's rosary page, with their accent marks kept. The interface and mystery names stay in English.
- Prayer texts are the traditional English versions. Check them, and the scripture references, against the source you prefer.
- Mysteries by day: Mon/Sat Joyful, Tue/Fri Sorrowful, Wed/Sun Glorious, Thu Luminous.
- Guided mode remembers your place in the browser (localStorage).
- Offline and install: after one visit online, the site works without a connection and can be added to the home screen (on iPhone: Share, then Add to Home Screen). Google Fonts are saved on first load; without them the site falls back to system fonts. When you change any files, bump `VERSION` in `sw.js` so installed copies refresh.
- Display options on the guided page: text size, a words-only view that hides the beads, and a keep-screen-on switch (shown only where the browser supports it). Choices are remembered in the browser.
- Seasonal Sundays: Sundays use the Joyful Mysteries from Advent through the Christmas season (approximated as ending on 8 January) and the Sorrowful Mysteries in Lent, otherwise Glorious. This is a long-standing custom, not a rule, and the mysteries picker always lets you choose.
- Clean URLs: pages are linked as `/pray`, `/history` and so on. GitHub Pages and Netlify map these to the `.html` files automatically, and the old `.html` addresses still work. Each page names its clean address in a canonical tag.