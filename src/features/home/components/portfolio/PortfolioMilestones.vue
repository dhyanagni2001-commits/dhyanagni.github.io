<script setup lang="ts">
import { legacyAsset, milestones } from "../../../../content/portfolio";
</script>

<template>
  <ul class="milestones">
    <li v-for="milestone in milestones" :key="milestone.title">
      <component
        :is="milestone.image ? 'a' : 'div'"
        class="milestones-card"
        :class="{ 'milestones-card-static': !milestone.image }"
        :href="milestone.image ? legacyAsset(milestone.image) : undefined"
        :target="milestone.image ? '_blank' : undefined"
        :rel="milestone.image ? 'noopener' : undefined"
        :data-hoversound="milestone.image ? 'hover' : undefined"
      >
        <figure v-if="milestone.image" class="milestones-image">
          <img :src="legacyAsset(milestone.image)" :alt="milestone.alt" loading="lazy" />
        </figure>
        <div class="milestones-content">
          <p class="milestones-meta">
            <span>{{ milestone.category }}</span>
            <span class="milestones-dot" aria-hidden="true"></span>
            <time :datetime="milestone.datetime">{{ milestone.date }}</time>
          </p>
          <h3 class="milestones-title">{{ milestone.title }}</h3>
          <p class="milestones-text">{{ milestone.text }}</p>
          <span v-if="milestone.image" class="milestones-link">View certificate →</span>
        </div>
      </component>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.milestones {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &-card {
    display: flex;
    align-items: flex-start;
    gap: 24px;
    padding: 20px;
    border: 1px solid var(--color-beige-700);
    border-radius: 18px;
    background: var(--color-white-400);
    color: inherit;
    text-decoration: none;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;

    &:hover:not(&-static),
    &:focus-visible {
      transform: translateY(-3px);
      box-shadow: 0 12px 28px rgba(45, 42, 36, 0.12);
    }
  }

  &-image {
    flex: 0 0 112px;
    width: 112px;
    height: 112px;
    border: 1px solid var(--color-beige-700);
    border-radius: 12px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &-content {
    flex: 1;
    min-width: 0;
  }

  &-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    color: var(--color-text-300);
    font-size: 14px;
  }

  &-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: currentColor;
  }

  &-title {
    margin: 6px 0 8px;
    font-size: 19px;
    font-weight: 800;
    line-height: 1.3;
  }

  &-text {
    color: var(--color-text-300);
    font-size: 15px;
    line-height: 1.6;
  }

  &-link {
    display: inline-block;
    margin-top: 10px;
    color: var(--color-orange-400);
    font-size: 14px;
    font-weight: 700;
  }
}

@media (max-width: 560px) {
  .milestones-card {
    gap: 16px;
    padding: 16px;
  }

  .milestones-image {
    flex-basis: 72px;
    width: 72px;
    height: 72px;
  }
}

@media (max-width: 480px) {
  .milestones-card {
    flex-direction: column;
    gap: 12px;
  }

  .milestones-image {
    flex-basis: auto;
    width: 100%;
    height: 140px;
  }
}
</style>
