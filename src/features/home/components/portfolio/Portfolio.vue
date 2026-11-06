<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { lenis } from "../../../../composables/useScroll";
import { featuredProjects } from "../../../../content/portfolio";
import Button from "../../../../components/Button.vue";
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
      <h2 class="featured-title" data-reveal>Featured work</h2>
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
            data-cursor="circle-white"
            data-hoversound="hover"
          >
            <h3 class="featured-name">{{ project.title }}</h3>
            <p class="featured-description">{{ project.purpose }}</p>
            <div class="featured-result">
              <span class="featured-metric">{{ project.metric }}</span>
              <p class="featured-result-text">{{ project.result }}</p>
            </div>
            <ul class="featured-stack">
              <li v-for="tech in project.stack" :key="tech">{{ tech }}</li>
            </ul>
            <span class="featured-link">View on GitHub →</span>
          </a>
        </li>
      </ul>
      <Button
        class="featured-all"
        variant="secondary-dark"
        data-cursor="circle-white"
        data-hoversound="hover"
        @click="navigateTo('projects')"
      >
        See all projects →
      </Button>
    </div>

    <nav class="portfolio-tabs nav-pill nav-pill-dark" aria-label="Portfolio sections" data-cursor="circle-white">
      <button
        v-for="page in pages"
        :key="page.id"
        type="button"
        class="portfolio-tabs-button nav-pill-item"
        :class="{ 'nav-pill-item-on': activePage === page.id }"
        :aria-current="activePage === page.id ? 'page' : undefined"
        data-hoversound="hover"
        @click="navigateTo(page.id)"
      >
        {{ page.label }}
      </button>
    </nav>

    <article
      ref="panel"
      class="portfolio-panel"
      :class="{ 'portfolio-panel-narrow': activePage === 'about' }"
      data-cursor="circle-black"
    >
      <div :key="activePage" class="portfolio-panel-page">
        <h2 class="portfolio-panel-title">{{ currentPage.title }}</h2>
        <component :is="currentPage.component" />
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
.portfolio {
  --focus-ring: var(--cyan);

  position: relative;
  z-index: 5;
  width: 100%;
  padding-bottom: 120px;
  background-color: var(--navy);
  // Only clip sideways: the fade below hangs above the section's top edge.
  overflow-x: clip;

  // Dissolves the 3D lab into the section instead of ending it on a hard line.
  &::before {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 0;
    width: 100%;
    height: clamp(40px, 4.5vw, 64px);
    background: linear-gradient(to bottom, rgba(8, 38, 58, 0), var(--navy));
    pointer-events: none;
  }

  &-transition {
    position: relative;
    z-index: 1;
    height: clamp(96px, 12vw, 160px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    color: var(--text-light-muted);
    font-family: var(--font-mono);
    font-size: var(--type-label);
    letter-spacing: 0.14em;
    text-transform: uppercase;

    &-line {
      width: 1px;
      height: clamp(24px, 3vw, 40px);
      background: linear-gradient(to bottom, var(--cyan), transparent);
      animation: portfolio-line 2.4s var(--ease-smooth) infinite;
      transform-origin: top;
    }
  }

  &-tabs {
    position: sticky;
    top: 16px;
    z-index: 20;
    width: min(calc(100% - 32px), 720px);
    margin: 0 auto 24px;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    box-shadow: 0 4px 12px rgba(4, 20, 31, 0.3);

    &-button {
      width: 100%;
      min-width: 0;
      padding: 0 8px;

      &.nav-pill-item-on {
        background-color: var(--nav-active-bg);
      }
    }
  }

  &-panel {
    --focus-ring: var(--cyan-dark);

    position: relative;
    z-index: 1;
    width: min(calc(100% - 32px), 1000px);
    // Short tabs (Milestones, Contact) would otherwise end the page before
    // the panel can scroll up under the sticky tab bar.
    min-height: calc(var(--lvh) * 100 - 120px);
    margin: 0 auto;
    padding: clamp(24px, 4vw, 48px);
    border-radius: var(--radius-lg);
    background-color: var(--ice-blue);
    color: var(--text-dark);
    font-family: var(--font-sans);
    box-shadow: 0 24px 60px rgba(4, 20, 31, 0.4);

    // Long-form copy reads better at a line length grids don't need.
    &-narrow {
      width: min(calc(100% - 32px), 820px);
    }

    &-page {
      animation: portfolio-page-in 0.55s var(--ease-power2-out) both;
    }

    &-title {
      margin-bottom: 28px;
      color: var(--text-dark);
      font-size: var(--type-h2);
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
    margin-bottom: -16px;
    color: var(--cyan);
    font-family: var(--font-mono);
    font-size: var(--type-label);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  &-title {
    color: var(--text-light);
    font-family: var(--font-sans);
    font-size: var(--type-h2);
  }

  &-list {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;

    > li {
      min-width: 0;
    }
  }

  &-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 24px;
    border: 1px solid var(--border-dark);
    border-radius: var(--radius-lg);
    // Opaque so the dot field behind never shows through the text.
    background-color: var(--teal-navy);
    color: var(--text-light);
    font-family: var(--font-sans);
    text-decoration: none;
    transition:
      transform 0.3s var(--ease-power2-out),
      border-color 0.3s var(--ease-power2-out),
      background-color 0.3s var(--ease-power2-out);

    &:focus-visible {
      background-color: var(--raised-teal);
    }

    @include mixins.hover {
      &:hover {
        transform: translateY(-3px);
        border-color: var(--cyan);
        background-color: var(--raised-teal);
      }
    }
  }

  &-name {
    font-size: var(--type-h3);
  }

  &-description {
    margin-top: 8px;
    color: var(--text-light-muted);
    font-size: var(--type-body);
    line-height: var(--line-height-body);
  }

  &-result {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border-dark);

    &-text {
      margin-top: 4px;
      color: var(--text-light-muted);
      font-size: 15px;
      line-height: var(--line-height-body);
    }
  }

  &-metric {
    color: var(--cyan);
    font-size: 28px;
    font-weight: 700;
    line-height: 1.2;
  }

  &-stack {
    margin: 16px 0 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    li {
      padding: 3px 10px;
      border: 1px solid var(--border-dark);
      border-radius: 999px;
      color: var(--text-light);
      font-family: var(--font-mono);
      font-size: var(--type-label);
    }
  }

  &-link {
    margin-top: auto;
    color: var(--cyan);
    font-size: var(--type-small);
    font-weight: 700;
    text-underline-offset: 3px;
    transition: color 0.2s ease;
  }

  &-card:focus-visible &-link {
    color: var(--text-light);
    text-decoration: underline;
  }

  @include mixins.hover {
    &-card:hover &-link {
      color: var(--text-light);
      text-decoration: underline;
    }
  }

  &-all {
    height: 44px;
    padding: 0 24px;
  }
}

[data-reveal] {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.7s var(--ease-power2-out) var(--reveal-delay, 0ms),
    transform 0.7s var(--ease-power2-out) var(--reveal-delay, 0ms);

  &.is-revealed {
    opacity: 1;
    transform: none;
  }
}

@keyframes portfolio-page-in {
  from {
    opacity: 0;
    transform: translateY(10px);
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

// Cards in a row share row tracks, so dividers, tags and links line up however
// long each description runs.
@supports (grid-template-rows: subgrid) {
  .featured-list {
    row-gap: 0;

    > li {
      display: grid;
      grid-row: span 5;
      grid-template-rows: subgrid;
      padding-bottom: 20px;
    }
  }

  .featured-card {
    display: grid;
    grid-row: span 5;
    grid-template-rows: subgrid;
    height: auto;
  }
}

@media (max-width: 1000px) {
  .featured-list {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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

    &-button {
      min-height: 44px;
      padding: 0 2px;
      font-size: clamp(11.5px, 3.2vw, 13px);
      letter-spacing: 0;
    }
  }

  .portfolio-panel {
    width: calc(100% - 20px);
  }
}
</style>
