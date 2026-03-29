<template>
  <div
    v-if="store.timeNote"
    class="flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 px-4 py-2.5"
  >
    <span class="text-accent">&#9201;</span>
    <span class="font-mono text-xs text-accent">{{ store.timeNote }}</span>
  </div>
</template>

<script setup lang="ts">
const store = useRouteStore()
</script>
