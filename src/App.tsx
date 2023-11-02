import { Index, createResource, createSignal } from 'solid-js'
import './App.css'
import { ScrollingPipe } from './components/ScrollingImage'
import { Background, Foreground } from './components/ScrollingLayer'
import { getImageUrls } from './services/cloudinary.service'
import useWindowSize from './hooks/useWindowSize'
import { preloadImages } from './services/image.service'
function getBrowserName() {
	const userAgent = navigator.userAgent
	const browserRegex = /(Opera|OPR|Edg|Chrome|Safari|Firefox|MSIE|Trident)\//i
	const matches = userAgent.match(browserRegex)

	if (!matches) return 'unknown'

	const browser = matches[1]

	switch (browser) {
		case 'Opera':
		case 'OPR':
			return 'Opera'
		case 'Edg':
			return 'Edge'
		case 'Chrome':
			return userAgent.includes('Safari') ? 'Safari' : 'Chrome'
		case 'Safari':
			return 'Safari'
		case 'Firefox':
			return 'Firefox'
		case 'MSIE':
		case 'Trident':
			return 'IE'
		default:
			return browser
	}
}

//TODO: move to a global file or store maybe
//globals
export const shouldUseWorker = true
// const shouldUseWorker = getBrowserName() === 'Firefox'

function App() {
	const { scaleX, scaleY, baseWidth, baseHeight, width, height } =
		useWindowSize()

	const numberToPixels = (n: number) => String(Math.ceil(n)) + 'px'

	return (
		<div
			style={{
				transform: `scaleX(${scaleX()}) scaleY(${scaleY()})`,
				width: numberToPixels(baseWidth()),
				height: numberToPixels(baseHeight()),
				position: 'absolute',
				top: numberToPixels((height() - baseHeight()) / 2),
				left: numberToPixels((width() - baseWidth()) / 2), // center the canvas
			}}
		>
			<Background />
			<Pipes />
			<Foreground />
		</div>
	)
}
export default App
type Constraints = {
	minDistance: number
	maxDistance?: number
	minUp: number
	maxUp: number
	minDown: number
	maxDown: number
}

function generateRandomValues({
	minDistance,
	maxDistance,
	minUp,
	maxUp,
	minDown,
	maxDown,
}: Constraints): [number, number] {
	const randomUp = Math.random() * (maxUp - minUp) + minUp
	let adjustedMinDown = Math.max(minDown, randomUp + minDistance)
	const randomDown =
		Math.random() * (maxDown - adjustedMinDown) + adjustedMinDown

	if (maxDistance && randomDown - randomUp > maxDistance) {
		return generateRandomValues({
			minDistance,
			maxDistance,
			minUp,
			maxUp,
			minDown,
			maxDown,
		})
	}

	return [randomUp, randomDown]
}
function getScaledImageDimensions(
	canvasWidth: number,
	canvasHeight: number,
	originalImageWidth: number = 784,
	originalImageHeight: number = 1463,
	originalCanvasWidth: number = 6400,
	originalCanvasHeight: number = 3600
): { scaledWidth: number; scaledHeight: number } {
	const scalingFactorWidth = canvasWidth / originalCanvasWidth
	const scalingFactorHeight = canvasHeight / originalCanvasHeight

	return {
		scaledWidth: originalImageWidth * scalingFactorWidth,
		scaledHeight: originalImageHeight * scalingFactorHeight,
	}
}

function Pipes() {
	const { width, height } = useWindowSize()
	const yConstraints = {
		minDistance: 120,
		maxUp: height() - height() / 3,
		minUp: height() / 3,
		maxDown: 0,
		minDown: 0,
	} as const

	const [images] = createResource(() =>
		preloadImages(getImageUrls(['pipe']).map(x => x.highQualityUrl))
	)
	const [yOffset, setYOffset] = createSignal(generateRandomValues(yConstraints))
	const getOffset = (i: number) => () => yOffset()[i]
	const onEndReached = () => {
		setYOffset(generateRandomValues(yConstraints))
	}

	const scaledDimensions = () => getScaledImageDimensions(width(), height())
	return (
		<div class="canvas-container">
			<Index each={images()}>
				{(image, i) => (
					<ScrollingPipe
						height={() => scaledDimensions().scaledHeight}
						width={() => scaledDimensions().scaledWidth}
						image={image}
						speed={() => 3}
						yOffset={getOffset(i)}
						onEndReached={onEndReached}
					/>
				)}
			</Index>
		</div>
	)
}
