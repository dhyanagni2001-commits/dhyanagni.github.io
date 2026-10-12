<script setup lang="ts">
import { aboutParagraphs, legacyAsset, services } from "../../../../content/portfolio";
</script>

<template>
  <div class="about">
    <div class="about-text">
      <p v-for="(paragraph, index) in aboutParagraphs" :key="index">{{ paragraph }}</p>
    </div>

    <h3 class="about-subtitle">What I work on</h3>
    <ul class="about-services">
      <li v-for="service in services" :key="service.title" class="about-service">
        <img class="about-service-icon" :src="legacyAsset(service.icon)" alt="" width="40" height="40" />
        <div>
          <h4 class="about-service-title">{{ service.title }}</h4>
          <p class="about-service-text">{{ service.text }}</p>
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
    gap: 16px;
    color: var(--color-text-300);
    font-size: 17px;
    line-height: 1.65;
  }

  &-subtitle {
    margin: 40px 0 20px;
    font-size: 24px;
    font-weight: 900;
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
    border: 1px solid var(--color-beige-700);
    border-radius: 16px;
    background: var(--color-white-400);

    &-icon {
      flex: 0 0 auto;
    }

    &-title {
      margin-bottom: 6px;
      font-size: 18px;
      font-weight: 800;
    }

    &-text {
      color: var(--color-text-300);
      font-size: 15px;
      line-height: 1.6;
    }
  }
}

@media (max-width: 760px) {
  .about-services {
    grid-template-columns: 1fr;
  }
}
</style>
