import type { PBImage } from './PBImage.js'

export type Color = `#${string}`

export interface PBCanvas {
  readonly width: number
  readonly height: number

  // Clear the canvas
  clear(): void

  // Set fill color for drawing
  setFillColor(red: number, green: number, blue: number, alpha: number): void

  // Set stroke color for drawing
  setStrokeColor(red: number, green: number, blue: number, alpha: number): void

  // Set line width for stroke
  setLineWidth(width: number): void

  // Path methods
  beginPath(): void
  moveTo(x: number, y: number): void
  lineTo(x: number, y: number): void
  stroke(): void
  fill(): void

  // Drawing shapes
  fillRect(x: number, y: number, width: number, height: number): void
  strokeRect(x: number, y: number, width: number, height: number): void
  clearRect(x: number, y: number, width: number, height: number): void

  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterClockwise: boolean
  ): void
  fillCircle(x: number, y: number, radius: number): void
  strokeCircle(x: number, y: number, radius: number): void

  // Image drawing
  drawImage(
    image: PBImage,
    x: number,
    y: number,
    width: number,
    height: number
  ): void

  // Text drawing
  // setFont(font: CGFont): void
  // setFontSize(size: number): void
  // fillText(text: String, x: number, y: number): void

  // Gradient methods
  // createLinearGradient(x0: number, y0: number, x1: number, y1: number, colors: Color[]) -> CGGradient?
  // createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number, colors: [CGColor]) -> CGGradient?

  // Transformation methods
  scale(sx: number, sy: number): void
  rotate(angle: number): void
  translate(tx: number, ty: number): void

  // Generate an image from the canvas data
  generateImage(): PBImage

  // Get the raw pixel data as Data
  getRawPixelData(): ArrayBuffer
}
