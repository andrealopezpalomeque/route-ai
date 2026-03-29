<template>
  <div class="flex flex-col gap-3">
    <label for="route-input" class="font-display text-sm uppercase tracking-widest text-text-secondary">
      Where do you need to go?
    </label>
    <textarea
      id="route-input"
      v-model="store.input"
      :disabled="store.loading"
      placeholder="e.g. I need to drop off a package at the post office on 5th Ave, grab coffee at Blue Bottle, then head to the dentist on 42nd St"
      rows="4"
      class="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 font-body text-sm text-text-primary placeholder-text-muted outline-none transition-colors focus:border-accent/40 disabled:opacity-40"
      @keydown.meta.enter="submit"
      @keydown.ctrl.enter="submit"
    />
    <div class="flex items-center gap-3">
      <button
        :disabled="!store.input.trim() || store.loading"
        class="rounded-lg bg-accent px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-wider text-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
        @click="submit"
      >
        {{ store.loading ? 'Parsing...' : 'Plan route' }}
      </button>
      <StatusIndicator v-if="store.status || store.loading" />
    </div>
    <div class="flex items-center gap-1.5 font-mono text-xs">
      <template v-if="geo.loading.value">
        <span class="text-text-muted">Detecting location...</span>
      </template>
      <template v-else-if="geo.locationContext.value">
        <span class="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
        <span class="text-text-secondary">{{ geo.locationContext.value }}</span>
      </template>
      <template v-else-if="geo.error.value">
        <span class="text-text-muted">⚠ Location unavailable — results may be less accurate</span>
      </template>
    </div>
    <p v-if="store.error" class="font-mono text-xs text-red-400">
      {{ store.error }}
    </p>
  </div>
</template>

<script setup lang="ts">
const store = useRouteStore()
const geo = useGeolocation()

onMounted(() => {
  geo.requestLocation()
})

function submit() {
  if (!store.input.trim() || store.loading) return
  store.parseRoute(geo.coords.value, geo.locationContext.value)
}
</script>
