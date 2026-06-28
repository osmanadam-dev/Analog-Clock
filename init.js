/**
 * Analog Clock
 * Renders a live analog clock on a <canvas> element using the
 * Canvas 2D API. Built as a self-contained ES6 class — no globals,
 * no dependencies.
 */
class AnalogClock {
  /**
   * @param {string} canvasId - id of the <canvas> element to render into
   * @param {object} [options]
   * @param {number} [options.sizeRatio=0.9] - radius as a ratio of canvas size
   */
  constructor(canvasId, { sizeRatio = 0.9 } = {}) {
    this.canvas = document.getElementById(canvasId);

    if (!this.canvas) {
      throw new Error(`AnalogClock: no element found with id "${canvasId}"`);
    }

    this.ctx = this.canvas.getContext("2d");
    this.sizeRatio = sizeRatio;
    this.frameId = null;

    this.#setupCanvas();
    window.addEventListener("resize", () => this.#setupCanvas());
  }

  /**
   * Configures canvas dimensions, handles high-DPI (retina) screens,
   * and centers the drawing origin.
   */
  #setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const { clientWidth, clientHeight } = this.canvas;
    const size = Math.min(clientWidth, clientHeight) || this.canvas.width;

    // Render at native resolution, then scale back down via CSS,
    // so the clock stays crisp on high-DPI displays.
    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset before re-centering
    this.ctx.scale(dpr, dpr);
    this.ctx.translate(size / 2, size / 2);

    this.radius = (size / 2) * this.sizeRatio;
  }

  /** Starts the render loop. */
  start() {
    const tick = () => {
      this.#draw();
      this.frameId = requestAnimationFrame(tick);
    };
    tick();
  }

  /** Stops the render loop (e.g. when the clock is removed from the page). */
  stop() {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  /** Clears and redraws every layer of the clock for the current frame. */
  #draw() {
    const { ctx, radius, canvas } = this;

    // Clear in untransformed space, then restore the centered transform.
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    this.#drawFace(radius);
    this.#drawNumbers(radius);
    this.#drawTicks(radius);
    this.#drawHands(radius);
  }

  #drawFace(radius) {
    const { ctx } = this;
    const gradient = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
    gradient.addColorStop(0, "#333");
    gradient.addColorStop(0.5, "#fff");
    gradient.addColorStop(1, "#333");

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();

    ctx.strokeStyle = gradient;
    ctx.lineWidth = radius * 0.1;
    ctx.stroke();

    // center hub
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = "#333";
    ctx.fill();
  }

  #drawNumbers(radius) {
    const { ctx } = this;
    ctx.font = `${radius * 0.15}px system-ui, sans-serif`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "#333";

    for (let num = 1; num <= 12; num++) {
      const angle = (num * Math.PI) / 6;
      const x = Math.sin(angle) * radius * 0.85;
      const y = -Math.cos(angle) * radius * 0.85;
      ctx.fillText(num.toString(), x, y);
    }
  }

  #drawTicks(radius) {
    const { ctx } = this;
    for (let i = 0; i < 60; i++) {
      const angle = (i * Math.PI) / 30;
      const isHourMark = i % 5 === 0;
      const inner = radius * (isHourMark ? 0.78 : 0.82);
      const outer = radius * 0.85;

      ctx.beginPath();
      ctx.lineWidth = isHourMark ? radius * 0.015 : radius * 0.007;
      ctx.strokeStyle = "#333";
      ctx.moveTo(Math.sin(angle) * inner, -Math.cos(angle) * inner);
      ctx.lineTo(Math.sin(angle) * outer, -Math.cos(angle) * outer);
      ctx.stroke();
    }
  }

  #drawHands(radius) {
    const now = new Date();
    const ms = now.getMilliseconds();
    const seconds = now.getSeconds() + ms / 1000;
    const minutes = now.getMinutes() + seconds / 60;
    const hours = (now.getHours() % 12) + minutes / 60;

    this.#drawHand((hours * Math.PI) / 6, radius * 0.5, radius * 0.07, "#333");
    this.#drawHand((minutes * Math.PI) / 30, radius * 0.8, radius * 0.05, "#333");
    this.#drawHand((seconds * Math.PI) / 30, radius * 0.9, radius * 0.02, "#e63946");
  }

  #drawHand(angle, length, width, color) {
    const { ctx } = this;
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.rotate(angle);
    ctx.moveTo(0, length * 0.15); // slight tail behind center, like a real hand
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.restore();
  }
}

// Bootstrap once the DOM is ready.
document.addEventListener("DOMContentLoaded", () => {
  const clock = new AnalogClock("clock");
  clock.start();
});
