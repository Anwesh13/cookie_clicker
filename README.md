# 🍪 Cookie Clicker Game (HTML + JS + Tailwind + PWA)

A fun and addictive incremental game where you click to collect cookies, buy upgrades, unlock achievements, and build your cookie empire — now as a mobile-friendly **Progressive Web App (PWA)**.

---

## 🚀 Features

- Click-based cookie generation
- Auto-clickers and click upgrades
- Inventory system with power-ups
- Achievements and level progression
- Dark mode + background music toggle
- Save/Load game using localStorage
- Offline support (via Service Worker)
- Fully responsive and PWA installable

---

## 🕹️ How to Play

1. **Click the cookie** to collect cookies.
2. **Buy upgrades** to improve click strength or auto-clickers.
3. **Unlock inventory items** (like 🍯 Golden Cookie or 🎁 Mystery Box).
4. **Check achievements** as you grow.

---

## 📱 PWA Setup

This project is a fully offline-capable Progressive Web App:

- Uses a `manifest.json` for install prompt
- Registers `service-worker.js` for caching assets
- Can be installed on mobile/desktop (Add to Home Screen)

### Test PWA locally with XAMPP:

1. Place all files in `htdocs/cookie-clicker/`
2. Start Apache in XAMPP
3. Visit `http://localhost/cookie-clicker/`
4. You’ll see the install prompt, or click “📲 Install Cookie Clicker”

---

## 📂 File Structure

```
cookie-clicker/
│
├── index.html              # Main game page
├── style.css               # Custom styling (with Tailwind)
├── game.js                 # Game logic (JavaScript)
├── manifest.json           # PWA manifest
├── service-worker.js       # Caches assets for offline use
├── icon-192.png            # PWA icon
└── icon-512.png            # PWA high-res icon
```

---

## 🛠️ Built With

- HTML, CSS (TailwindCSS), JavaScript
- localStorage for save/load
- Service Worker for caching
- Audio effects and visual polish

---

## 📦 Credits

- Sound effects from [Pixabay](https://pixabay.com/)
- UI inspiration: Cookie Clicker, Cells to Singularity
- Developed by [Anwesh](https://github.com/Anwesh13)

---

## 📜 License

MIT License. Use it freely and have fun clicking!
