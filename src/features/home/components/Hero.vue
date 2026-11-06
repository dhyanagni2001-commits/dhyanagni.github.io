<script setup lang="ts">
import { computed } from "vue";
import Banner from "../../../components/Banner.vue";
import Button from "../../../components/Button.vue";
import { preloaderVisible } from "../../../composables/usePreloader";
import { t } from "../../../i18n/utils/translate";

// Wraps between phrases rather than inside one ("Graduating / May 2027").
const statusParts = computed(() => t("hero-status").split(" · "));

const navigatePortfolio = (page: string) => {
  window.dispatchEvent(new CustomEvent("portfolio:navigate", { detail: page }));
};
</script>

<template>
  <div class="hero">
    <div class="hero-content grid">
      <div class="hero-content-inner" id="hero-content-inner">
        <div class="hero-content-copys">
          <h1 class="hero-title"><span>Dhyan S. Agni</span></h1>
          <div class="hero-role">
            <Banner :copy="t('job-title')" size="sm" v-if="!preloaderVisible" animated />
          </div>
          <p class="hero-intro">{{ t("hero-intro") }}</p>
          <p class="hero-status">
            <span v-for="part in statusParts" :key="part">{{ part }}</span>
          </p>
        </div>
        <div class="hero-actions">
          <Button
            class="hero-action"
            variant="accent"
            data-cursor="circle-white"
            data-sound="click"
            data-hoversound="hover"
            @click="navigatePortfolio('contact')"
            >{{ t("get-in-touch") }}</Button
          >
          <Button
            class="hero-action"
            variant="secondary"
            data-cursor="circle-black"
            data-sound="click"
            data-hoversound="hover"
            @click="navigatePortfolio('projects')"
            >{{ t("projects") }}</Button
          >
          <Button
            class="hero-action"
            variant="secondary"
            data-cursor="circle-black"
            data-sound="click"
            data-hoversound="hover"
            @click="navigatePortfolio('resume')"
            >{{ t("resume") }}</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hero {
  max-height: calc(var(--lvh) * 100);
  height: calc(var(--lvh) * 100);
  width: 100%;
  display: flex;
  position: relative;
  overflow: hidden;

  &-content {
    align-items: center;
    justify-content: center;
    height: 46%;
    padding-top: var(--height-header);

    @include mixins.landscape {
      height: 100%;
      padding-top: 0;

      @include mixins.mq("md") {
        padding-bottom: 8%;
      }

      @include mixins.mq("lg") {
        padding-bottom: 5%;
      }
    }

    &-inner {
      transform-origin: center center;
      grid-column: 1 / 13;
      gap: var(--space-md);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      width: min(calc(100% - var(--space-outer) * 2), 560px);
      position: relative;
      left: 50%;
      transform: translateX(-50%);

      @include mixins.mq("md") {
        gap: var(--space-lg);
      }

      @include mixins.landscape {
        left: 0;
        transform: translateX(0);
        grid-column: 2 / 13;
        width: min(100%, 38vw);
        min-width: 340px;
      }
    }

    &-copys {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-xs);

      @include mixins.mq("md") {
        gap: var(--space-sm);
      }
    }
  }

  &-title {
    display: flex;
    flex-direction: column;
    color: var(--text-dark);
    font-size: clamp(36px, 12.5vw, var(--font-size-title-xl));
    line-height: 1;

    span {
      white-space: nowrap;
    }

    @include mixins.landscape {
      font-size: var(--font-size-title-md);
    }

    @include mixins.landscape-large {
      font-size: clamp(var(--font-size-title-md), 5.2vw, var(--font-size-title-xxl));
    }
  }

  // Reserves the label's height so the group doesn't shift when it animates in.
  &-role {
    min-height: 28px;

    :deep(.banner-copy) {
      font-size: var(--font-size-md);
      letter-spacing: 0.03em;
      line-height: 1.2;
      white-space: nowrap;
    }

    :deep(.banner) {
      padding: 3px var(--space-xs);
    }
  }

  &-intro {
    margin-top: var(--space-xxs);
    text-wrap: pretty;
    color: var(--text-muted);
    font-size: var(--type-body);
    line-height: 1.5;

    @include mixins.mq("md") {
      font-size: var(--font-size-lg);
    }
  }

  &-status {
    color: var(--text-dark);
    font-size: var(--type-small);
    font-weight: 700;
    line-height: 1.5;
    // Each phrase carries its separator on the left. The negative margin and
    // clip hide the one that lands at the start of a line, so a wrapped line
    // neither starts nor ends on a stray dot.
    display: flex;
    flex-wrap: wrap;
    margin-left: -16px;
    clip-path: inset(0 0 0 16px);

    span {
      position: relative;
      padding-left: 16px;
      white-space: nowrap;

      &::before {
        content: "·";
        position: absolute;
        left: 6px;
      }
    }

    @include mixins.mq("md") {
      font-size: 15px;
    }
  }

  &-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);

    @include mixins.mq("md") {
      gap: var(--space-sm);
    }
  }

  &-actions &-action {
    padding: 0 18px;

    @include mixins.mq("xl") {
      padding: 0 24px;
    }
  }
}

@media (max-width: 380px) {
  .hero-actions .hero-action {
    padding: 0 14px;
  }
}

// Short screens: small phones in portrait, any phone in landscape. Keep the
// name, role, status line and actions, and let the sentence go.
@media (orientation: portrait) and (max-height: 700px), (orientation: landscape) and (max-height: 480px) {
  .hero-intro {
    display: none;
  }
}

@media (orientation: landscape) and (max-height: 480px) {
  .hero-content {
    padding-top: var(--height-header);
    padding-bottom: 0;
  }

  .hero-content-inner {
    gap: var(--space-sm);
    min-width: 360px;
  }

  .hero-actions .hero-action {
    padding: 0 14px;
  }

  .hero-title {
    font-size: var(--font-size-title-sm);
  }
}
</style>
