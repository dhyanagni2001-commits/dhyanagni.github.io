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
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    background-color: var(--surface-light);
    color: inherit;
    text-decoration: none;
    transition:
      transform 0.3s var(--ease-power2-out),
      border-color 0.3s var(--ease-power2-out),
      box-shadow 0.3s var(--ease-power2-out);

    &:focus-visible {
      border-color: var(--cyan-dark);
    }

    @include mixins.hover {
      &:hover:not(&-static) {
        transform: translateY(-3px);
        box-shadow: 0 12px 28px rgba(8, 38, 58, 0.1);
        border-color: var(--cyan-dark);
      }
    }

    &:hover:not(&-static) .milestones-link,
    &:focus-visible .milestones-link {
      text-decoration: underline;
    }
  }

  &-image {
    flex: 0 0 112px;
    width: 112px;
    height: 112px;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
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
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: var(--type-label);
  }

  &-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: currentColor;
  }

  &-title {
    margin: 6px 0 8px;
    color: var(--text-dark);
    font-size: var(--type-h4);
    line-height: 1.3;
  }

  &-text {
    color: var(--text-muted);
    font-size: 15px;
    line-height: var(--line-height-body);
  }

  &-link {
    display: inline-block;
    margin-top: 10px;
    color: var(--cyan-dark);
    font-size: var(--type-small);
    font-weight: 700;
    text-underline-offset: 3px;
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
