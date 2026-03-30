<template>
  <div class="hero-headline">
    <h1 class="sr-only">{{ line1 }} {{ line2 }}</h1>
    <svg
      ref="svgEl"
      class="hero-headline__svg"
      viewBox="0 0 750 230"
      aria-hidden="true"
    >
      <text
        ref="line1El"
        class="hero-headline__text"
        :class="{ 'hero-headline__text--animate': animating }"
        x="375"
        y="85"
        text-anchor="middle"
      >{{ line1 }}</text>
      <text
        ref="line2El"
        class="hero-headline__text hero-headline__text--second"
        :class="{ 'hero-headline__text--animate': animating }"
        x="375"
        y="195"
        text-anchor="middle"
      >{{ line2 }}</text>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  line1: string
  line2: string
}>()

const emit = defineEmits<{
  complete: []
}>()

const svgEl = ref<SVGSVGElement | null>(null)
const line1El = ref<SVGTextElement | null>(null)
const line2El = ref<SVGTextElement | null>(null)
const animating = ref(false)

function measurePathLength(el: SVGTextElement): number {
  try {
    return (el as unknown as SVGGeometryElement).getTotalLength()
  } catch {
    return el.getComputedTextLength() * 4
  }
}

onMounted(() => {
  const measure = () => {
    nextTick(() => {
      const svg = svgEl.value
      const el1 = line1El.value
      const el2 = line2El.value
      if (!svg || !el1 || !el2) return

    // Tighten viewBox to actual text bounds (text is invisible at this point)
    const b1 = el1.getBBox()
    const b2 = el2.getBBox()
    const minX = Math.min(b1.x, b2.x)
    const minY = Math.min(b1.y, b2.y)
    const maxX = Math.max(b1.x + b1.width, b2.x + b2.width)
    const maxY = Math.max(b1.y + b1.height, b2.y + b2.height)
    const pad = 10
    svg.setAttribute('viewBox',
      `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`)

    // Set dash lengths for stroke animation
    const len1 = measurePathLength(el1)
    const len2 = measurePathLength(el2)
    el1.style.setProperty('--dash', String(len1))
    el2.style.setProperty('--dash', String(len2))

    // Double rAF ensures dash values are painted before animation starts
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animating.value = true
      })
    })

    // line2: 150ms delay + 1.8s stroke + 0.4s fill = 2.35s
    setTimeout(() => emit('complete'), 2400)
  })
  }

  if (document.fonts?.ready) {
    document.fonts.ready.then(measure)
  } else {
    measure()
  }
})
</script>
