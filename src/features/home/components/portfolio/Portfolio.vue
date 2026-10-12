<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { lenis } from "../../../../composables/useScroll";
import { featuredProjects } from "../../../../content/portfolio";
import RocketField from "../RocketField.vue";
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

  emit("ready");
});

onBeforeUnmount(() => {
  window.removeEventListener("portfolio:navigate", navigatePortfolio);
  visibilityObserver?.disconnect();
  document.body.classList.remove("portfolio-visible");
});
</script>

<template>
  <section ref="section" class="portfolio" aria-label="Dhyan S Agni portfolio">
    <RocketField />
    <div class="portfolio-transition" aria-hidden="true">
      <span>Explore my work</span>
      <span class="portfolio-transition-line"></span>
    </div>

    <div class="featured">
      <h2 class="featured-title">Featured work</h2>
      <ul class="featured-list">
        <li v-for="project in featuredProjects" :key="project.title">
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
      <h2 class="portfolio-panel-title">{{ currentPage.title }}</h2>
      <component :is="currentPage.component" />
    </article>
  </section>
</template>

<style scoped lang="scss">
.portfolio {
  position: relative;
  z-index: 5;
  width: 100%;
  padding-bottom: 96px;
  background-color: #071b35;
  background-image:
    radial-gradient(circle at 18% 15%, rgba(39, 214, 255, 0.14), transparent 25%),
    radial-gradient(circle at 82% 48%, rgba(48, 103, 190, 0.2), transparent 32%),
    radial-gradient(circle, rgba(255, 255, 255, 0.68) 0 1px, transparent 1.5px),
    radial-gradient(circle, rgba(115, 205, 255, 0.45) 0 1px, transparent 1.5px),
    linear-gradient(180deg, #073b79 0%, #092748 24%, #071b35 100%);
  background-position:
    center,
    center,
    0 0,
    43px 67px,
    center;
  background-size:
    auto,
    auto,
    112px 112px,
    173px 173px,
    auto;
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

  &-tabs {
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
      cursor: pointer;
      transition:
        color 0.2s ease,
        background 0.2s ease,
        transform 0.2s ease;

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

  &-panel {
    position: relative;
    z-index: 1;
    width: min(calc(100% - 32px), 1000px);
    // Short tabs (Milestones, Contact) would otherwise end the page before
    // the panel can scroll up under the sticky tab bar.
    min-height: calc(var(--lvh) * 100 - 120px);
    margin: 0 auto;
    padding: clamp(24px, 4vw, 48px);
    border: 1px solid var(--color-beige-700);
    border-radius: 24px;
    background: var(--color-background-400);
    color: var(--color-text-400);
    font-family: "Urbanist", sans-serif;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);

    &-title {
      position: relative;
      margin-bottom: 32px;
      padding-bottom: 14px;
      font-size: clamp(30px, 3.4vw, 44px);
      font-weight: 900;
      line-height: 1.1;

      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 40px;
        height: 5px;
        border-radius: 3px;
        background: var(--color-orange-400);
      }
    }
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
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;

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

  &-name {
    margin-top: 6px;
    font-size: 22px;
    font-weight: 900;
  }

  &-description {
    margin-top: 4px;
    color: var(--color-text-300);
    font-size: 15px;
    line-height: 1.55;
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
    transition:
      background 0.2s ease,
      border-color 0.2s ease;

    &:hover,
    &:focus-visible {
      border-color: var(--color-orange-400);
      background: var(--color-orange-400);
    }
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
    padding: 5px;
    gap: 0;
    background: rgba(241, 229, 213, 0.98);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;

    &-button {
      min-height: 44px;
      padding: 10px 2px;
      font-size: clamp(10.5px, 3vw, 12px);
      letter-spacing: 0;
    }

    &-dot {
      display: none;
    }
  }

  .portfolio-panel {
    width: calc(100% - 20px);
    border-radius: 18px;
  }
}
</style>
