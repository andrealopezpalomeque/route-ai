<template>
  <button
    v-if="store.mapsUrl"
    class="mt-3 w-full rounded-[10px] bg-accent-maps px-4 py-4 font-display text-[0.95rem] font-bold tracking-wide text-white transition-all hover:translate-y-[-1px] hover:bg-[#2a83f8]"
    @click="openMaps"
  >
    Open in Google Maps ↗
  </button>
</template>

<script setup lang="ts">
const store = useRouteStore()

function openMaps() {
  window.open(store.mapsUrl, '_blank')
}
</script>
