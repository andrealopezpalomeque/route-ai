<template>
  <div class="flex items-center gap-2">
    <span
      class="inline-block h-1.5 w-1.5 rounded-full"
      :class="store.loading ? 'animate-pulse-accent bg-accent' : 'bg-accent'"
    />
    <span class="font-mono text-xs text-text-secondary">{{ store.status }}</span>
  </div>
</template>

<script setup lang="ts">
const store = useRouteStore()
</script>
