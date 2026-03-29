<template>
  <button
    v-if="store.mapsUrl"
    class="w-full rounded-lg bg-accent-maps px-5 py-3 font-display text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
    @click="openMaps"
  >
    Open in Google Maps
  </button>
</template>

<script setup lang="ts">
const store = useRouteStore()

function openMaps() {
  window.open(store.mapsUrl, '_blank')
}
</script>
