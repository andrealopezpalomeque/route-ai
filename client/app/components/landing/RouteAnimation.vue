<template>
  <div class="h-full w-full" @click="handleTap" @touchend.prevent="handleTap">
    <canvas ref="canvasEl" class="block h-full w-full" />
  </div>
</template>

<script setup lang="ts">
const canvasEl = ref<HTMLCanvasElement | null>(null)
const { start, stop, restart } = useRouteAnimation(canvasEl)

function handleTap() {
  restart()
}

onMounted(() => {
  start()
})

onUnmounted(() => {
  stop()
})
</script>
