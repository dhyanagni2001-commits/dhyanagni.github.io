import EventEmitter from "../../utils/EventEmitter";

class ThreeSizes extends EventEmitter<{
  resize: { width: number; height: number; pixelRatio: number };
}> {
  width: number = 0;
  height: number = 0;
  pixelRatio: number = 1;
  canvas: HTMLCanvasElement | null = null;
  observer: ResizeObserver | null = null;

  init(_canvas: HTMLCanvasElement) {
    this.canvas = _canvas;
    this.observer = new ResizeObserver(this.resize.bind(this));
    this.observer.observe(this.canvas);
  }

  resize() {
    const rect = this.canvas?.getBoundingClientRect();
    if (!rect || !rect.width || !rect.height) return;
    // Phones have high DPR but weak GPUs; 1.5 keeps it sharp at ~45% fewer pixels.
    const maxRatio = window.matchMedia("(pointer: coarse)").matches ? 1.5 : 2;
    const pixelRatio = Math.min(window.devicePixelRatio, maxRatio);
    if (rect.width === this.width && rect.height === this.height && pixelRatio === this.pixelRatio) return;
    this.width = rect.width;
    this.height = rect.height;
    this.pixelRatio = pixelRatio;
    this.emit("resize", { width: this.width, height: this.height, pixelRatio: this.pixelRatio });
  }

  destroy() {
    this.observer?.disconnect();
    this.observer = null;
    this.canvas = null;
  }
}

export const threeSizes = new ThreeSizes();
