<template>
  <div class="flex min-h-screen flex-col items-center bg-bg bg-[radial-gradient(ellipse_at_20%_50%,rgba(0,255,180,0.04)_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,rgba(0,150,255,0.05)_0%,transparent_50%)] px-4 py-12">
    <header class="mb-12 text-center">
      <h1 class="font-display text-[2.4rem] font-extrabold leading-none tracking-tight text-text-primary">
        route<span class="text-accent">AI</span>
      </h1>
      <p class="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-text-muted">
        natural language → Google Maps
      </p>
    </header>

    <div class="w-full max-w-app rounded-2xl border border-border bg-surface p-8 backdrop-blur-[12px]">
      <RouteInput />

      <template v-if="store.stops.length">
        <div class="my-7 h-px bg-border" />
        <StopsList />
        <TimeNote />
        <MapsButton />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useRouteStore()
</script>
