import { Accessor, createSignal, onMount } from 'solid-js'
import useFrame from './hooks/useFrame'
import useWindowSize from './hooks/useWindowSize'

export function ScrollingImage({
	width,
	height,
	image,
	speed,
	widthOffset,
}: {
	width: Accessor<number>
	height: Accessor<number>
	image: Accessor<HTMLImageElement>
	speed: () => number
	widthOffset?: number
}) {
	let canvas: HTMLCanvasElement = null!
	onMount(async () => {
		const ctx = canvas.getContext('2d')!
		const [imageX, setImageX] = createSignal(0)
		const [imageCopyX, setImageCopyX] = createSignal(width())

		const updatePosition = (
			current: () => number,
			other: () => number,
			set: (x: number) => void
		) => {
			const newX = current() - speed()
			set(newX)
			if (newX + width() < 0) {
				set(other() + width())
			}
		}

		useFrame(() => {
			updatePosition(imageX, imageCopyX, setImageX)
			updatePosition(imageCopyX, imageX, setImageCopyX)
			ctx.clearRect(0, 0, width(), height())
			ctx.drawImage(image(), imageX(), 0, width(), height())
			ctx.drawImage(
				image(),
				imageCopyX(),
				0,
				widthOffset ? width() + widthOffset : width(),
				height()
			)
		})
	})
	return (
		<div class="canvas-container">
			<canvas ref={canvas} width={width()} height={height()} />
		</div>
	)
}

export function ScrollingPipe({
	width,
	height,
	image,
	speed,
	onEndReached,
	yOffset,
}: {
	width: Accessor<number>
	height: Accessor<number>
	image: Accessor<HTMLImageElement>
	speed: () => number
	onEndReached?: () => unknown
	yOffset?: () => number
	xOffset?: () => number
}) {
	let canvas: HTMLCanvasElement = null!
	const { width: canvasWidth, height: canvasHeight } = useWindowSize(200)

	onMount(() => {
		const ctx = canvas.getContext('2d')!
		const [imageX, setImageX] = createSignal(canvasWidth())
		const [imageCopyX, setImageCopyX] = createSignal(width())

		const updatePosition = (
			current: () => number,
			other: () => number,
			set: (x: number) => void
		) => {
			const newX = current() - speed()
			set(newX)
			if (newX + canvasWidth() < 0) {
				set(other() + canvasWidth())
				onEndReached?.()
			}
		}

		useFrame(() => {
			updatePosition(imageX, imageCopyX, setImageX)
			updatePosition(imageCopyX, imageX, setImageCopyX)
			ctx.clearRect(0, 0, canvasWidth(), canvasHeight())
			ctx.drawImage(
				image(),
				imageX(),
				yOffset ? yOffset() : 0,
				width(),
				height()
			)
			ctx.drawImage(
				image(),
				imageCopyX(),
				yOffset ? yOffset() : 0,
				width(),
				height()
			)
		})
	})
	return (
		<div class="canvas-container">
			<canvas ref={canvas} width={canvasWidth()} height={canvasHeight()} />
		</div>
	)
}
