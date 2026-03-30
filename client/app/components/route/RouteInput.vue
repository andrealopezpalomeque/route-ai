<template>
  <div class="flex flex-col">
    <label for="route-input" class="mb-2.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent">
      {{ $t('app.label') }}
    </label>
    <div class="relative">
      <textarea
        id="route-input"
        v-model="store.input"
        :disabled="store.loading"
        :placeholder="$t('app.placeholder')"
        rows="5"
        class="h-[130px] w-full resize-none rounded-[10px] border border-white/10 bg-black/40 px-4 py-4 pr-12 font-mono text-base leading-[1.7] text-text-primary placeholder-text-muted outline-none transition-colors focus:border-accent/40 disabled:opacity-40"
        @keydown.meta.enter="submit"
        @keydown.ctrl.enter="submit"
      />
      <button
        v-if="voice.isSupported.value"
        :disabled="store.loading"
        class="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full transition-colors disabled:opacity-40"
        :class="voice.isListening.value ? 'text-accent animate-pulse-accent' : 'text-text-muted hover:text-text-secondary'"
        @click="toggleVoice"
      >
        <svg v-if="voice.isListening.value" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 256 256" fill="currentColor">
          <path d="M213.92 210.62a8 8 0 1 1-11.84 10.76l-37.39-41.13A79.56 79.56 0 0 1 136 191.63V224a8 8 0 0 1-16 0v-32.37a80.15 80.15 0 0 1-72-79.63 8 8 0 0 1 16 0 64 64 0 0 0 98.11 54.19l-19.67-21.63A40 40 0 0 1 88 112V84.66L42.08 34.62a8 8 0 0 1 11.84-10.76ZM168 112v-8a8 8 0 0 1 16 0v8a79.68 79.68 0 0 1-6.55 31.76 8 8 0 0 1-14.75-6.22A63.65 63.65 0 0 0 168 112Zm-20.52 46.77L104 111.17V112a24 24 0 0 0 32.32 22.58 8 8 0 0 1 11.16 12.19ZM152 112V64a24 24 0 0 0-45.42-10.78 8 8 0 1 1-13.56-8.44A40 40 0 0 1 168 64v48a8 8 0 0 1-16 0Z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 256 256" fill="currentColor">
          <path d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 159.63V240a8 8 0 0 1-16 0v-16.37A80.11 80.11 0 0 1 48 144a8 8 0 0 1 16 0 64 64 0 0 0 128 0 8 8 0 0 1 16 0 80.11 80.11 0 0 1-72 79.63Z" />
        </svg>
      </button>
    </div>

    <div v-if="voice.isListening.value" class="mt-2 flex items-center gap-2">
      <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-accent animate-pulse-accent" />
      <span class="font-mono text-xs text-text-muted">{{ $t('app.listening') }}</span>
    </div>

    <div v-if="voice.error.value" class="mt-2 font-mono text-xs text-red-400">
      {{ $t(`app.${voice.error.value}`) }}
    </div>

    <button
      :disabled="!store.input.trim() || store.loading"
      class="mt-4 w-full rounded-[10px] bg-accent px-4 py-4 font-display text-[0.95rem] font-bold tracking-wide text-bg transition-all hover:translate-y-[-1px] hover:bg-[#00ffc8] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
      @click="submit"
    >
      {{ store.loading ? $t('app.submitting') : $t('app.submit') }}
    </button>

    <div v-if="store.loading" class="mt-4 flex items-center gap-2">
      <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-accent animate-pulse-accent" />
      <span class="font-mono text-xs text-text-muted">{{ $t('app.statusParsing') }}</span>
    </div>

    <div v-else-if="store.stops.length && !store.loading" class="mt-4 flex items-center gap-2">
      <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
      <span class="font-mono text-xs text-text-muted">{{ $t('app.statusStops', { count: store.stops.length }, store.stops.length) }}</span>
    </div>

    <div v-if="store.error" class="mt-4 rounded-[10px] border border-red-500/20 bg-red-500/[0.08] px-3.5 py-3.5 font-mono text-[0.8rem] leading-relaxed text-red-400">
      {{ store.error || $t('app.errorFallback') }}
    </div>

    <div class="mt-3 flex items-center gap-1.5 font-mono text-xs">
      <template v-if="geo.loading.value">
        <span class="text-text-muted">{{ $t('app.detectingLocation') }}</span>
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
          {{ $t('app.enableLocation') }}
        </button>
      </template>
      <template v-else-if="geo.error.value">
        <span class="text-text-muted">{{ $t('app.locationUnavailable') }}</span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t: $t } = useI18n()
const store = useRouteStore()
const geo = useGeolocation()
const voice = useVoiceInput()

let lastTranscript = ''

watch(() => voice.transcript.value, (val) => {
  if (val) {
    store.input = val
  }
})

watch(() => voice.isListening.value, (listening, wasListening) => {
  if (wasListening && !listening && store.input.trim() && store.input !== lastTranscript) {
    lastTranscript = store.input
    submit()
  }
})

function toggleVoice() {
  if (voice.isListening.value) {
    voice.stopListening()
  } else {
    voice.startListening()
  }
}

function submit() {
  if (!store.input.trim() || store.loading) return
  store.parseRoute(geo.coords.value, geo.locationContext.value)
}
</script>
