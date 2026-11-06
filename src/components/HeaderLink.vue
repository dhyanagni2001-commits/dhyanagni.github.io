<script setup lang="ts">
const props = defineProps<{
  isActive?: boolean;
  isDarkTheme?: boolean;
}>();
</script>

<template>
  <button
    class="header-link nav-pill-item"
    :data-cursor="props.isDarkTheme ? 'circle-white' : 'circle-black'"
    :class="{ 'nav-pill-item-on': props.isActive }"
    :aria-current="props.isActive ? 'true' : undefined"
  >
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
.header-link {
  width: 128px;
}
</style>
