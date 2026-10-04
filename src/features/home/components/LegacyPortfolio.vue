<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { lenis } from "../../../composables/useScroll";

const frame = ref<HTMLIFrameElement | null>(null);
const section = ref<HTMLElement | null>(null);
const frameHeight = ref(600);
const activePage = ref("about");
const emit = defineEmits<{ ready: [] }>();
const legacyUrl = `${import.meta.env.BASE_URL}legacy/index.html`;
const pages = ["about", "resume", "projects", "milestones", "contact"] as const;

let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;
let visibilityObserver: IntersectionObserver | null = null;
let frameDocument: Document | null = null;
let lastTouchY = 0;

const updateHeight = () => {
  const main = frame.value?.contentDocument?.querySelector<HTMLElement>("main");
  if (!main) return;

  const styles = frame.value?.contentWindow?.getComputedStyle(main);
  const marginTop = Number.parseFloat(styles?.marginTop ?? "0") || 0;
  const marginBottom = Number.parseFloat(styles?.marginBottom ?? "0") || 0;
  frameHeight.value = Math.max(Math.ceil(main.getBoundingClientRect().height + marginTop + marginBottom), 320);
};

const scrollToPortfolio = () => {
  if (!section.value) return;
  lenis.value?.scrollTo(section.value, { offset: -16 });
};

const navigateTo = (page: string, shouldScroll = true) => {
  if (!page || !frameDocument) return;

  const button = Array.from(frameDocument.querySelectorAll<HTMLButtonElement>("[data-nav-link]")).find(
    (item) => item.textContent?.trim().toLowerCase() === page.toLowerCase(),
  );

  button?.click();
  activePage.value = page;
  if (shouldScroll) scrollToPortfolio();
  window.setTimeout(updateHeight, 50);
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
  const multiplier = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : 1;
  scrollParentBy(event.deltaY * multiplier, false);
};

const rememberTouch = (event: TouchEvent) => {
  lastTouchY = event.touches[0]?.clientY ?? 0;
  lenis.value?.scrollTo(window.scrollY, { immediate: true, force: true });
};

const relayTouch = (event: TouchEvent) => {
  const currentY = event.touches[0]?.clientY ?? lastTouchY;
  const delta = lastTouchY - currentY;
  if (Math.abs(delta) < 2) return;
  event.preventDefault();
  scrollParentBy(delta, true);
  lastTouchY = currentY;
};

const redirectSocialLink = (event: Event) => {
  const element = event.target instanceof Element ? event.target : null;
  const link = element?.closest<HTMLAnchorElement>("a.social-link");
  if (!link?.href) return;

  event.preventDefault();
  event.stopImmediatePropagation();
  window.location.assign(link.href);
};

const handleFrameLoad = async () => {
  await nextTick();
  frameDocument = frame.value?.contentDocument ?? null;
  if (!frameDocument) return;

  const embeddedStyle = frameDocument.createElement("style");
  embeddedStyle.textContent = `
    .navbar { display: none !important; }
    @media (max-width: 579px) {
      main { padding-inline: 14px !important; }
      article { padding: 20px 16px !important; border-radius: 16px !important; }
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
    attributes: true,
    childList: true,
    subtree: true,
  });

  frameDocument.querySelectorAll("img").forEach((image) => image.addEventListener("load", updateHeight));
  frameDocument.querySelectorAll<HTMLButtonElement>("[data-nav-link]").forEach((button) => {
    button.addEventListener("click", () => {
      activePage.value = button.textContent?.trim().toLowerCase() ?? "about";
      scrollToPortfolio();
      window.setTimeout(updateHeight, 50);
    });
  });

  frameDocument.addEventListener("wheel", relayWheel, { passive: false });
  frameDocument.addEventListener("touchstart", rememberTouch, { passive: true });
  frameDocument.addEventListener("touchmove", relayTouch, { passive: false });
  frameDocument.addEventListener("click", redirectSocialLink, true);

  emit("ready");
};

onMounted(() => {
  window.addEventListener("portfolio:navigate", navigatePortfolio);

  visibilityObserver = new IntersectionObserver(
    ([entry]) => document.body.classList.toggle("legacy-portfolio-visible", entry?.isIntersecting ?? false),
    { rootMargin: "-42% 0px -42% 0px" },
  );

  if (section.value) visibilityObserver.observe(section.value);
});

onBeforeUnmount(() => {
  window.removeEventListener("portfolio:navigate", navigatePortfolio);
  resizeObserver?.disconnect();
  mutationObserver?.disconnect();
  visibilityObserver?.disconnect();
  frameDocument?.removeEventListener("wheel", relayWheel);
  frameDocument?.removeEventListener("touchstart", rememberTouch);
  frameDocument?.removeEventListener("touchmove", relayTouch);
  frameDocument?.removeEventListener("click", redirectSocialLink, true);
  document.body.classList.remove("legacy-portfolio-visible");
});
</script>

<template>
  <section ref="section" class="legacy-portfolio" aria-label="Dhyan S Agni portfolio">
    <div class="legacy-portfolio-transition" aria-hidden="true">
      <span>Explore my work</span>
      <span class="legacy-portfolio-transition-line"></span>
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
  background: #121212;
  overflow: clip;

  &-transition {
    height: clamp(96px, 14vw, 190px);
    margin-top: -1px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    color: rgba(255, 255, 255, 0.72);
    background: linear-gradient(180deg, #073b79 0%, #092748 38%, #121212 100%);
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
    display: block;
    width: 100%;
    border: 0;
    background: #121212;
    pointer-events: auto !important;
    touch-action: pan-y;
  }
}

.legacy-tabs {
  position: sticky;
  top: 16px;
  z-index: 20;
  width: min(calc(100% - 32px), 720px);
  margin: -22px auto 24px;
  padding: 6px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 4px;
  border: 1px solid rgba(255, 219, 112, 0.22);
  border-radius: 18px;
  background: rgba(31, 31, 34, 0.86);
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.36);
  backdrop-filter: blur(18px);

  &-button {
    min-width: 0;
    padding: 12px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    border: 0;
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.62);
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
      color: #fff;
      background: rgba(255, 255, 255, 0.07);
    }

    &:active {
      transform: scale(0.97);
    }

    &-active {
      color: #1d1d20;
      background: linear-gradient(135deg, #ffe38a, #ffbd5c);
      box-shadow: 0 5px 18px rgba(255, 193, 92, 0.2);
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

    &::-webkit-scrollbar {
      display: none;
    }

    &-button {
      padding: 10px 13px;
      font-size: 12px;
      scroll-snap-align: center;
    }
  }
}
</style>
