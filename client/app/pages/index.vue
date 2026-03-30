<template>
  <div class="min-h-screen bg-bg text-text-primary">
    <!-- NAV -->
    <nav class="fixed left-0 right-0 top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <span class="font-display text-lg font-bold tracking-tight">
          route<span class="text-accent">AI</span>
        </span>
        <div class="flex items-center gap-4">
          <button
            v-for="loc in locales"
            :key="loc.code"
            class="font-mono text-xs uppercase tracking-widest transition-colors duration-200"
            :class="locale === loc.code ? 'text-accent' : 'text-text-muted hover:text-text-secondary'"
            @click="setLocale(loc.code)"
          >
            {{ loc.name }}
          </button>
          <NuxtLink
            to="/app"
            class="ml-2 hidden rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-accent transition-all duration-200 hover:border-accent/60 hover:bg-accent/10 sm:inline-block"
          >
            {{ $t('nav.tryIt') }}
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- HERO -->
    <section class="relative overflow-hidden px-6 pb-24 pt-32 md:pb-32 md:pt-44">
      <!-- Background gradient orbs -->
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(0,255,178,0.06)_0%,transparent_60%)]" />
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(0,150,255,0.04)_0%,transparent_50%)]" />

      <div class="relative mx-auto flex max-w-5xl flex-col items-center gap-12 md:flex-row md:items-center md:gap-0">
        <!-- Left: copy -->
        <div class="w-full text-center md:w-[55%] md:text-left">
          <h1
            class="font-display text-[clamp(2.8rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-tight opacity-0"
            style="animation: fade-in-up 0.8s ease-out 0.1s forwards;"
          >
            {{ $t('hero.headline') }}<br />
            <span class="text-accent">{{ $t('hero.headlineAccent') }}</span>
          </h1>
          <p
            class="mx-auto mt-6 max-w-md text-base leading-relaxed text-text-secondary opacity-0 md:mx-0 md:text-lg"
            style="animation: fade-in-up 0.8s ease-out 0.35s forwards;"
          >
            {{ $t('hero.subheading') }}
          </p>
          <div
            class="mt-10 flex flex-col items-center gap-3 opacity-0 sm:flex-row md:items-start"
            style="animation: fade-in-up 0.8s ease-out 0.55s forwards;"
          >
            <NuxtLink
              to="/app"
              class="group relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 font-display text-sm font-bold uppercase tracking-wider text-bg transition-all duration-200 hover:shadow-[0_0_32px_rgba(0,255,178,0.3)] sm:w-auto sm:min-w-[180px]"
            >
              {{ $t('hero.cta') }}
              <span class="inline-block transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
            </NuxtLink>
            <button
              class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-7 py-3 font-display text-sm font-bold uppercase tracking-wider text-text-secondary transition-all duration-200 hover:border-text-muted hover:text-text-primary sm:w-auto sm:min-w-[180px]"
              @click="scrollToInstall"
            >
              {{ $t('hero.ctaInstall') }}
              <span class="text-xs">&darr;</span>
            </button>
          </div>
        </div>

        <!-- Right: route animation -->
        <div
          class="h-[250px] w-full opacity-0 md:h-auto md:w-[45%] md:self-stretch"
          style="animation: fade-in-up 0.8s ease-out 0.4s forwards;"
        >
          <RouteAnimation />
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section ref="howItWorksRef" class="relative border-t border-border px-6 py-24 md:py-32">
      <div class="mx-auto max-w-5xl">
        <p
          class="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-all duration-700"
          :class="howItWorksVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
        >
          {{ $t('howItWorks.label') }}
        </p>

        <div class="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          <div
            v-for="(step, i) in steps"
            :key="i"
            class="transition-all duration-700"
            :class="howItWorksVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            :style="howItWorksVisible ? `transition-delay: ${(i + 1) * 150}ms` : ''"
          >
            <span class="font-mono text-4xl font-bold text-accent/20">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="mt-3 font-display text-xl font-bold tracking-tight text-text-primary">
              {{ $t(step.title) }}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-text-secondary">
              {{ $t(step.desc) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- INSTALL -->
    <section
      id="install"
      ref="installRef"
      class="relative border-t border-border px-6 py-24 md:py-32"
    >
      <div class="mx-auto max-w-5xl">
        <div
          class="mb-16 text-center transition-all duration-700"
          :class="installVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
        >
          <h2 class="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            {{ $t('install.headline') }}
          </h2>
          <p class="mx-auto mt-3 max-w-md text-base text-text-secondary">
            {{ $t('install.subheading') }}
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <!-- Android card -->
          <div
            class="rounded-2xl border border-border bg-surface p-8 backdrop-blur-sm transition-all duration-700"
            :class="installVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            :style="installVisible ? 'transition-delay: 150ms' : ''"
          >
            <span class="mb-6 inline-block rounded-full border border-accent/20 bg-accent/5 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-accent">
              {{ $t('install.androidLabel') }}
            </span>
            <ol class="mt-4 space-y-4">
              <li class="flex gap-3">
                <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-[10px] font-bold text-accent">1</span>
                <span class="font-mono text-sm leading-relaxed text-text-secondary">{{ $t('install.androidStep1') }}</span>
              </li>
              <li class="flex gap-3">
                <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-[10px] font-bold text-accent">2</span>
                <span class="font-mono text-sm leading-relaxed text-text-secondary">{{ $t('install.androidStep2') }}</span>
              </li>
              <li class="flex gap-3">
                <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-[10px] font-bold text-accent">3</span>
                <span class="font-mono text-sm leading-relaxed text-text-secondary">{{ $t('install.androidStep3') }}</span>
              </li>
            </ol>
          </div>

          <!-- iPhone card -->
          <div
            class="rounded-2xl border border-border bg-surface p-8 backdrop-blur-sm transition-all duration-700"
            :class="installVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            :style="installVisible ? 'transition-delay: 300ms' : ''"
          >
            <span class="mb-6 inline-block rounded-full border border-border bg-white/5 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-text-secondary">
              {{ $t('install.iphoneLabel') }}
            </span>
            <ol class="mt-4 space-y-4">
              <li class="flex gap-3">
                <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-[10px] font-bold text-accent">1</span>
                <span class="font-mono text-sm leading-relaxed text-text-secondary">{{ $t('install.iphoneStep1') }}</span>
              </li>
              <li class="flex gap-3">
                <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-[10px] font-bold text-accent">2</span>
                <span class="font-mono text-sm leading-relaxed text-text-secondary">{{ $t('install.iphoneStep2') }}</span>
              </li>
              <li class="flex gap-3">
                <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-[10px] font-bold text-accent">3</span>
                <span class="font-mono text-sm leading-relaxed text-text-secondary">{{ $t('install.iphoneStep3') }}</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="border-t border-border px-6 py-12">
      <div class="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
        <p class="font-mono text-xs text-text-muted">
          {{ $t('footer.copyright', { year: new Date().getFullYear() }) }}
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { t: $t, locale, setLocale } = useI18n()

const locales = [
  { code: 'en', name: 'EN' },
  { code: 'es', name: 'ES' },
]

const steps = [
  { title: 'howItWorks.step1Title', desc: 'howItWorks.step1Desc' },
  { title: 'howItWorks.step2Title', desc: 'howItWorks.step2Desc' },
  { title: 'howItWorks.step3Title', desc: 'howItWorks.step3Desc' },
]

// Scroll-reveal
const howItWorksRef = ref<HTMLElement | null>(null)
const installRef = ref<HTMLElement | null>(null)
const howItWorksVisible = ref(false)
const installVisible = ref(false)

useIntersectionObserver(howItWorksRef, ([entry]) => {
  if (entry?.isIntersecting) howItWorksVisible.value = true
}, { threshold: 0.15 })

useIntersectionObserver(installRef, ([entry]) => {
  if (entry?.isIntersecting) installVisible.value = true
}, { threshold: 0.15 })

function scrollToInstall() {
  document.getElementById('install')?.scrollIntoView({ behavior: 'smooth' })
}
</script>
