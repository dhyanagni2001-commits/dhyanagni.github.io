<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";

// A rippling surface of glowing dots behind the portfolio panel, like a
// signal or waveform, shaded from sky blue to hot pink. The waves drift over
// time, shift with scroll, and ripple outward from the pointer.

const root = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

const PALETTE = {
  sky: new Color("#0593C6"),
  skyLight: new Color("#7FCBE6"),
  snow: new Color("#FCFFFF"),
  pink: new Color("#D83995"),
  pinkLight: new Color("#EE9DCB"),
};

const WAVE_WIDTH = 44;
const WAVE_DEPTH = 36;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2 uPointer;

  varying float vHeight;
  varying float vMix;
  varying float vDepth;

  void main() {
    vec3 p = position;

    float t = uTime + uScroll * 1.5;
    float wave =
      sin(p.x * 0.28 + t * 0.55) * 1.0 +
      sin(p.z * 0.42 + t * 0.75) * 0.6 +
      sin((p.x + p.z) * 0.18 + t * 0.35) * 0.8;

    // Ripple spreading from the point under the cursor.
    float d = distance(p.xz, uPointer);
    wave += sin(d * 1.1 - uTime * 3.0) * 0.6 * exp(-d * 0.2);

    p.y += wave;
    vHeight = wave;
    vMix = smoothstep(-${WAVE_WIDTH / 2}.0, ${WAVE_WIDTH / 2}.0, p.x + sin(p.z * 0.1 + t * 0.2) * 6.0);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    vDepth = -mvPosition.z;
    gl_PointSize = uSize * uPixelRatio * (10.0 / vDepth);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uSky;
  uniform vec3 uPink;
  uniform vec3 uSnow;

  varying float vHeight;
  varying float vMix;
  varying float vDepth;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float softEdge = smoothstep(0.5, 0.1, r);

    vec3 color = mix(uSky, uPink, vMix);
    // Wave crests catch the light.
    float crest = smoothstep(0.6, 2.2, vHeight);
    color = mix(color, uSnow, crest * 0.5);

    float fade = smoothstep(44.0, 10.0, vDepth);
    float alpha = softEdge * fade * (0.7 + 0.3 * smoothstep(-2.0, 1.8, vHeight));
    gl_FragColor = vec4(color, alpha);
  }
`;

let renderer: WebGLRenderer | null = null;
let camera: PerspectiveCamera | null = null;
let scene: Scene | null = null;
let wave: Points | null = null;
let waveMaterial: ShaderMaterial | null = null;
let stars: Points | null = null;
let frame: number | null = null;
let startTime = 0;
let width = 0;
let height = 0;
let reducedMotion = false;
let resizeObserver: ResizeObserver | null = null;
let intersectionObserver: IntersectionObserver | null = null;
const disposables: { dispose: () => void }[] = [];

const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
let scrollOffset = 0;

const track = <T extends { dispose: () => void }>(item: T) => {
  disposables.push(item);
  return item;
};

const random = (min: number, max: number) => min + Math.random() * (max - min);

const createWave = () => {
  const isSmall = width < 640;
  const columns = isSmall ? 90 : 170;
  const rows = isSmall ? 70 : 120;
  const positions = new Float32Array(columns * rows * 3);

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const i = (row * columns + column) * 3;
      positions[i] = (column / (columns - 1) - 0.5) * WAVE_WIDTH;
      positions[i + 1] = 0;
      positions[i + 2] = (row / (rows - 1)) * -WAVE_DEPTH + 8;
    }
  }

  const geometry = track(new BufferGeometry());
  geometry.setAttribute("position", new BufferAttribute(positions, 3));

  waveMaterial = track(
    new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uSize: { value: isSmall ? 8 : 7.5 },
        uPixelRatio: { value: renderer!.getPixelRatio() },
        uPointer: { value: new Vector2(0, -4) },
        uSky: { value: PALETTE.sky },
        uPink: { value: PALETTE.pink },
        uSnow: { value: PALETTE.snow },
      },
    }),
  );

  wave = new Points(geometry, waveMaterial);
  wave.position.y = -2.2;
  scene!.add(wave);
};

const createStars = () => {
  const count = width < 640 ? 160 : 320;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const tints = [PALETTE.snow, PALETTE.skyLight, PALETTE.pinkLight];

  for (let i = 0; i < count; i++) {
    positions[i * 3] = random(-30, 30);
    positions[i * 3 + 1] = random(0, 18);
    positions[i * 3 + 2] = random(-30, -8);
    const tint = tints[i % 7 === 0 ? 2 : i % 3 === 0 ? 1 : 0]!;
    colors[i * 3] = tint.r;
    colors[i * 3 + 1] = tint.g;
    colors[i * 3 + 2] = tint.b;
  }

  const geometry = track(new BufferGeometry());
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("color", new BufferAttribute(colors, 3));

  const material = track(
    new PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: AdditiveBlending,
    }),
  );

  stars = new Points(geometry, material);
  scene!.add(stars);
};

const resize = () => {
  if (!renderer || !camera || !root.value) return;
  const nextWidth = root.value.clientWidth;
  const nextHeight = window.innerHeight;
  // Mobile URL bars resize the viewport while scrolling. Resizing the WebGL
  // buffer clears the canvas and flickers, so ignore height-only shrinks.
  if (nextWidth === width && nextHeight <= height) return;
  height = nextWidth === width ? Math.max(nextHeight, height) : nextHeight;
  width = nextWidth;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  // Narrow screens need a wider field of view to show the surface's sweep.
  camera.fov = camera.aspect < 1 ? 70 : 50;
  camera.updateProjectionMatrix();
};

const updateScroll = () => {
  if (!root.value) return;
  // 0 when the section top reaches the viewport top, growing as it scrolls past.
  scrollOffset = Math.max(0, -root.value.getBoundingClientRect().top) / Math.max(height, 1);
};

const handlePointer = (event: PointerEvent) => {
  pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
};

const render = (time: number) => {
  if (!renderer || !scene || !camera || !waveMaterial) return;
  const t = (time - startTime) / 1000;

  pointer.x += (pointer.tx - pointer.x) * 0.05;
  pointer.y += (pointer.ty - pointer.y) * 0.05;

  const uniforms = waveMaterial.uniforms;
  uniforms.uTime!.value = t;
  uniforms.uScroll!.value = scrollOffset;
  // Rough mapping from screen space onto the surface below the camera.
  (uniforms.uPointer!.value as Vector2).set(pointer.x * 16, pointer.y * 10 - 2);

  camera.position.x = pointer.x * 0.8;
  camera.position.y = 3 - pointer.y * 0.4;
  camera.lookAt(0, 0.6, -8);

  if (stars) stars.rotation.y = t * 0.005;

  renderer.render(scene, camera);
};

const tick = (time: number) => {
  frame = requestAnimationFrame(tick);
  updateScroll();
  render(time);
};

const start = () => {
  if (frame !== null || !renderer) return;
  if (reducedMotion) {
    updateScroll();
    render(performance.now());
    return;
  }
  frame = requestAnimationFrame(tick);
};

const stop = () => {
  if (frame !== null) cancelAnimationFrame(frame);
  frame = null;
};

onMounted(() => {
  if (!canvas.value || !root.value) return;
  reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  try {
    renderer = new WebGLRenderer({ canvas: canvas.value, alpha: true, antialias: true });
  } catch {
    renderer = null;
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);

  scene = new Scene();
  camera = new PerspectiveCamera(50, 1, 0.1, 80);
  camera.position.set(0, 4, 12);

  resize();
  createWave();
  createStars();
  startTime = performance.now();

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(root.value);
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", handlePointer, { passive: true });

  intersectionObserver = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) start();
    else stop();
  });
  intersectionObserver.observe(root.value);
});

onBeforeUnmount(() => {
  stop();
  resizeObserver?.disconnect();
  intersectionObserver?.disconnect();
  window.removeEventListener("resize", resize);
  window.removeEventListener("pointermove", handlePointer);
  disposables.forEach((item) => item.dispose());
  disposables.length = 0;
  renderer?.dispose();
  renderer = null;
  scene = null;
  camera = null;
  wave = null;
  waveMaterial = null;
  stars = null;
});
</script>

<template>
  <div ref="root" class="sky-field" aria-hidden="true">
    <canvas ref="canvas" class="sky-field-canvas"></canvas>
  </div>
</template>

<style scoped lang="scss">
.sky-field {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  &-canvas {
    position: sticky;
    top: 0;
    display: block;
    width: 100%;
    height: 100vh;
    height: 100lvh;
    transform: translateZ(0);
  }
}
</style>
