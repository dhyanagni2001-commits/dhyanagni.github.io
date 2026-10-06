<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import {
  AmbientLight,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshToonMaterial,
  OrthographicCamera,
  Scene,
  SphereGeometry,
  TorusGeometry,
  WebGLRenderer,
} from "three";

// Small cartoon rockets drifting through the space background behind the
// portfolio panel. Units are CSS pixels thanks to the orthographic camera.

const root = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

type Rocket = {
  heading: Group;
  roll: Group;
  flames: Mesh[];
  x: number;
  y: number;
  vx: number;
  vy: number;
  wobble: number;
  scale: number;
  puffTimer: number;
};

type Puff = { mesh: Mesh<SphereGeometry, MeshBasicMaterial>; life: number; maxLife: number };

const BODY_COLORS = ["#f5f5f4", "#fde68a", "#bae6fd", "#fecdd3"];
const ACCENT_COLORS = ["#ef4444", "#f97316", "#8b5cf6", "#06b6d4", "#ec4899"];

let renderer: WebGLRenderer | null = null;
let camera: OrthographicCamera | null = null;
let scene: Scene | null = null;
let rockets: Rocket[] = [];
let puffs: Puff[] = [];
let frame: number | null = null;
let lastTime = 0;
let width = 0;
let height = 0;
let isVisible = false;
let resizeObserver: ResizeObserver | null = null;
let intersectionObserver: IntersectionObserver | null = null;
const disposables: { dispose: () => void }[] = [];

const track = <T extends { dispose: () => void }>(item: T) => {
  disposables.push(item);
  return item;
};

const random = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)] as T;

const geometries = {
  body: () => track(new CylinderGeometry(7, 8, 24, 20)),
  nose: () => track(new ConeGeometry(7, 13, 20)),
  fin: () => track(new ConeGeometry(4.5, 11, 3)),
  window: () => track(new TorusGeometry(3.6, 1.3, 10, 24)),
  glass: () => track(new SphereGeometry(3.2, 16, 12)),
  flameOuter: () => track(new ConeGeometry(5, 14, 14)),
  flameInner: () => track(new ConeGeometry(2.8, 9, 12)),
  puff: () => track(new SphereGeometry(4, 10, 8)),
};

let shared: { [K in keyof typeof geometries]: ReturnType<(typeof geometries)[K]> } | null = null;

const toon = (color: string) => track(new MeshToonMaterial({ color: new Color(color) }));

const createRocket = (): Rocket => {
  const g = shared!;
  const accent = toon(pick(ACCENT_COLORS));
  const bodyMaterial = toon(pick(BODY_COLORS));

  const roll = new Group();

  const body = new Mesh(g.body, bodyMaterial);
  roll.add(body);

  const nose = new Mesh(g.nose, accent);
  nose.position.y = 18.5;
  roll.add(nose);

  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const fin = new Mesh(g.fin, accent);
    fin.position.set(Math.sin(angle) * 8, -9, Math.cos(angle) * 8);
    fin.rotation.y = angle;
    fin.scale.set(0.35, 1, 1.4);
    roll.add(fin);
  }

  const windowRing = new Mesh(g.window, accent);
  windowRing.position.set(0, 3, 7.2);
  roll.add(windowRing);

  const glass = new Mesh(g.glass, toon("#38bdf8"));
  glass.position.set(0, 3, 6.2);
  glass.scale.set(1, 1, 0.5);
  roll.add(glass);

  const flameOuter = new Mesh(g.flameOuter, track(new MeshBasicMaterial({ color: "#fb923c" })));
  flameOuter.rotation.x = Math.PI;
  flameOuter.position.y = -18;
  const flameInner = new Mesh(g.flameInner, track(new MeshBasicMaterial({ color: "#fde047" })));
  flameInner.rotation.x = Math.PI;
  flameInner.position.y = -16;
  roll.add(flameOuter, flameInner);

  const heading = new Group();
  heading.add(roll);
  scene!.add(heading);

  const rocket: Rocket = {
    heading,
    roll,
    flames: [flameOuter, flameInner],
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    wobble: Math.random() * Math.PI * 2,
    scale: 1,
    puffTimer: 0,
  };
  launch(rocket, true);
  return rocket;
};

// Rockets enter from below (or the sides) and fly up and across the screen.
const launch = (rocket: Rocket, scatter = false) => {
  const speed = random(55, 110);
  const angle = random(-0.55, 0.55) + Math.PI / 2;
  rocket.vx = Math.cos(angle) * speed;
  rocket.vy = Math.sin(angle) * speed;
  rocket.scale = random(0.7, 1.15);
  rocket.x = random(-width / 2, width / 2) - rocket.vx * 2;
  rocket.y = scatter ? random(-height / 2, height / 2) : -height / 2 - random(40, 260);
  rocket.heading.scale.setScalar(rocket.scale);
};

const spawnPuff = (x: number, y: number) => {
  const puff = puffs.find((item) => item.life >= item.maxLife);
  if (!puff) return;
  puff.life = 0;
  puff.maxLife = random(0.7, 1.1);
  puff.mesh.position.set(x + random(-2, 2), y + random(-2, 2), -20);
  puff.mesh.visible = true;
};

const resize = () => {
  if (!renderer || !camera || !root.value) return;
  width = root.value.clientWidth;
  height = window.innerHeight;
  renderer.setSize(width, height, false);
  camera.left = -width / 2;
  camera.right = width / 2;
  camera.top = height / 2;
  camera.bottom = -height / 2;
  camera.updateProjectionMatrix();
};

const tick = (time: number) => {
  frame = requestAnimationFrame(tick);
  if (!renderer || !scene || !camera) return;

  const dt = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;

  for (const rocket of rockets) {
    rocket.wobble += dt * 2;
    const sway = Math.sin(rocket.wobble) * 14;
    rocket.x += rocket.vx * dt + Math.cos(rocket.wobble) * sway * dt;
    rocket.y += rocket.vy * dt;

    rocket.heading.position.set(rocket.x, rocket.y, 0);
    rocket.heading.rotation.z = Math.atan2(rocket.vy, rocket.vx + Math.cos(rocket.wobble) * sway) - Math.PI / 2;
    rocket.roll.rotation.y += dt * 1.6;

    const flicker = 0.75 + Math.random() * 0.45;
    rocket.flames.forEach((flame) => flame.scale.set(1, flicker, 1));

    rocket.puffTimer += dt;
    if (rocket.puffTimer > 0.07) {
      rocket.puffTimer = 0;
      const tail = 22 * rocket.scale;
      const theta = rocket.heading.rotation.z - Math.PI / 2;
      spawnPuff(rocket.x + Math.cos(theta) * tail, rocket.y + Math.sin(theta) * tail);
    }

    const margin = 120;
    if (rocket.y > height / 2 + margin || Math.abs(rocket.x) > width / 2 + margin) launch(rocket);
  }

  for (const puff of puffs) {
    if (puff.life >= puff.maxLife) continue;
    puff.life += dt;
    const t = Math.min(puff.life / puff.maxLife, 1);
    puff.mesh.scale.setScalar(0.6 + t * 1.6);
    puff.mesh.material.opacity = 0.5 * (1 - t);
    if (t >= 1) puff.mesh.visible = false;
  }

  renderer.render(scene, camera);
};

const start = () => {
  if (frame !== null || !renderer) return;
  lastTime = performance.now();
  frame = requestAnimationFrame(tick);
};

const stop = () => {
  if (frame !== null) cancelAnimationFrame(frame);
  frame = null;
};

onMounted(() => {
  if (!canvas.value || !root.value) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  try {
    renderer = new WebGLRenderer({ canvas: canvas.value, alpha: true, antialias: true });
  } catch {
    renderer = null;
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);

  scene = new Scene();
  camera = new OrthographicCamera(-1, 1, 1, -1, -200, 200);
  camera.position.z = 100;

  scene.add(new AmbientLight(0xffffff, 1.4));
  const sun = new DirectionalLight(0xffffff, 2.2);
  sun.position.set(-1, 1.2, 2);
  scene.add(sun);

  shared = {
    body: geometries.body(),
    nose: geometries.nose(),
    fin: geometries.fin(),
    window: geometries.window(),
    glass: geometries.glass(),
    flameOuter: geometries.flameOuter(),
    flameInner: geometries.flameInner(),
    puff: geometries.puff(),
  };

  resize();

  puffs = Array.from({ length: 140 }, () => {
    const material = track(new MeshBasicMaterial({ color: "#e0f2fe", transparent: true, opacity: 0, depthWrite: false }));
    const mesh = new Mesh(shared!.puff, material);
    mesh.visible = false;
    scene!.add(mesh);
    return { mesh, life: 1, maxLife: 1 };
  });

  const count = width < 640 ? 3 : 7;
  rockets = Array.from({ length: count }, createRocket);

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(root.value);
  window.addEventListener("resize", resize);

  intersectionObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry?.isIntersecting ?? false;
    if (isVisible) start();
    else stop();
  });
  intersectionObserver.observe(root.value);
});

onBeforeUnmount(() => {
  stop();
  resizeObserver?.disconnect();
  intersectionObserver?.disconnect();
  window.removeEventListener("resize", resize);
  disposables.forEach((item) => item.dispose());
  disposables.length = 0;
  renderer?.dispose();
  renderer = null;
  scene = null;
  camera = null;
  rockets = [];
  puffs = [];
});
</script>

<template>
  <div ref="root" class="rocket-field" aria-hidden="true">
    <canvas ref="canvas" class="rocket-field-canvas"></canvas>
  </div>
</template>

<style scoped lang="scss">
.rocket-field {
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
  }
}
</style>
