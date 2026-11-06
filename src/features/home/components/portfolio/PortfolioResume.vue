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
    color: var(--text-dark);
    font-size: var(--type-h3);
  }

  &-timeline {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding-left: 24px;
    border-left: 1px solid var(--border-light);
  }

  &-item {
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 5px;
      left: -30px;
      width: 11px;
      height: 11px;
      border: 2px solid var(--ice-blue);
      border-radius: 50%;
      background-color: var(--cyan-dark);
    }

    &-title {
      color: var(--text-dark);
      font-size: var(--type-h4);
    }

    &-role {
      margin-top: 2px;
      color: var(--text-dark);
      font-size: 15px;
      font-weight: 700;
    }

    &-period {
      display: block;
      margin: 4px 0 8px;
      color: var(--text-muted);
      font-family: var(--font-mono);
      font-size: var(--type-label);
    }

    &-text {
      max-width: var(--measure);
      color: var(--text-muted);
      font-size: var(--type-body);
      line-height: var(--line-height-body);
    }
  }

  &-skills {
    display: grid;
    gap: 12px;
    padding: 20px;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    background-color: var(--surface-light);
  }

  &-skill {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 12px;
    font-size: 15px;
    line-height: 1.5;

    dt {
      color: var(--text-dark);
      font-weight: 700;
    }

    dd {
      color: var(--text-muted);
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
