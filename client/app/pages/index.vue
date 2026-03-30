<template>
  <div class="min-h-screen text-text-primary">
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
    <section class="section-hero relative overflow-hidden px-6 pb-24 pt-32 md:pb-32 md:pt-44">
      <!-- RouteAnimation as atmospheric background -->
      <div class="pointer-events-none absolute inset-0 opacity-[0.15]">
        <RouteAnimation />
      </div>

      <!-- Background gradient orbs -->
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(0,255,178,0.06)_0%,transparent_60%)]" />
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(0,150,255,0.04)_0%,transparent_50%)]" />

      <div class="relative mx-auto max-w-5xl text-center">
        <HeroHeadline
          :line1="$t('hero.headline')"
          :line2="$t('hero.headlineAccent')"
          @complete="heroComplete = true"
        />

        <p
          class="hero-sub mx-auto mt-8 max-w-lg text-base leading-relaxed text-text-secondary md:text-lg"
          :class="{ 'hero-sub--visible': heroComplete }"
        >
          {{ $t('hero.subheading') }}
        </p>

        <div
          class="hero-ctas mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          :class="{ 'hero-ctas--visible': heroComplete }"
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
    </section>

    <!-- HOW IT WORKS -->
    <section ref="howRef" class="section-how relative px-6 py-24 md:py-32">
      <div class="mx-auto max-w-5xl">
        <p
          class="scroll-reveal mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent"
          :class="{ 'scroll-reveal--visible': stepsVisible[0] }"
        >
          {{ $t('howItWorks.label') }}
        </p>

        <div class="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          <div
            v-for="(step, i) in steps"
            :key="i"
            class="step-slide"
            :class="{ 'step-slide--visible': stepsVisible[i] }"
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
      class="section-install relative px-6 py-24 md:py-32"
    >
      <div class="mx-auto max-w-5xl">
        <div class="mb-16 text-center">
          <h2
            class="scroll-reveal headline-section font-display font-extrabold"
            :class="{ 'scroll-reveal--visible': installVisible }"
          >
            {{ $t('install.headline') }}
          </h2>
          <p
            class="scroll-reveal mx-auto mt-3 max-w-md text-base text-text-secondary"
            :class="{ 'scroll-reveal--visible': installVisible }"
            :style="installVisible ? 'transition-delay: 120ms' : ''"
          >
            {{ $t('install.subheading') }}
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-2" style="perspective: 1000px">
          <!-- Android card -->
          <div
            class="install-card rounded-2xl border border-border bg-surface p-8 backdrop-blur-sm"
            :class="{ 'install-card--visible': installVisible }"
            :style="installVisible ? 'transition-delay: 240ms' : ''"
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
            class="install-card rounded-2xl border border-border bg-surface p-8 backdrop-blur-sm"
            :class="{ 'install-card--visible': installVisible }"
            :style="installVisible ? 'transition-delay: 390ms' : ''"
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

    <!-- CLOSING STATEMENT -->
    <section ref="closingRef" class="section-closing relative px-6 py-32 md:py-44">
      <div class="mx-auto max-w-5xl text-center">
        <p
          v-for="(line, i) in closingLines"
          :key="i"
          class="closing-line headline-section font-display font-extrabold"
          :class="{ 'closing-line--visible': closingVisible }"
          :style="closingVisible ? `transition-delay: ${i * 150}ms` : ''"
        >
          {{ $t(line) }}
        </p>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="section-footer border-t border-border px-6 py-12">
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

const closingLines = [
  'closing.line1',
  'closing.line2',
  'closing.line3',
]

// Hero animation complete
const heroComplete = ref(false)

// Scroll-reveal refs
const howRef = ref<HTMLElement | null>(null)
const installRef = ref<HTMLElement | null>(null)
const closingRef = ref<HTMLElement | null>(null)

// How It Works: sequential step reveals at section scroll depths
const stepsVisible = reactive([false, false, false])

useIntersectionObserver(howRef, ([entry]) => {
  if (!entry) return
  const r = entry.intersectionRatio
  if (r >= 0.1) stepsVisible[0] = true
  if (r >= 0.4) stepsVisible[1] = true
  if (r >= 0.7) stepsVisible[2] = true
}, { threshold: [0.1, 0.4, 0.7] })

// Install section
const installVisible = ref(false)

useIntersectionObserver(installRef, ([entry]) => {
  if (entry?.isIntersecting) installVisible.value = true
}, { threshold: 0.15 })

// Closing section
const closingVisible = ref(false)

useIntersectionObserver(closingRef, ([entry]) => {
  if (entry?.isIntersecting) closingVisible.value = true
}, { threshold: 0.15 })

function scrollToInstall() {
  document.getElementById('install')?.scrollIntoView({ behavior: 'smooth' })
}
</script>
