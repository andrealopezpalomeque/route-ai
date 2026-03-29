<template>
  <div
    v-if="store.timeNote"
    class="mt-4 rounded-lg border border-accent/15 bg-accent/[0.06] px-3.5 py-2.5 font-mono text-xs leading-relaxed text-text-secondary"
  >
    ⏱ <strong class="text-text-primary">Time constraint noted:</strong> {{ store.timeNote }}
  </div>
</template>

<script setup lang="ts">
const store = useRouteStore()
</script>
