<script setup lang="ts">
import { skills, timelines } from "../../../../content/portfolio";
</script>

<template>
  <div class="resume">
    <section v-for="timeline in timelines" :key="timeline.title" class="resume-section">
      <h3 class="resume-subtitle">{{ timeline.title }}</h3>
      <ol class="resume-timeline">
        <li v-for="item in timeline.items" :key="item.title" class="resume-item">
          <h4 class="resume-item-title">{{ item.title }}</h4>
          <p v-if="item.role" class="resume-item-role">{{ item.role }}</p>
          <span class="resume-item-period">{{ item.period }}</span>
          <p class="resume-item-text">{{ item.text }}</p>
        </li>
      </ol>
    </section>

    <section class="resume-section">
      <h3 class="resume-subtitle">Technical skills</h3>
      <dl class="resume-skills">
        <div v-for="skill in skills" :key="skill.label" class="resume-skill">
          <dt>{{ skill.label }}</dt>
          <dd>{{ skill.items }}</dd>
        </div>
      </dl>
    </section>
  </div>
</template>

<style scoped lang="scss">
.resume {
  display: flex;
  flex-direction: column;
  gap: 40px;

  &-subtitle {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 900;
  }

  &-timeline {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding-left: 28px;
    border-left: 2px solid var(--color-beige-700);
  }

  &-item {
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 6px;
      left: -35px;
      width: 12px;
      height: 12px;
      border: 3px solid var(--color-background-400);
      border-radius: 50%;
      background: var(--color-orange-400);
    }

    &-title {
      font-size: 18px;
      font-weight: 800;
    }

    &-role {
      margin-top: 2px;
      font-size: 15px;
      font-weight: 700;
    }

    &-period {
      display: block;
      margin: 2px 0 8px;
      color: var(--color-orange-400);
      font-size: 14px;
      font-weight: 700;
    }

    &-text {
      color: var(--color-text-300);
      font-size: 15px;
      line-height: 1.65;
    }
  }

  &-skills {
    display: grid;
    gap: 12px;
    padding: 20px;
    border: 1px solid var(--color-beige-700);
    border-radius: 16px;
    background: var(--color-white-400);
  }

  &-skill {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 12px;
    font-size: 15px;
    line-height: 1.5;

    dt {
      color: var(--color-orange-400);
      font-weight: 800;
    }

    dd {
      color: var(--color-text-300);
    }
  }
}

@media (max-width: 640px) {
  .resume-skill {
    grid-template-columns: 1fr;
    gap: 2px;
  }
}
</style>
