<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { lenis } from "../../../../composables/useScroll";
import { featuredProjects } from "../../../../content/portfolio";
import SkyField from "../SkyField.vue";
import PortfolioAbout from "./PortfolioAbout.vue";
import PortfolioResume from "./PortfolioResume.vue";
import PortfolioProjects from "./PortfolioProjects.vue";
import PortfolioMilestones from "./PortfolioMilestones.vue";
import PortfolioContact from "./PortfolioContact.vue";

const pages = [
  { id: "about", label: "About", title: "About me", component: PortfolioAbout },
  { id: "resume", label: "Resume", title: "Resume", component: PortfolioResume },
  { id: "projects", label: "Projects", title: "Projects", component: PortfolioProjects },
  { id: "milestones", label: "Milestones", title: "Milestones", component: PortfolioMilestones },
  { id: "contact", label: "Contact", title: "Contact", component: PortfolioContact },
] as const;

type PageId = (typeof pages)[number]["id"];

const section = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const activePage = ref<PageId>("about");
const currentPage = computed(() => pages.find((page) => page.id === activePage.value) ?? pages[0]);
const emit = defineEmits<{ ready: []; visibility: [visible: boolean] }>();

let visibilityObserver: IntersectionObserver | null = null;
let revealObserver: IntersectionObserver | null = null;

const isPageId = (value: string): value is PageId => pages.some((page) => page.id === value);

const scrollToPanel = () => {
  const target = panel.value;
  if (!target) return;

  const offset = -88;
  const instance = lenis.value;

  if (instance) {
    instance.resize();
    instance.scrollTo(target, { offset, immediate: true, force: true });
    return;
  }

  window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top + offset, left: 0, behavior: "auto" });
};

const navigateTo = async (page: string, shouldScroll = true) => {
  if (!isPageId(page)) return;
  activePage.value = page;

  // The new panel can be much shorter than the previous one. Let Vue render it
  // before Lenis recalculates its limit, otherwise it can keep a stale target.
  await nextTick();
  lenis.value?.resize();

  if (shouldScroll) scrollToPanel();
};

const navigatePortfolio = (event: Event) => navigateTo((event as CustomEvent<string>).detail);

onMounted(() => {
  window.addEventListener("portfolio:navigate", navigatePortfolio);

  visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      const isVisible = entry?.isIntersecting ?? false;
      document.body.classList.toggle("portfolio-visible", isVisible);
      emit("visibility", isVisible);
    },
    { rootMargin: "-42% 0px -42% 0px" },
  );

  if (section.value) visibilityObserver.observe(section.value);

  // Featured cards fade up once as they enter the viewport.
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        revealObserver?.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  section.value?.querySelectorAll("[data-reveal]").forEach((element) => revealObserver?.observe(element));

  emit("ready");
});

onBeforeUnmount(() => {
  window.removeEventListener("portfolio:navigate", navigatePortfolio);
  visibilityObserver?.disconnect();
  revealObserver?.disconnect();
  document.body.classList.remove("portfolio-visible");
});
</script>

<template>
  <section ref="section" class="portfolio" aria-label="Dhyan S Agni portfolio">
    <SkyField />
    <div class="portfolio-transition" aria-hidden="true">
      <span>Explore my work</span>
      <span class="portfolio-transition-line"></span>
    </div>

    <div class="featured">
      <p class="featured-eyebrow" data-reveal>Selected projects</p>
      <h2 class="featured-title" data-reveal>Featured <span>work</span></h2>
      <ul class="featured-list">
        <li
          v-for="(project, index) in featuredProjects"
          :key="project.title"
          data-reveal
          :style="{ '--reveal-delay': `${index * 90}ms` }"
        >
          <a
            class="featured-card"
            :href="project.url"
            target="_blank"
            rel="noopener"
            data-cursor="circle-black"
            data-hoversound="hover"
          >
            <span class="featured-metric">{{ project.metric }}</span>
            <h3 class="featured-name">{{ project.title }}</h3>
            <p class="featured-description">{{ project.description }}</p>
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

    <nav class="portfolio-tabs" aria-label="Portfolio sections" data-cursor="circle-black">
      <button
        v-for="page in pages"
        :key="page.id"
        type="button"
        class="portfolio-tabs-button"
        :class="{ 'portfolio-tabs-button-active': activePage === page.id }"
        :aria-current="activePage === page.id ? 'page' : undefined"
        data-hoversound="hover"
        @click="navigateTo(page.id)"
      >
        <span class="portfolio-tabs-dot"></span>
        {{ page.label }}
      </button>
    </nav>

    <article ref="panel" class="portfolio-panel" data-cursor="circle-black">
      <div :key="activePage" class="portfolio-panel-page">
        <h2 class="portfolio-panel-title">{{ currentPage.title }}</h2>
        <component :is="currentPage.component" />
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
.portfolio {
  position: relative;
  z-index: 5;
  width: 100%;
  padding-bottom: 120px;
  background-color: var(--color-sky-900);
  background-image:
    radial-gradient(60% 40% at 12% 8%, rgba(5, 147, 198, 0.35), transparent 70%),
    radial-gradient(50% 35% at 90% 38%, rgba(216, 57, 149, 0.22), transparent 70%),
    radial-gradient(55% 40% at 15% 78%, rgba(216, 57, 149, 0.14), transparent 70%),
    linear-gradient(180deg, var(--color-sky-700) 0%, var(--color-sky-800) 22%, var(--color-sky-900) 100%);
  overflow: clip;

  &-transition {
    position: relative;
    z-index: 1;
    height: clamp(110px, 14vw, 190px);
    margin-top: -1px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    color: rgba(252, 255, 255, 0.75);
    background: linear-gradient(180deg, var(--color-sky-700) 0%, rgba(3, 78, 107, 0) 100%);
    font-family: "ProFontWindows", monospace;
    font-size: clamp(12px, 1.2vw, 16px);
    letter-spacing: 0.14em;
    text-transform: uppercase;

    &-line {
      width: 2px;
      height: clamp(24px, 4vw, 52px);
      border-radius: 2px;
      background: linear-gradient(to bottom, var(--color-sky-300), var(--color-pink-500), transparent);
      animation: portfolio-line 2.4s var(--ease-smooth) infinite;
      transform-origin: top;
    }
  }

  &-tabs {
    position: sticky;
    top: 16px;
    z-index: 20;
    width: min(calc(100% - 32px), 720px);
    margin: 0 auto 28px;
    padding: 5px;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 2px;
    border: 1px solid rgba(252, 255, 255, 0.6);
    border-radius: 999px;
    background: rgba(252, 255, 255, 0.94);
    box-shadow:
      0 18px 50px rgba(2, 37, 52, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(18px) saturate(1.4);
    -webkit-backdrop-filter: blur(18px) saturate(1.4);

    &-button {
      position: relative;
      width: 100%;
      min-height: 48px;
      min-width: 0;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      border: 0;
      border-radius: 999px;
      color: var(--color-text-400);
      background: transparent;
      font-family: "Urbanist", sans-serif;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition:
        color 0.3s var(--ease-power2-out),
        background 0.3s var(--ease-power2-out),
        box-shadow 0.3s var(--ease-power2-out),
        transform 0.2s var(--ease-power2-out);

      &:hover,
      &:focus-visible {
        color: var(--color-sky-600);
        background: var(--color-sky-100);
      }

      &:active {
        transform: scale(0.97);
      }

      &-active,
      &-active:hover,
      &-active:focus-visible {
        color: var(--color-white-400);
        background: var(--gradient-brand);
        box-shadow: 0 6px 20px rgba(216, 57, 149, 0.35);
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

  &-panel {
    position: relative;
    z-index: 1;
    width: min(calc(100% - 32px), 1000px);
    // Short tabs (Milestones, Contact) would otherwise end the page before
    // the panel can scroll up under the sticky tab bar.
    min-height: calc(var(--lvh) * 100 - 120px);
    margin: 0 auto;
    padding: clamp(24px, 4vw, 52px);
    border: 1px solid rgba(252, 255, 255, 0.7);
    border-radius: 28px;
    background: linear-gradient(180deg, var(--color-white-400) 0%, var(--color-sky-50) 100%);
    color: var(--color-text-400);
    font-family: "Urbanist", sans-serif;
    box-shadow:
      0 30px 80px rgba(2, 37, 52, 0.45),
      0 0 0 6px rgba(252, 255, 255, 0.06);

    &-page {
      animation: portfolio-page-in 0.55s var(--ease-power2-out) both;
    }

    &-title {
      position: relative;
      margin-bottom: 32px;
      padding-bottom: 16px;
      font-size: clamp(30px, 3.4vw, 44px);
      font-weight: 900;
      line-height: 1.1;

      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 56px;
        height: 5px;
        border-radius: 3px;
        background: var(--gradient-brand);
      }
    }
  }
}

.featured {
  position: relative;
  z-index: 1;
  width: min(calc(100% - 32px), 1200px);
  margin: 0 auto 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  &-eyebrow {
    margin-bottom: -14px;
    color: var(--color-sky-300);
    font-family: "ProFontWindows", monospace;
    font-size: 14px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  &-title {
    color: var(--color-white-400);
    font-family: "Urbanist", sans-serif;
    font-size: clamp(32px, 3.6vw, 52px);
    font-weight: 900;

    span {
      background: linear-gradient(120deg, var(--color-sky-300), var(--color-pink-400));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  }

  &-list {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }

  &-card {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 26px;
    border: 1px solid rgba(127, 203, 230, 0.22);
    border-radius: 24px;
    // Solid so the 3D models behind never show through the text.
    background: linear-gradient(160deg, #06506C 0%, #043A52 100%);
    color: var(--color-white-400);
    font-family: "Urbanist", sans-serif;
    text-decoration: none;
    box-shadow: 0 20px 50px rgba(2, 37, 52, 0.45);
    overflow: hidden;
    transition:
      transform 0.45s var(--ease-power2-out),
      border-color 0.45s var(--ease-power2-out),
      box-shadow 0.45s var(--ease-power2-out);

    // Gradient hairline along the top edge, brightened on hover.
    &::before {
      content: "";
      position: absolute;
      inset: 0 0 auto;
      height: 2px;
      background: var(--gradient-brand);
      opacity: 0.6;
      transition: opacity 0.45s var(--ease-power2-out);
    }

    &:hover,
    &:focus-visible {
      transform: translateY(-6px);
      border-color: rgba(238, 157, 203, 0.5);
      box-shadow: 0 24px 60px rgba(216, 57, 149, 0.22);

      &::before {
        opacity: 1;
      }
    }
  }

  &-metric {
    background: linear-gradient(120deg, var(--color-sky-300), var(--color-pink-400));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-size: clamp(30px, 2.8vw, 42px);
    font-weight: 900;
    line-height: 1.1;
  }

  &-name {
    margin-top: 6px;
    font-size: 22px;
    font-weight: 900;
  }

  &-description {
    margin-top: 4px;
    color: rgba(226, 243, 250, 0.9);
    font-size: 15px;
    line-height: 1.6;
  }

  &-stack {
    margin: 12px 0 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    li {
      padding: 4px 11px;
      border: 1px solid rgba(127, 203, 230, 0.3);
      border-radius: 999px;
      background: rgba(5, 147, 198, 0.16);
      color: var(--color-sky-100);
      font-size: 12px;
      font-weight: 700;
    }
  }

  &-link {
    margin-top: auto;
    color: var(--color-pink-300);
    font-size: 14px;
    font-weight: 700;
    transition: color 0.3s ease;
  }

  &-card:hover &-link {
    color: var(--color-white-400);
  }

  &-all {
    padding: 13px 28px;
    border: 1px solid rgba(252, 255, 255, 0.35);
    border-radius: 999px;
    background: rgba(252, 255, 255, 0.04);
    color: var(--color-white-400);
    font-family: "Urbanist", sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition:
      background 0.35s var(--ease-power2-out),
      border-color 0.35s var(--ease-power2-out),
      box-shadow 0.35s var(--ease-power2-out),
      transform 0.2s var(--ease-power2-out);

    &:hover,
    &:focus-visible {
      border-color: transparent;
      background: var(--gradient-brand);
      box-shadow: 0 10px 30px rgba(216, 57, 149, 0.35);
    }

    &:active {
      transform: scale(0.97);
    }
  }
}

[data-reveal] {
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 0.8s var(--ease-power2-out) var(--reveal-delay, 0ms),
    transform 0.8s var(--ease-power2-out) var(--reveal-delay, 0ms);

  &.is-revealed {
    opacity: 1;
    transform: none;
  }
}

@keyframes portfolio-page-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes portfolio-line {
  0% {
    transform: scaleY(0);
    opacity: 0;
  }
  40% {
    transform: scaleY(1);
    opacity: 1;
  }
  100% {
    transform: scaleY(1);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-reveal] {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .portfolio-panel-page,
  .portfolio-transition-line {
    animation: none;
  }
}

@media (max-width: 760px) {
  .featured-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .portfolio-tabs {
    top: 8px;
    width: calc(100% - 20px);
    margin-bottom: 14px;
    padding: 4px;
    gap: 0;
    border-radius: 18px;
    background: rgba(252, 255, 255, 0.96);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;

    &-button {
      min-height: 44px;
      padding: 10px 2px;
      border-radius: 14px;
      font-size: clamp(10.5px, 3vw, 12px);
      letter-spacing: 0;
    }

    &-dot {
      display: none;
    }
  }

  .portfolio-panel {
    width: calc(100% - 20px);
    border-radius: 20px;
  }
}
</style>
