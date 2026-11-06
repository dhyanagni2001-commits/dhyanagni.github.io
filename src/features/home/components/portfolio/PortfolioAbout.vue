<script setup lang="ts">
import { aboutParagraphs, legacyAsset, services } from "../../../../content/portfolio";
</script>

<template>
  <div class="about">
    <div class="about-text">
      <p v-for="(paragraph, index) in aboutParagraphs" :key="index">{{ paragraph }}</p>
    </div>

    <h3 class="about-subtitle">What I do</h3>
    <ul class="about-services">
      <li v-for="service in services" :key="service.title" class="about-service">
        <img class="about-service-icon" :src="legacyAsset(service.icon)" alt="" width="40" height="40" />
        <div>
          <h4 class="about-service-title">{{ service.title }}</h4>
          <p class="about-service-text">{{ service.summary }}</p>
          <ul class="about-service-tags">
            <li v-for="tag in service.tags" :key="tag">{{ tag }}</li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.about {
  &-text {
    display: flex;
    flex-direction: column;
    gap: 14px;
    color: var(--text-body);
    font-size: 18px;
    font-weight: 400;
    line-height: 1.65;
  }

  &-subtitle {
    margin: 40px 0 20px;
    color: var(--text-dark);
    font-size: var(--type-h3);
  }

  &-services {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  &-service {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 20px;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    background-color: var(--surface-light);
    transition:
      transform 0.3s var(--ease-power2-out),
      border-color 0.3s var(--ease-power2-out),
      box-shadow 0.3s var(--ease-power2-out);

    @include mixins.hover {
      &:hover {
        transform: translateY(-3px);
        border-color: var(--cyan-dark);
        box-shadow: 0 12px 28px rgba(8, 38, 58, 0.1);
      }
    }

    &-icon {
      flex: 0 0 auto;
    }

    &-title {
      margin-bottom: 6px;
      color: var(--text-dark);
      font-size: var(--type-h4);
    }

    &-text {
      color: var(--text-body);
      font-size: var(--type-body);
      line-height: 1.5;
    }

    &-tags {
      margin-top: 12px;
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
  }
}

@media (max-width: 760px) {
  .about-text {
    font-size: 17px;
  }

  .about-services {
    grid-template-columns: 1fr;
  }
}
</style>
