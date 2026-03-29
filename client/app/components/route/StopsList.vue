<template>
  <div v-if="store.stops.length" class="flex flex-col gap-2">
    <h2 class="font-display text-xs uppercase tracking-widest text-text-secondary">
      Your stops
    </h2>
    <div
      v-for="(stop, i) in store.stops"
      :key="i"
      class="flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-3"
      :style="{ animationDelay: `${i * 80}ms` }"
      :class="['animate-fade-in-up opacity-0 fill-mode-forwards']"
    >
      <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-bold text-accent">
        {{ i + 1 }}
      </span>
      <div class="flex flex-col gap-0.5 overflow-hidden">
        <span class="font-display text-sm text-text-primary">{{ stop.label }}</span>
        <span class="truncate font-mono text-xs text-text-secondary">{{ stop.address }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useRouteStore()
</script>
