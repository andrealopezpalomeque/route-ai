<template>
  <div class="flex min-h-screen flex-col bg-bg bg-[radial-gradient(ellipse_at_20%_50%,rgba(0,255,180,0.04)_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,rgba(0,150,255,0.05)_0%,transparent_50%)]">
    <!-- Top nav -->
    <nav class="fixed left-0 right-0 top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div class="mx-auto flex max-w-app items-center justify-between px-6 py-4">
        <NuxtLink
          to="/"
          class="group flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-text-muted transition-colors duration-200 hover:text-text-primary"
        >
          <span class="inline-block transition-transform duration-200 group-hover:-translate-x-0.5">&larr;</span>
          {{ $t('app.back') }}
        </NuxtLink>
        <span class="font-display text-lg font-bold tracking-tight">
          route<span class="text-accent">AI</span>
        </span>
        <div class="flex items-center gap-3">
          <button
            v-for="loc in locales"
            :key="loc.code"
            class="font-mono text-xs uppercase tracking-widest transition-colors duration-200"
            :class="locale === loc.code ? 'text-accent' : 'text-text-muted hover:text-text-secondary'"
            @click="setLocale(loc.code)"
          >
            {{ loc.name }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="flex flex-1 flex-col items-center px-4 pb-12 pt-28">
      <div class="w-full max-w-app rounded-2xl border border-border bg-surface p-8 backdrop-blur-[12px]">
        <RouteInput />

        <template v-if="store.stops.length">
          <div class="my-7 h-px bg-border" />
          <StopsList />
          <TimeNote />
          <MapsButton />
        </template>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-border px-6 py-8">
      <div class="mx-auto flex max-w-app flex-col items-center text-center">
        <p class="font-mono text-xs text-text-muted">
          {{ $t('footer.copyright', { year: new Date().getFullYear() }) }}
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { t: $t, locale, setLocale } = useI18n()
const store = useRouteStore()

const locales = [
  { code: 'en', name: 'EN' },
  { code: 'es', name: 'ES' },
]
</script>
