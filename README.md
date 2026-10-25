# Easy Rosary

A simple guide to praying the rosary. Plain HTML, CSS, and JavaScript, with no build step.

## Structure

```
index.html        Home: hero, today's mysteries
pray.html         Guided rosary, one prayer at a time (with a back arrow to the home page)
history.html      A short history of the rosary
rosaries.html     What to look for in a rosary and where to find one
css/styles.css    Design tokens (light and dark) and all styles
js/prayers.js     Prayer texts, the four sets of mysteries, step sequence builder
js/rosary-svg.js  Draws the rosary and gives each bead an id
js/home.js        Fills in today's mysteries on the home page
js/pray.js        Guided mode: steps, bead highlighting, progress, keyboard
```

## Run it

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Deploy

Any static host works (Cloudflare Pages, Netlify, GitHub Pages). Point easyrosary.site at it.

## Notes

- Prayers can be switched between English and Latin on the guided page. The Latin texts follow prayinglatin.com's rosary page, with their accent marks kept. The interface and mystery names stay in English.
- Prayer texts are the traditional English versions. Check them, and the scripture references, against the source you prefer.
- Mysteries by day: Mon/Sat Joyful, Tue/Fri Sorrowful, Wed/Sun Glorious, Thu Luminous.
- Guided mode remembers your place in the browser (localStorage).