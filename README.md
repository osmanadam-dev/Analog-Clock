# 🕐 Analog Clock

A clean, real-time analog clock built with vanilla JavaScript and the HTML5 Canvas API — no frameworks, no dependencies, just the browser.

![Analog clock preview](./screenshots/clock-preview.png)

## ✨ Features

- Live, ticking analog clock face rendered entirely on `<canvas>`
- Hour, minute, and second hands synced to the system clock
- Smooth radial-gradient bezel for a subtle 3D effect
- Numbered clock face (1–12) with rotation math handled per tick
- Fully responsive container with a soft gradient background

## 🛠️ Built With

- **HTML5** — structure and canvas element
- **CSS3** — layout, gradient background, responsive sizing
- **JavaScript (Vanilla)** — Canvas 2D API for all drawing logic

## 📂 Project Structure

```
.
├── index.html      # Page markup and canvas element
├── style.css       # Page layout and clock container styling
└── init.js         # Canvas drawing logic and clock tick loop
```

## 🚀 Getting Started

No build step or dependencies required.

1. Clone the repo
   ```bash
   git clone https://github.com/osmanadam-dev/analog-clock.git
   ```
2. Open `index.html` in your browser

That's it — the clock starts ticking immediately using your device's local time.

## ⚙️ How It Works

The clock is encapsulated in an `AnalogClock` class and redrawn every frame via `requestAnimationFrame` (smoother than a fixed `setInterval`, and it pauses automatically in inactive tabs):

1. **`#setupCanvas()`** — sizes the canvas buffer to match `devicePixelRatio` so the clock stays crisp on retina displays, then centers the drawing origin
2. **`#drawFace()`** — draws the white clock face and a radial-gradient bezel ring
3. **`#drawNumbers()`** — places the numbers 1–12 using `sin`/`cos` positioning instead of repeated rotate/translate calls
4. **`#drawTicks()`** — adds minute and hour tick marks around the face
5. **`#drawHands()`** — computes hour/minute/second angles (including milliseconds, for a smooth sweeping second hand) and draws each via `#drawHand()`

Because the canvas context is translated to its own center once at setup, every drawing call happens relative to `(0, 0)`, keeping the rotation math simple. The class also listens for `resize` events and recalculates the canvas dimensions automatically.

## 🔧 What Changed in the Rewrite

The original version worked but had a few rough edges. This version fixes them:

| Before | After |
|---|---|
| `drawClock()` was defined 4 times, each silently overwriting the last | Single class with private methods (`#drawFace`, `#drawNumbers`, etc.) |
| Initial render call was commented out (clock was blank for 1s on load) | Renders immediately, then on every animation frame |
| Dead code at the bottom referencing a nonexistent `app` element | Removed entirely |
| `setInterval(drawClock, 1000)` — second hand visibly jumps | `requestAnimationFrame` with millisecond precision — smooth sweep |
| Fixed canvas resolution (blurry on retina screens) | Canvas buffer scales with `devicePixelRatio` |
| No tick marks | Minute/hour tick marks added around the face |
| Plain CSS values | CSS custom properties + `clamp()` for fluid sizing |

## 📌 Roadmap

- [ ] Add a dark mode theme
- [ ] Add a digital time readout below the clock
- [ ] Optional ticking sound effect (toggleable)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Osman Adam**
- GitHub: [@osmanadam-dev](https://github.com/osmanadam-dev)
- Portfolio: [lnk.bio/osmanadam-dev](https://lnk.bio/osmanadam-dev)
