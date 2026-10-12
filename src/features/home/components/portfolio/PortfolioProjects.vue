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
          <span class="projects-category">{{ categoryLabel(project.category) }}</span>
          <h3 class="projects-title">{{ project.title }}</h3>
          <p class="projects-description">{{ project.description }}</p>
          <span class="projects-link">View on GitHub →</span>
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
    margin-bottom: 28px;
  }

  &-filter {
    padding: 8px 16px;
    border: 1px solid var(--color-beige-700);
    border-radius: 999px;
    background: var(--color-white-400);
    color: var(--color-text-400);
    font-family: inherit;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease;

    &:hover,
    &:focus-visible {
      border-color: var(--color-orange-400);
    }

    &-active,
    &-active:hover {
      border-color: var(--color-orange-400);
      background: var(--color-orange-400);
      color: var(--color-white-400);
    }
  }

  &-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  &-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 14px 14px 20px;
    border: 1px solid var(--color-beige-700);
    border-radius: 18px;
    background: var(--color-white-400);
    color: inherit;
    text-decoration: none;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;

    &:hover,
    &:focus-visible {
      transform: translateY(-3px);
      box-shadow: 0 12px 28px rgba(45, 42, 36, 0.12);
    }
  }

  &-image {
    margin-bottom: 16px;
    aspect-ratio: 16 / 9;
    border-radius: 12px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
  }

  &-card:hover &-image img {
    transform: scale(1.04);
  }

  &-category,
  &-title,
  &-description,
  &-link {
    padding: 0 6px;
  }

  &-category {
    color: var(--color-orange-400);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  &-title {
    margin: 4px 0 8px;
    font-size: 18px;
    font-weight: 800;
    line-height: 1.3;
  }

  &-description {
    margin-bottom: 14px;
    color: var(--color-text-300);
    font-size: 15px;
    line-height: 1.6;
  }

  &-link {
    margin-top: auto;
    color: var(--color-orange-400);
    font-size: 14px;
    font-weight: 700;
  }
}

@media (max-width: 760px) {
  .projects-list {
    grid-template-columns: 1fr;
  }
}
</style>
