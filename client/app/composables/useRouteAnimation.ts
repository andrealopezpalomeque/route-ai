import type { Ref } from 'vue'

interface StopPoint {
  x: number
  y: number
  label: string
}

const LABELS = [
  'Av. Belgrano & 9 de Julio',
  'Plaza principal',
  'San Martín 450',
]

const PHASE_DURATIONS = {
  INITIAL_PAUSE: 500,
  STOP_INTERVAL: 800,
  STOP_FADE_IN: 400,
  PULSE_RING: 600,
  LINE_DRAW: 600,
  LINE_DELAY: 400,
  FINAL_PULSE: 400,
  HOLD: 1200,
  FADE_OUT: 600,
} as const

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
}

function generateStopPositions(w: number, h: number): StopPoint[] {
  const padX = w * 0.15
  const padY = h * 0.2

  const basePositions = [
    { xRatio: 0.2, yRatio: 0.65 },
    { xRatio: 0.5, yRatio: 0.28 },
    { xRatio: 0.8, yRatio: 0.58 },
  ]

  return basePositions.map((pos, i) => {
    const jitterX = (Math.random() - 0.5) * w * 0.08
    const jitterY = (Math.random() - 0.5) * h * 0.08
    return {
      x: Math.max(padX, Math.min(w - padX, pos.xRatio * w + jitterX)),
      y: Math.max(padY, Math.min(h - padY, pos.yRatio * h + jitterY)),
      label: LABELS[i],
    }
  })
}

function getBezierPoint(
  p0: StopPoint,
  p1: StopPoint,
  controlOffset: number,
  t: number,
): { x: number; y: number } {
  const cx = (p0.x + p1.x) / 2 + controlOffset
  const cy = (p0.y + p1.y) / 2 - Math.abs(controlOffset) * 0.6
  const u = 1 - t
  return {
    x: u * u * p0.x + 2 * u * t * cx + t * t * p1.x,
    y: u * u * p0.y + 2 * u * t * cy + t * t * p1.y,
  }
}

export function useRouteAnimation(canvasRef: Ref<HTMLCanvasElement | null>) {
  let animId = 0
  let loopStart = 0
  let stops: StopPoint[] = []
  let dpr = 1

  function restart() {
    stops = []
    const canvas = canvasRef.value
    if (canvas) {
      stops = generateStopPositions(canvas.width / dpr, canvas.height / dpr)
    }
    loopStart = performance.now()
  }

  function drawDot(
    ctx: CanvasRenderingContext2D,
    stop: StopPoint,
    alpha: number,
    scale: number = 1,
  ) {
    const r = 8 * scale
    // Glow
    ctx.save()
    ctx.globalAlpha = alpha * 0.3
    const glow = ctx.createRadialGradient(stop.x, stop.y, 0, stop.x, stop.y, r * 3)
    glow.addColorStop(0, '#00ffb2')
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(stop.x, stop.y, r * 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // Dot
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = '#00ffb2'
    ctx.beginPath()
    ctx.arc(stop.x, stop.y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  function drawPulseRing(
    ctx: CanvasRenderingContext2D,
    stop: StopPoint,
    progress: number,
  ) {
    const maxRadius = 28
    const radius = 8 + (maxRadius - 8) * progress
    const alpha = 0.15 * (1 - progress)
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.strokeStyle = '#00ffb2'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(stop.x, stop.y, radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }

  function drawLabel(
    ctx: CanvasRenderingContext2D,
    stop: StopPoint,
    alpha: number,
  ) {
    ctx.save()
    ctx.globalAlpha = alpha * 0.7
    ctx.fillStyle = '#444444'
    ctx.font = '11px "Space Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText(stop.label, stop.x, stop.y + 22)
    ctx.restore()
  }

  function drawCurve(
    ctx: CanvasRenderingContext2D,
    from: StopPoint,
    to: StopPoint,
    progress: number,
    alpha: number,
    controlOffset: number,
  ) {
    if (progress <= 0) return
    const segments = 60
    const drawTo = Math.floor(segments * easeOutCubic(progress))

    ctx.save()
    ctx.globalAlpha = alpha * 0.6
    ctx.strokeStyle = '#00ffb2'
    ctx.lineWidth = 1.5
    ctx.lineCap = 'round'
    ctx.beginPath()

    const start = getBezierPoint(from, to, controlOffset, 0)
    ctx.moveTo(start.x, start.y)

    for (let i = 1; i <= drawTo; i++) {
      const t = i / segments
      const pt = getBezierPoint(from, to, controlOffset, t)
      ctx.lineTo(pt.x, pt.y)
    }
    ctx.stroke()
    ctx.restore()
  }

  function render(now: number) {
    const canvas = canvasRef.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width / dpr
    const h = canvas.height / dpr

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    if (stops.length < 3) {
      stops = generateStopPositions(w, h)
      loopStart = now
    }

    const elapsed = now - loopStart

    // Timeline markers (cumulative ms)
    const t_stopA = PHASE_DURATIONS.INITIAL_PAUSE
    const t_stopB = t_stopA + PHASE_DURATIONS.STOP_INTERVAL
    const t_stopC = t_stopB + PHASE_DURATIONS.STOP_INTERVAL
    const t_lineAB = t_stopC + 200
    const t_lineBC = t_lineAB + PHASE_DURATIONS.LINE_DRAW + PHASE_DURATIONS.LINE_DELAY
    const t_pulse = t_lineBC + PHASE_DURATIONS.LINE_DRAW + 200
    const t_hold = t_pulse + PHASE_DURATIONS.FINAL_PULSE + PHASE_DURATIONS.HOLD
    const t_fadeEnd = t_hold + PHASE_DURATIONS.FADE_OUT
    const totalDuration = t_fadeEnd + 300

    // Global fade-out multiplier
    let globalAlpha = 1
    if (elapsed > t_hold && elapsed <= t_fadeEnd) {
      globalAlpha = 1 - (elapsed - t_hold) / PHASE_DURATIONS.FADE_OUT
    } else if (elapsed > t_fadeEnd) {
      globalAlpha = 0
    }

    if (elapsed >= totalDuration) {
      restart()
      animId = requestAnimationFrame(render)
      return
    }

    // Draw each stop
    for (let i = 0; i < 3; i++) {
      const stopTime = i === 0 ? t_stopA : i === 1 ? t_stopB : t_stopC
      const stopElapsed = elapsed - stopTime
      if (stopElapsed < 0) continue

      // Fade-in
      const fadeIn = Math.min(1, stopElapsed / PHASE_DURATIONS.STOP_FADE_IN)
      const alpha = easeOutCubic(fadeIn) * globalAlpha

      // Final pulse
      let scale = 1
      if (elapsed >= t_pulse && elapsed < t_pulse + PHASE_DURATIONS.FINAL_PULSE) {
        const pulseT = (elapsed - t_pulse) / PHASE_DURATIONS.FINAL_PULSE
        scale = 1 + 0.15 * Math.sin(pulseT * Math.PI)
      }

      // Pulse ring on appear
      if (stopElapsed < PHASE_DURATIONS.PULSE_RING) {
        const ringProgress = stopElapsed / PHASE_DURATIONS.PULSE_RING
        drawPulseRing(ctx, stops[i], ringProgress)
      }

      drawDot(ctx, stops[i], alpha, scale)
      drawLabel(ctx, stops[i], alpha)
    }

    // Line A→B
    const lineABElapsed = elapsed - t_lineAB
    if (lineABElapsed > 0) {
      const progress = Math.min(1, lineABElapsed / PHASE_DURATIONS.LINE_DRAW)
      drawCurve(ctx, stops[0], stops[1], progress, globalAlpha, -30)
    }

    // Line B→C
    const lineBCElapsed = elapsed - t_lineBC
    if (lineBCElapsed > 0) {
      const progress = Math.min(1, lineBCElapsed / PHASE_DURATIONS.LINE_DRAW)
      drawCurve(ctx, stops[1], stops[2], progress, globalAlpha, 25)
    }

    animId = requestAnimationFrame(render)
  }

  function handleResize() {
    const canvas = canvasRef.value
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return

    dpr = window.devicePixelRatio || 1
    const rect = parent.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    // Regenerate positions for new size
    stops = generateStopPositions(rect.width, rect.height)
  }

  let resizeObserver: ResizeObserver | null = null

  function start() {
    const canvas = canvasRef.value
    if (!canvas) return

    handleResize()

    resizeObserver = new ResizeObserver(() => {
      handleResize()
    })
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement)
    }

    restart()
    animId = requestAnimationFrame(render)
  }

  function stop() {
    cancelAnimationFrame(animId)
    resizeObserver?.disconnect()
    resizeObserver = null
  }

  return { start, stop, restart }
}
