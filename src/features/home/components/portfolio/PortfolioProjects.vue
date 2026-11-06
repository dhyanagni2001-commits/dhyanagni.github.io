<script setup lang="ts">
import { computed, ref } from "vue";
import { legacyAsset, projectCategories, projects } from "../../../../content/portfolio";
import type { ProjectCategory } from "../../../../content/portfolio";

const activeCategory = ref<ProjectCategory | "all">("all");

const visibleProjects = computed(() =>
  activeCategory.value === "all" ? projects : projects.filter((project) => project.category === activeCategory.value),
);

const categoryLabel = (id: ProjectCategory) => projectCategories.find((category) => category.id === id)?.label ?? "";
</script>

<template>
  <div class="projects">
    <div class="projects-filters" role="group" aria-label="Filter projects">
      <button
        v-for="category in projectCategories"
        :key="category.id"
        type="button"
        class="projects-filter"
        :class="{ 'projects-filter-active': activeCategory === category.id }"
        :aria-pressed="activeCategory === category.id"
        data-hoversound="hover"
        @click="activeCategory = category.id"
      >
        {{ category.label }}
      </button>
    </div>

    <ul class="projects-list">
      <li v-for="project in visibleProjects" :key="project.title">
        <a class="projects-card" :href="project.url" target="_blank" rel="noopener" data-hoversound="hover">
          <figure class="projects-image">
            <img :src="legacyAsset(project.image)" :alt="`${project.title} cover`" loading="lazy" />
          </figure>
          <h3 class="projects-title">{{ project.title }}</h3>
          <p class="projects-description">{{ project.purpose }}</p>
          <div v-if="project.metric" class="projects-result">
            <span class="projects-metric">{{ project.metric }}</span>
            <p class="projects-result-text">{{ project.result }}</p>
          </div>
          <ul class="projects-stack">
            <li v-for="tech in project.stack" :key="tech">{{ tech }}</li>
          </ul>
          <div class="projects-footer">
            <span class="projects-link">View on GitHub →</span>
            <span class="projects-category">{{ categoryLabel(project.category) }}</span>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.projects {
  &-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
  }

  &-filter {
    min-height: 40px;
    padding: 0 16px;

    @media (pointer: coarse) {
      min-height: 44px;
    }

    border: 1px solid var(--border-light);
    border-radius: 999px;
    background-color: var(--surface-light);
    color: var(--text-dark);
    font-family: inherit;
    font-size: var(--type-small);
    font-weight: 700;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease;

    @include mixins.hover {
      &:hover {
        border-color: var(--cyan-dark);
      }
    }

    &-active,
    &-active:hover {
      border-color: var(--cyan-dark);
      background-color: var(--cyan-dark);
      color: var(--color-white-400);
    }
  }

  &-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;

    > li {
      min-width: 0;
    }
  }

  &-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 12px 12px 20px;
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
      &:hover {
        transform: translateY(-3px);
        border-color: var(--cyan-dark);
        box-shadow: 0 12px 28px rgba(8, 38, 58, 0.1);
      }
    }
  }

  &-image {
    margin-bottom: 16px;
    aspect-ratio: 16 / 9;
    border-radius: var(--radius-md);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s var(--ease-power2-out);
    }
  }

  @include mixins.hover {
    &-card:hover &-image img {
      transform: scale(1.04);
    }
  }

  &-title,
  &-description,
  &-result,
  &-stack,
  &-footer {
    margin-left: 8px;
    margin-right: 8px;
  }

  &-title {
    color: var(--text-dark);
    font-size: var(--type-h4);
    line-height: 1.3;
  }

  &-description {
    margin-top: 8px;
    color: var(--text-muted);
    font-size: 15px;
    line-height: var(--line-height-body);
  }

  &-result {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid var(--border-light);

    &-text {
      margin-top: 2px;
      color: var(--text-muted);
      font-size: var(--type-small);
      line-height: 1.5;
    }
  }

  &-metric {
    color: var(--cyan-dark);
    font-size: var(--type-h3);
    font-weight: 700;
    line-height: 1.2;
  }

  &-stack {
    margin-top: 14px;
    margin-bottom: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    li {
      padding: 3px 10px;
      border-radius: 999px;
      background-color: var(--pale-blue);
      color: var(--text-dark);
      font-family: var(--font-mono);
      font-size: var(--type-label);
    }
  }

  &-footer {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &-link {
    color: var(--cyan-dark);
    font-size: var(--type-small);
    font-weight: 700;
    text-underline-offset: 3px;
  }

  &-card:focus-visible &-link {
    text-decoration: underline;
  }

  @include mixins.hover {
    &-card:hover &-link {
      text-decoration: underline;
    }
  }

  &-category {
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: var(--type-label);
  }
}

@media (max-width: 760px) {
  .projects-list {
    grid-template-columns: 1fr;
  }
}
</style>
