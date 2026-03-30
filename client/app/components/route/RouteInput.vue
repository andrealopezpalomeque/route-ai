<template>
  <div class="flex flex-col">
    <label for="route-input" class="mb-2.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent">
      Describe your trip
    </label>
    <textarea
      id="route-input"
      v-model="store.input"
      :disabled="store.loading"
      placeholder="I need to go to the pharmacy on Belgrano, then the supermarket on San Juan, and pick up my friend near the plaza. About an hour."
      rows="5"
      class="h-[130px] w-full resize-none rounded-[10px] border border-white/10 bg-black/40 px-4 py-4 font-mono text-base leading-[1.7] text-text-primary placeholder-text-muted outline-none transition-colors focus:border-accent/40 disabled:opacity-40"
      @keydown.meta.enter="submit"
      @keydown.ctrl.enter="submit"
    />

    <button
      :disabled="!store.input.trim() || store.loading"
      class="mt-4 w-full rounded-[10px] bg-accent px-4 py-4 font-display text-[0.95rem] font-bold tracking-wide text-bg transition-all hover:translate-y-[-1px] hover:bg-[#00ffc8] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
      @click="submit"
    >
      {{ store.loading ? 'Processing...' : 'Plan My Route →' }}
    </button>

    <div v-if="store.loading && store.status" class="mt-4 flex items-center gap-2">
      <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-accent animate-pulse-accent" />
      <span class="font-mono text-xs text-text-muted">{{ store.status }}</span>
    </div>

    <div v-if="store.error" class="mt-4 rounded-[10px] border border-red-500/20 bg-red-500/[0.08] px-3.5 py-3.5 font-mono text-[0.8rem] leading-relaxed text-red-400">
      {{ store.error }}
    </div>

    <div class="mt-3 flex items-center gap-1.5 font-mono text-xs">
      <template v-if="geo.loading.value">
        <span class="text-text-muted">Detecting location...</span>
      </template>
      <template v-else-if="geo.locationContext.value">
        <span class="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
        <span class="text-text-secondary">{{ geo.locationContext.value }}</span>
      </template>
      <template v-else-if="!geo.requested.value">
        <button
          class="text-text-muted transition-colors hover:text-accent"
          @click="geo.requestLocation()"
        >
          Enable location for better results
        </button>
      </template>
      <template v-else-if="geo.error.value">
        <span class="text-text-muted">⚠ Location unavailable — results may be less accurate</span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useRouteStore()
const geo = useGeolocation()

function submit() {
  if (!store.input.trim() || store.loading) return
  store.parseRoute(geo.coords.value, geo.locationContext.value)
}
</script>
