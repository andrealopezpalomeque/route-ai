import { createCanvas } from 'canvas'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function generateIcon(size) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')
  const scale = size / 512

  // Background with rounded corners
  const radius = 80 * scale
  ctx.fillStyle = '#0a0a0f'
  ctx.beginPath()
  ctx.moveTo(radius, 0)
  ctx.lineTo(size - radius, 0)
  ctx.quadraticCurveTo(size, 0, size, radius)
  ctx.lineTo(size, size - radius)
  ctx.quadraticCurveTo(size, size, size - radius, size)
  ctx.lineTo(radius, size)
  ctx.quadraticCurveTo(0, size, 0, size - radius)
  ctx.lineTo(0, radius)
  ctx.quadraticCurveTo(0, 0, radius, 0)
  ctx.closePath()
  ctx.fill()

  // Curved path connecting the three stops
  ctx.strokeStyle = '#00ffb2'
  ctx.lineWidth = 4 * scale
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  const x1 = 130 * scale, y1 = 370 * scale  // bottom-left (origin)
  const x2 = 256 * scale, y2 = 160 * scale  // top-center (mid stop)
  const x3 = 382 * scale, y3 = 370 * scale  // bottom-right (destination)

  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.quadraticCurveTo(170 * scale, 220 * scale, x2, y2)
  ctx.quadraticCurveTo(340 * scale, 220 * scale, x3, y3)
  ctx.stroke()

  // Draw stop circles
  const stops = [
    { x: x1, y: y1, r: 20 * scale, pulse: 34 * scale },  // origin — larger pulse
    { x: x2, y: y2, r: 14 * scale, pulse: 24 * scale },   // mid stop
    { x: x3, y: y3, r: 20 * scale, pulse: 34 * scale },   // destination — larger pulse
  ]

  for (const stop of stops) {
    // Pulse ring
    ctx.beginPath()
    ctx.arc(stop.x, stop.y, stop.pulse, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0, 255, 178, 0.12)'
    ctx.fill()

    // Solid circle
    ctx.beginPath()
    ctx.arc(stop.x, stop.y, stop.r, 0, Math.PI * 2)
    ctx.fillStyle = '#00ffb2'
    ctx.fill()

    // Inner dark dot
    ctx.beginPath()
    ctx.arc(stop.x, stop.y, stop.r * 0.4, 0, Math.PI * 2)
    ctx.fillStyle = '#0a0a0f'
    ctx.fill()
  }

  return canvas.toBuffer('image/png')
}

const outDir = resolve(__dirname, '..', 'client', 'public')

for (const size of [192, 512]) {
  const buf = generateIcon(size)
  const path = resolve(outDir, `icon-${size}.png`)
  writeFileSync(path, buf)
  console.log(`Generated ${path} (${buf.length} bytes)`)
}
