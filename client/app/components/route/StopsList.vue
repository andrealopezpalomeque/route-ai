<template>
  <div v-if="store.stops.length" class="flex flex-col gap-2.5">
    <h2 class="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent">
      {{ $t('app.extractedStops') }}
    </h2>
    <div class="flex flex-col gap-2.5">
      <div
        v-for="(stop, i) in store.stops"
        :key="i"
        class="flex gap-3 rounded-[10px] border border-border bg-black/30 px-3.5 py-3.5 opacity-0 animate-fade-in-up fill-mode-forwards"
        :style="{ animationDelay: `${i * 80}ms` }"
      >
        <span class="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-accent font-display text-[0.7rem] font-extrabold text-bg">
          {{ i + 1 }}
        </span>
        <div class="flex flex-1 flex-col">
          <span class="font-display text-[0.9rem] font-semibold text-text-primary">{{ stop.label }}</span>
          <span class="mt-0.5 font-mono text-[0.72rem] leading-snug text-text-muted">{{ stop.address }}</span>
          <span class="mt-1 font-mono text-[0.65rem] text-accent">✓ {{ $t('app.ready') }}</span>
        </div>
      </div>
    </div>
    <button
      class="mt-1 self-start font-body text-[14px] text-text-muted transition-colors hover:underline hover:text-text-secondary"
      @click="store.retryEdit()"
    >
      {{ $t('app.retryHint') }}
    </button>
  </div>
</template>

<script setup lang="ts">
const { t: $t } = useI18n()
const store = useRouteStore()
</script>
