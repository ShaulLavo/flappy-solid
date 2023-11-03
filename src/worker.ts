//TODO find better wat to do exhaustive checksF

interface StartMessage {
	type: 'start'

	canvasId?: never
	offscreen?: never
	imageBitmap?: never
	canvasWidth?: never
	canvasHeight?: never
	buffer?: never
	speedMultiplier?: never
	speed?: never
	imageX?: never
	imageCopyX?: never
	widthOffset?: never
	width?: never
	height?: never
}

interface InitMessage {
	type: 'init'
	canvasId: string
	offscreen: OffscreenCanvas
	imageBitmap: ImageBitmap
	canvasWidth: number
	canvasHeight: number
	buffer?: SharedArrayBuffer | ArrayBuffer
	widthOffset: number
	speedMultiplier: number

	speed?: never
	imageX?: never
	imageCopyX?: never
	width?: never
	height?: never
}

interface SetSpeedMessage {
	type: 'setSpeed'
	speed: number

	canvasId?: never
	offscreen?: never
	imageBitmap?: never
	canvasWidth?: never
	canvasHeight?: never
	buffer?: never
	widthOffset?: never
	speedMultiplier?: never
	imageX?: never
	imageCopyX?: never
	width?: never
	height?: never
}

interface UpdateMessage {
	type: 'update'
	id: string
	imageX: number
	imageCopyX: number

	canvasId?: never
	offscreen?: never
	imageBitmap?: never
	canvasWidth?: never
	canvasHeight?: never
	buffer?: never
	widthOffset?: never
	speedMultiplier?: never
	width?: never
	height?: never
	speed?: never
}
interface SetWidthOffsetMessage {
	type: 'setWidthOffset'
	widthOffset: number

	canvasId?: never
	offscreen?: never
	imageBitmap?: never
	canvasWidth?: never
	canvasHeight?: never
	buffer?: never
	speedMultiplier?: never
	width?: never
	height?: never
	speed?: never
	imageX?: never
	imageCopyX?: never
}
interface SetSizeMessage {
	type: 'setSize'
	width: number
	height: number

	canvasId?: never
	offscreen?: never
	imageBitmap?: never
	canvasWidth?: never
	canvasHeight?: never
	buffer?: never
	speedMultiplier?: never
	speed?: never
	imageX?: never
	imageCopyX?: never
	widthOffset?: never
}
interface StopMessage {
	type: 'stop'

	canvasId?: never
	offscreen?: never
	imageBitmap?: never
	canvasWidth?: never
	canvasHeight?: never
	buffer?: never
	speedMultiplier?: never
	speed?: never
	imageX?: never
	imageCopyX?: never
	widthOffset?: never
	width?: never
	height?: never
}

export type WorkerMessageData =
	| StartMessage
	| InitMessage
	| SetSpeedMessage
	| UpdateMessage
	| SetWidthOffsetMessage
	| SetSizeMessage
	| StopMessage

type CanvasContext = {
	offscreen: OffscreenCanvas
	imageBitmap: ImageBitmap
	context: OffscreenCanvasRenderingContext2D
	speedMultiplier: number
	imageX: number
	imageCopyX: number
}

function updatePosition(
	current: number,
	other: number,
	delta: number,
	speedMultiplier: number
) {
	const newX = current - 100 * ((delta / 1000) * speed * speedMultiplier)
	if (newX + width < 0) {
		return other + width
	}
	return newX
}

function animate(currentTime: number, shouldLoop: boolean = true) {
	let delta = currentTime - prevTime

	Object.keys(canvasMap).forEach(id => {
		const { context, imageBitmap, speedMultiplier } = canvasMap[id]
		canvasMap[id].imageX = updatePosition(
			canvasMap[id].imageX,
			canvasMap[id].imageCopyX,
			delta,
			speedMultiplier
		)
		canvasMap[id].imageCopyX = updatePosition(
			canvasMap[id].imageCopyX,
			canvasMap[id].imageX,
			delta,
			speedMultiplier
		)
		context.clearRect(0, 0, width, height)
		context.drawImage(
			imageBitmap,
			canvasMap[id].imageX,
			0,
			width + widthOffset,
			height
		)
		context.drawImage(
			imageBitmap,
			canvasMap[id].imageCopyX,
			0,
			width + widthOffset,
			height
		)
	})

	prevTime = currentTime

	if (shouldLoop) animationFrameId = requestAnimationFrame(animate)
}

const canvasMap: Record<string, CanvasContext> = {}

let height: number
let width: number
let widthOffset: number
let speed = 1

let animationFrameId: number = null!

let prevTime = 0

self.onmessage = function (event: MessageEvent<WorkerMessageData>) {
	try {
		const { type } = event.data

		if (type === 'init') {
			const {
				canvasId,
				offscreen,
				imageBitmap,
				canvasHeight,
				canvasWidth,
				speedMultiplier,
			} = event.data
			const ctx = offscreen.getContext('2d')!
			canvasMap[canvasId] = {
				offscreen: offscreen,
				imageBitmap: imageBitmap,
				context: ctx,
				speedMultiplier,
				imageX: 0,
				imageCopyX: canvasWidth,
			}
			height = canvasHeight
			width = canvasWidth
			widthOffset = event.data.widthOffset
			ctx.drawImage(imageBitmap, 0, 0, width, height)
			ctx.drawImage(imageBitmap, width, 0, width, height)
		}

		if (type === 'start') animationFrameId = requestAnimationFrame(animate)
		if (type === 'stop' && animationFrameId) {
			cancelAnimationFrame(animationFrameId)
			animationFrameId = null!
		}
		if (type === 'setSpeed') {
			speed = event.data.speed
		}
		if (type === 'setWidthOffset') {
			widthOffset = event.data.widthOffset
		}
		if (type === 'setSize') {
			height = event.data.height
			width = event.data.width
		}
		if (type === 'update') {
			const { id, imageX, imageCopyX } = event.data
			canvasMap[id].imageX = imageX
			canvasMap[id].imageCopyX = imageCopyX
			animate(performance.now(), false)
		}
	} catch (err) {
		err instanceof Error && self.postMessage({ message: err.message })
	}
}
