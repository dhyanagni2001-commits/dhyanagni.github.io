<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { lenis } from "../../../composables/useScroll";
import RocketField from "./RocketField.vue";

const frame = ref<HTMLIFrameElement | null>(null);
const section = ref<HTMLElement | null>(null);
const frameHeight = ref(600);
const activePage = ref("about");
const emit = defineEmits<{ ready: []; visibility: [visible: boolean] }>();
const legacyUrl = `${import.meta.env.BASE_URL}legacy/index.html`;
const pages = ["about", "resume", "projects", "milestones", "contact"] as const;
const featuredProjects = [
  {
    title: "PayFlow",
    summary: "Real-time payments CDC lakehouse",
    metric: "3.3K events/s",
    detail: "Zero loss across 12 chaos tests",
    stack: ["Kafka", "Debezium", "Delta Lake", "Airflow"],
    url: "https://github.com/dhyanagni2001-commits/PayFlow",
  },
  {
    title: "FlashKV",
    summary: "Redis-compatible key-value store in C++20",
    metric: "3.27M ops/s",
    detail: "53 Redis commands, runs in the browser via WebAssembly",
    stack: ["C++20", "Event loop", "WebAssembly"],
    url: "https://github.com/dhyanagni2001-commits/FlashKV",
  },
  {
    title: "First Fifty",
    summary: "Agentic battery-cell triage",
    metric: "7–8 of top 10",
    detail: "Longest-lived cells found after only 50 cycles",
    stack: ["Claude agents", "Databricks", "Python"],
    url: "https://github.com/dhyanagni2001-commits/First_Fifty",
  },
];

let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;
let visibilityObserver: IntersectionObserver | null = null;
let frameDocument: Document | null = null;
let resizeFrame: number | null = null;

const updateHeight = () => {
  const main = frame.value?.contentDocument?.querySelector<HTMLElement>("main");
  if (!main) return;

  const styles = frame.value?.contentWindow?.getComputedStyle(main);
  const marginTop = Number.parseFloat(styles?.marginTop ?? "0") || 0;
  const marginBottom = Number.parseFloat(styles?.marginBottom ?? "0") || 0;
  const nextHeight = Math.max(Math.ceil(main.getBoundingClientRect().height + marginTop + marginBottom), 320);
  if (nextHeight === frameHeight.value) return;

  frameHeight.value = nextHeight;

  if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
  nextTick(() => {
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = null;
      lenis.value?.resize();
    });
  });
};

const scrollToPortfolio = () => {
  const target = frame.value ?? section.value;
  if (!target) return;

  const offset = frame.value ? -88 : -16;
  const instance = lenis.value;

  if (instance) {
    instance.resize();
    instance.scrollTo(target, { offset, immediate: true, force: true });
    return;
  }

  window.scrollTo({
    top: window.scrollY + target.getBoundingClientRect().top + offset,
    left: 0,
    behavior: "auto",
  });
};

const navigateTo = async (page: string, shouldScroll = true) => {
  if (!page || !frameDocument) return;

  const button = Array.from(frameDocument.querySelectorAll<HTMLButtonElement>("[data-nav-link]")).find(
    (item) => item.textContent?.trim().toLowerCase() === page.toLowerCase(),
  );

  button?.click();
  activePage.value = page;

  // The selected legacy page can be much shorter than the previous one. Let
  // Vue apply the new iframe height before calculating the parent scroll
  // position, otherwise Lenis can retain a now-invalid target and jump upward.
  updateHeight();
  await nextTick();
  updateHeight();
  await nextTick();

  if (shouldScroll) scrollToPortfolio();
};

const navigatePortfolio = (event: Event) => navigateTo((event as CustomEvent<string>).detail);

const scrollParentBy = (delta: number, immediate: boolean) => {
  const instance = lenis.value;
  if (!instance) {
    window.scrollBy({ top: delta, left: 0 });
    return;
  }

  const nextScroll = Math.max(0, Math.min(instance.targetScroll + delta, instance.limit));
  instance.scrollTo(nextScroll, { immediate, force: true, lerp: immediate ? undefined : 0.1 });
};

const relayWheel = (event: WheelEvent) => {
  event.preventDefault();

  const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
  const deltaY = event.deltaY * multiplier;

  if (!lenis.value) {
    window.scrollBy({ top: deltaY, left: 0, behavior: "auto" });
    return;
  }

  // Iframe wheel events do not bubble to the parent window. Re-dispatch a
  // normalized event so Lenis handles trackpads and mouse wheels exactly as it
  // does everywhere else on the page.
  window.dispatchEvent(
    new WheelEvent("wheel", {
      deltaX: event.deltaX * multiplier,
      deltaY,
      deltaMode: 0,
      bubbles: true,
      cancelable: true,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
      metaKey: event.metaKey,
    }),
  );
};

const relayKeyScroll = (event: KeyboardEvent) => {
  const target = event.target instanceof Element ? event.target : null;
  if (target?.closest("input, textarea, select, button, a, [contenteditable='true']")) return;

  const pageStep = Math.max(window.innerHeight * 0.85, 320);
  const deltas: Record<string, number> = {
    ArrowDown: 48,
    ArrowUp: -48,
    PageDown: pageStep,
    PageUp: -pageStep,
    " ": event.shiftKey ? -pageStep : pageStep,
  };

  if (event.key === "Home" || event.key === "End") {
    event.preventDefault();
    const targetScroll = event.key === "Home" ? 0 : (lenis.value?.limit ?? document.documentElement.scrollHeight);
    if (lenis.value) {
      lenis.value.scrollTo(targetScroll, { force: true });
    } else {
      window.scrollTo({ top: targetScroll, left: 0, behavior: "auto" });
    }
    return;
  }

  const delta = deltas[event.key];
  if (delta === undefined) return;
  event.preventDefault();
  scrollParentBy(delta, false);
};

const redirectSocialLink = (event: Event) => {
  const element = event.target instanceof Element ? event.target : null;
  const link = element?.closest<HTMLAnchorElement>("a.social-link");
  if (!link?.href) return;

  event.preventDefault();
  event.stopImmediatePropagation();
  window.location.assign(link.href);
};

const relayMouseMove = (event: MouseEvent) => {
  const frameRect = frame.value?.getBoundingClientRect();
  if (!frameRect) return;

  window.dispatchEvent(
    new CustomEvent("portfolio:mousemove", {
      detail: {
        clientX: frameRect.left + event.clientX,
        clientY: frameRect.top + event.clientY,
      },
    }),
  );
};

const handleFrameLoad = async () => {
  await nextTick();
  frameDocument = frame.value?.contentDocument ?? null;
  if (!frameDocument) return;

  const embeddedStyle = frameDocument.createElement("style");
  embeddedStyle.textContent = `
    .navbar, .sidebar { display: none !important; }
    html, body { background: transparent !important; }
    @media (hover: hover) and (pointer: fine) {
      html, body, body * { cursor: none !important; }
    }
    @media (max-width: 579px) {
      main { padding-inline: 14px !important; }
      article { padding: 20px 16px !important; border-radius: 16px !important; }
    }
    @media (max-width: 839px), (pointer: coarse) {
      html, body { touch-action: pan-x pan-y pinch-zoom; overscroll-behavior: auto; }
      .mapbox iframe { pointer-events: none !important; }
    }
  `;
  frameDocument.head.appendChild(embeddedStyle);

  updateHeight();

  resizeObserver?.disconnect();
  resizeObserver = new ResizeObserver(updateHeight);
  const main = frameDocument.querySelector("main");
  if (main) resizeObserver.observe(main);

  mutationObserver?.disconnect();
  mutationObserver = new MutationObserver(() => requestAnimationFrame(updateHeight));
  mutationObserver.observe(frameDocument.body, {
    childList: true,
    subtree: true,
  });

  frameDocument.querySelectorAll("img").forEach((image) => image.addEventListener("load", updateHeight));
  frameDocument.querySelectorAll<HTMLButtonElement>("[data-nav-link]").forEach((button) => {
    button.addEventListener("click", () => {
      activePage.value = button.textContent?.trim().toLowerCase() ?? "about";
    });
  });

  frameDocument.addEventListener("wheel", relayWheel, { passive: false });
  frameDocument.addEventListener("keydown", relayKeyScroll);
  frameDocument.addEventListener("click", redirectSocialLink, true);
  frameDocument.addEventListener("mousemove", relayMouseMove);

  emit("ready");
};

onMounted(() => {
  window.addEventListener("portfolio:navigate", navigatePortfolio);

  visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      const isVisible = entry?.isIntersecting ?? false;
      document.body.classList.toggle("legacy-portfolio-visible", isVisible);
      emit("visibility", isVisible);
    },
    { rootMargin: "-42% 0px -42% 0px" },
  );

  if (section.value) visibilityObserver.observe(section.value);
});

onBeforeUnmount(() => {
  window.removeEventListener("portfolio:navigate", navigatePortfolio);
  resizeObserver?.disconnect();
  mutationObserver?.disconnect();
  visibilityObserver?.disconnect();
  if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
  resizeFrame = null;
  frameDocument?.removeEventListener("wheel", relayWheel);
  frameDocument?.removeEventListener("keydown", relayKeyScroll);
  frameDocument?.removeEventListener("click", redirectSocialLink, true);
  frameDocument?.removeEventListener("mousemove", relayMouseMove);
  document.body.classList.remove("legacy-portfolio-visible");
});
</script>

<template>
  <section ref="section" class="legacy-portfolio" aria-label="Dhyan S Agni portfolio">
    <RocketField />
    <div class="legacy-portfolio-transition" aria-hidden="true">
      <span>Explore my work</span>
      <span class="legacy-portfolio-transition-line"></span>
    </div>
    <div class="featured">
      <h2 class="featured-title">Featured work</h2>
      <ul class="featured-list">
        <li v-for="project in featuredProjects" :key="project.title">
          <a class="featured-card" :href="project.url" target="_blank" rel="noopener" data-hoversound="hover">
            <span class="featured-metric">{{ project.metric }}</span>
            <span class="featured-detail">{{ project.detail }}</span>
            <h3 class="featured-name">{{ project.title }}</h3>
            <p class="featured-summary">{{ project.summary }}</p>
            <ul class="featured-stack">
              <li v-for="tech in project.stack" :key="tech">{{ tech }}</li>
            </ul>
            <span class="featured-link">View on GitHub →</span>
          </a>
        </li>
      </ul>
      <button type="button" class="featured-all" data-hoversound="hover" @click="navigateTo('projects')">
        See all projects →
      </button>
    </div>
    <nav class="legacy-tabs" aria-label="Portfolio sections">
      <button
        v-for="page in pages"
        :key="page"
        type="button"
        class="legacy-tabs-button"
        :class="{ 'legacy-tabs-button-active': activePage === page }"
        :aria-current="activePage === page ? 'page' : undefined"
        @click="navigateTo(page)"
      >
        <span class="legacy-tabs-dot"></span>
        {{ page }}
      </button>
    </nav>
    <iframe
      ref="frame"
      class="legacy-portfolio-frame"
      :src="legacyUrl"
      title="Dhyan S Agni — portfolio, resume, projects, milestones, and contact"
      scrolling="no"
      :style="{ height: `${frameHeight}px` }"
      @load="handleFrameLoad"
    ></iframe>
  </section>
</template>

<style scoped lang="scss">
.legacy-portfolio {
  position: relative;
  z-index: 5;
  width: 100%;
  background-color: #071b35;
  background-image:
    radial-gradient(circle at 18% 15%, rgba(39, 214, 255, 0.14), transparent 25%),
    radial-gradient(circle at 82% 48%, rgba(48, 103, 190, 0.2), transparent 32%),
    radial-gradient(circle, rgba(255, 255, 255, 0.68) 0 1px, transparent 1.5px),
    radial-gradient(circle, rgba(115, 205, 255, 0.45) 0 1px, transparent 1.5px),
    linear-gradient(180deg, #073b79 0%, #092748 24%, #071b35 100%);
  background-position: center, center, 0 0, 43px 67px, center;
  background-size: auto, auto, 112px 112px, 173px 173px, auto;
  overflow: clip;

  &-transition {
    position: relative;
    z-index: 1;
    height: clamp(96px, 14vw, 190px);
    margin-top: -1px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    color: rgba(255, 255, 255, 0.72);
    background: linear-gradient(180deg, #073b79 0%, #092748 58%, transparent 100%);
    font-family: "ProFontWindows", monospace;
    font-size: clamp(12px, 1.2vw, 16px);
    letter-spacing: 0.14em;
    text-transform: uppercase;

    &-line {
      width: 1px;
      height: clamp(20px, 4vw, 48px);
      background: linear-gradient(to bottom, #27d6ff, transparent);
    }
  }

  &-frame {
    position: relative;
    z-index: 1;
    display: block;
    width: 100%;
    border: 0;
    background: transparent;
    pointer-events: auto !important;
    touch-action: pan-x pan-y pinch-zoom;
  }
}

.featured {
  position: relative;
  z-index: 1;
  width: min(calc(100% - 32px), 1200px);
  margin: 0 auto 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  &-title {
    color: var(--color-white-400);
    font-family: "Urbanist", sans-serif;
    font-size: clamp(28px, 3.2vw, 44px);
    font-weight: 900;
  }

  &-list {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }

  &-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 24px;
    border: 1px solid var(--color-beige-700);
    border-radius: 20px;
    background: var(--color-background-400);
    color: var(--color-text-400);
    font-family: "Urbanist", sans-serif;
    text-decoration: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover,
    &:focus-visible {
      transform: translateY(-4px);
      box-shadow: 0 14px 34px rgba(0, 0, 0, 0.3);
    }
  }

  &-metric {
    color: var(--color-orange-400);
    font-size: clamp(30px, 2.8vw, 40px);
    font-weight: 900;
    line-height: 1.05;
  }

  &-detail {
    color: var(--color-text-300);
    font-size: 14px;
  }

  &-name {
    margin-top: 14px;
    font-size: 22px;
    font-weight: 900;
  }

  &-summary {
    color: var(--color-text-300);
    font-size: 15px;
  }

  &-stack {
    margin: 10px 0 14px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    li {
      padding: 4px 10px;
      border-radius: 999px;
      background: var(--color-beige-600);
      font-size: 12px;
      font-weight: 700;
    }
  }

  &-link {
    margin-top: auto;
    color: var(--color-orange-400);
    font-size: 14px;
    font-weight: 700;
  }

  &-all {
    padding: 12px 26px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 999px;
    background: transparent;
    color: var(--color-white-400);
    font-family: "Urbanist", sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease;

    &:hover,
    &:focus-visible {
      border-color: var(--color-orange-400);
      background: var(--color-orange-400);
    }
  }
}

.legacy-tabs {
  position: sticky;
  top: 16px;
  z-index: 20;
  width: min(calc(100% - 32px), 720px);
  margin: 0 auto 24px;
  padding: 4px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 2px;
  border: 1px solid rgba(255, 132, 0, 0.22);
  border-radius: 18px;
  background: rgba(241, 229, 213, 0.92);
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.36);
  backdrop-filter: blur(18px);

  &-button {
    position: relative;
    width: 100%;
    min-height: 52px;
    min-width: 0;
    padding: 14px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    border: 0;
    border-radius: 12px;
    color: var(--color-text-400);
    background: transparent;
    font-family: "Urbanist", sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: capitalize;
    cursor: pointer;
    transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease;

    &:hover,
    &:focus-visible {
      color: var(--color-text-400);
      background: var(--color-beige-700);
    }

    &:active {
      transform: scale(0.97);
    }

    &-active,
    &-active:hover,
    &-active:focus-visible {
      color: var(--color-white-400);
      background: var(--color-orange-400);
      box-shadow: 0 5px 18px rgba(255, 132, 0, 0.25);
    }
  }

  &-dot {
    width: 5px;
    height: 5px;
    flex: 0 0 auto;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.7;
  }
}

@media (max-width: 900px) {
  .featured-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .legacy-tabs {
    top: 8px;
    width: calc(100% - 20px);
    margin-bottom: 14px;
    padding: 5px;
    grid-template-columns: repeat(5, max-content);
    justify-content: flex-start;
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    scrollbar-width: none;
    background: rgba(241, 229, 213, 0.98);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;

    &::-webkit-scrollbar {
      display: none;
    }

    &-button {
      min-height: 48px;
      padding: 12px 16px;
      font-size: 12px;
      scroll-snap-align: center;
    }
  }
}
</style>
