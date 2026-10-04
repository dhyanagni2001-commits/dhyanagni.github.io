<script setup>
import Banner from "../../../components/Banner.vue";
import { preloaderVisible } from "../../../composables/usePreloader";
import { t } from "../../../i18n/utils/translate";
</script>

<template>
  <div class="hero">
    <div class="hero-content grid">
      <div class="hero-content-inner" id="hero-content-inner">
        <div class="hero-content-copys">
          <h1 class="hero-title"><span>Dhyan S. Agni</span></h1>
          <Banner class="hero-banner" :copy="t('job-title')" v-if="!preloaderVisible" animated />
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

    @include mixins.landscape {
      height: 100%;

      @include mixins.mq("md") {
        padding-bottom: 30%;
      }

      @include mixins.mq("lg") {
        padding-bottom: 5%;
      }
    }

    &-inner {
      transform-origin: center center;
      grid-column: 1 / 13;
      gap: var(--space-xxl);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: fit-content;
      position: relative;
      left: 50%;
      transform: translateX(-50%);

      @include mixins.landscape {
        left: 0;
        transform: translateX(0);
        grid-column: 2 / 13;
        width: fit-content;
      }
    }

    &-copys {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);

      @include mixins.mq("md") {
        gap: var(--space-md);
      }
    }

    &-button {
      width: fit-content;
    }
  }

  &-title {
    display: flex;
    flex-direction: column;
    font-weight: 900;
    letter-spacing: 0.02em;
    font-size: clamp(36px, 12.5vw, var(--font-size-title-xl));
    line-height: 0.92;

    span {
      white-space: nowrap;
    }

    @include mixins.landscape {
      font-size: var(--font-size-title-lg);
      line-height: var(--line-height-title);
    }

    @include mixins.landscape-large {
      @include mixins.mq("sm") {
        font-size: var(--font-size-title-xl);
      }

      @include mixins.mq("xl") {
        font-size: var(--font-size-title-xxl);
      }
    }
  }

  &-banner {
    position: absolute;
    bottom: -6px;
    left: 4px;
    z-index: 10;
    max-width: calc(100vw - 40px);
    transform: translate(0, 70%);

    :deep(.banner-copy) {
      font-size: clamp(13px, 3.7vw, 17px);
      line-height: 1.1;
      white-space: nowrap;
    }

    @include mixins.mq("sm") {
      left: auto;
      right: -24px;
      transform: translate(0, 70%);
    }

    @include mixins.mq("lg") {
      right: -32px;
      transform: translate(0, 80%);

      :deep(.banner-copy) {
        font-size: var(--font-size-title-xs);
      }
    }
  }
}
</style>
