<script setup lang="ts">
import HeaderLink from "./HeaderLink.vue";
import { onMounted, ref } from "vue";
import { t } from "../i18n/utils/translate";
import { lenis } from "../composables/useScroll";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeaderTheme } from "../composables/useHeaderTheme";
import { projectId } from "../composables/useRouteObserver";

type ActiveLink = "about" | "projects" | "resume";
const activeLink = ref<ActiveLink | null>(null);
const sections: ActiveLink[] = ["about", "projects", "resume"];

const handleLinkClick = (section: ActiveLink) => {
  if (section === "about") {
    lenis.value?.scrollTo("#about");
    return;
  }

  activeLink.value = section;
  updateBarPosition();
  window.dispatchEvent(new CustomEvent("portfolio:navigate", { detail: section }));
};
const ariaLabels = {
  about: t("about"),
  projects: t("projects"),
  resume: t("resume"),
};

const isMounted = ref(false);

const barStyle = ref({ transform: "" });
const ITEM_WIDTH = 128;

const { isDarkTheme, hasScrolledIntoView } = useHeaderTheme();

const updateBarPosition = () => {
  const index = sections.indexOf(activeLink.value as ActiveLink);
  const left = index * ITEM_WIDTH;
  barStyle.value = {
    transform: `translateX(${left}px)`,
  };
};

onMounted(() => {
  sections.forEach((section) => {
    const trigger = document.querySelector(`#${section}`);
    if (!trigger) return;

    ScrollTrigger.create({
      trigger,
      start: section === "about" ? "top 22.5%" : "top center",
      end: "bottom center",
      onEnter: () => {
        activeLink.value = section;
        updateBarPosition();
      },
      onEnterBack: () => {
        activeLink.value = section;
        updateBarPosition();
      },
      onLeave: () => (activeLink.value = null),
      onLeaveBack: () => (activeLink.value = null),
    });
  });

  ScrollTrigger.refresh();

  isMounted.value = true;
});
</script>

<template>
  <div :class="['header-home', { 'header-home-mounted': isMounted, 'header-home-isProjectPage': projectId !== null }]">
    <div :class="['header-home-links', 'nav-pill', { 'nav-pill-dark': isDarkTheme }]">
      <div
        :class="[
          'header-home-bar',
          { 'header-home-bar-active': activeLink !== null && hasScrolledIntoView },
        ]"
        :style="barStyle"
      ></div>
      <HeaderLink
        v-for="section in sections"
        :key="section"
        :is-active="activeLink === section && hasScrolledIntoView"
        class="children-unclickable"
        @click="handleLinkClick(section)"
        :is-dark-theme="isDarkTheme"
        :aria-label="ariaLabels[section]"
        data-sound="click"
        data-hoversound="hover"
      >
        {{ t(section) }}
      </HeaderLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-home {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-index-header-home);
  height: var(--height-header);
  align-items: center;
  justify-content: center;
  display: none;
  opacity: 0;
  transition:
    opacity 0.3s ease-in-out,
    transform var(--transition-route-duration) var(--transition-route-ease);

  &-isProjectPage {
    transform: translateX(-50%) translateY(-100%);
  }

  &-mounted {
    opacity: 1;
  }

  @include mixins.mq("lg") {
    display: flex;
  }

  &-bar {
    position: absolute;
    top: 4px;
    left: 4px;
    height: calc(100% - 8px);
    width: 128px;
    background-color: var(--nav-active-bg);
    border-radius: 100px;
    transition:
      transform 0.3s var(--ease-smooth),
      opacity 0.1s ease-in-out,
      background-color 0.2s ease-in-out;
    z-index: 1;
    opacity: 0;

    &-active {
      opacity: 1;
    }
  }
}
</style>
