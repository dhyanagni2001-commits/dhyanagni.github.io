<script setup lang="ts">
import { computed } from "vue";

export interface Props {
  renderAs?: "button" | "a" | "div";
  variant?: "accent" | "secondary" | "secondary-dark" | "border" | "theme" | "background" | "gray";
  rounded?: boolean;
}

const props = defineProps<Props>();

const classes = computed(() => [
  "button-wrapper",
  { [`button-wrapper-${props.variant}`]: props.variant !== undefined },
  { "button-wrapper-rounded": props.rounded },
]);
</script>

<template>
  <component :is="props.renderAs ?? 'button'" :class="classes">
    <slot></slot>
  </component>
</template>

<style scoped lang="scss">
.button-wrapper {
  border: 1px solid transparent;
  border-radius: 100px;
  font-family: var(--font-sans);
  letter-spacing: 0.01em;
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
  background-color: transparent;
  transition:
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out,
    border-color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out,
    transform 0.2s ease-in-out;

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.55;
  }

  &-rounded {
    border-radius: 50%;
    aspect-ratio: 1;
  }

  &-accent {
    background-color: var(--color-accent-400, var(--magenta));
    color: var(--color-accent-text-400, var(--color-white-400));
    --icon-color: var(--color-accent-text-400, var(--color-white-400));

    @include mixins.hover {
      &:hover:not(:disabled) {
        background-color: var(--color-hover, var(--magenta-hover));
        color: var(--color-hover-text, var(--color-white-400));
        --icon-color: var(--color-hover-text, var(--color-white-400));
        box-shadow: 0 6px 16px rgba(8, 38, 58, 0.22);
        transform: translateY(-1px);
      }
    }
  }

  &-secondary {
    border-color: var(--border-light);
    background-color: var(--pale-blue);
    color: var(--text-dark);
    --icon-color: var(--text-dark);

    @include mixins.hover {
      &:hover {
        border-color: var(--cyan-dark);
        background-color: var(--surface-light);
        transform: translateY(-1px);
      }
    }
  }

  &-secondary-dark {
    border-color: var(--border-dark);
    background-color: var(--teal-navy);
    color: var(--text-light);
    --icon-color: var(--text-light);

    @include mixins.hover {
      &:hover {
        border-color: var(--cyan);
        background-color: var(--raised-teal);
        transform: translateY(-1px);
      }
    }
  }

  &-theme {
    background-color: var(--color-grayscale-500);
    color: var(--color-text-400);
    --icon-color: var(--color-text-400);

    @include mixins.hover {
      &:hover {
        background-color: var(--color-hover, var(--pale-blue-strong));
      }
    }
  }

  &-background {
    background-color: var(--color-background-400);
    color: var(--color-text-400);
    --icon-color: var(--color-text-400);

    @include mixins.hover {
      &:hover {
        background-color: var(--color-text-400);
        color: var(--color-background-400);
        --icon-color: var(--color-background-400);
      }
    }
  }

  &-gray {
    background-color: var(--color-gray-400);
    color: var(--color-white-400);
    --icon-color: var(--color-white-400);

    @include mixins.hover {
      &:hover {
        background-color: var(--color-gray-500);
      }
    }
  }

  &-border {
    border: 2px solid var(--color-grayscale-400);
    color: var(--color-text-400);
    --icon-color: var(--color-text-400);

    @include mixins.hover {
      &:hover {
        background-color: var(--color-hover, var(--color-black-400));
        color: var(--color-white-400);
        --icon-color: var(--color-white-400);
        border-color: var(--color-hover, var(--color-black-400));
      }
    }
  }
}
</style>
