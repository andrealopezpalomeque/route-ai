<template>
  <main class="mx-auto max-w-app px-4 py-12">
    <header class="mb-10">
      <h1 class="font-display text-2xl font-bold tracking-tight text-text-primary">
        Route AI
      </h1>
      <p class="mt-1 font-mono text-xs text-text-muted">
        Describe your trip. We'll map it.
      </p>
    </header>

    <div class="flex flex-col gap-6">
      <RouteInput />
      <TimeNote />
      <StopsList />
      <MapsButton />
    </div>
  </main>
</template>
