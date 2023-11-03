import { Index, createResource, createSignal } from 'solid-js'
import useWindowSize from '../hooks/useWindowSize'
import { getImageUrls } from '../services/cloudinary.service'
import { preloadImages } from '../services/image.service'
import { ScrollingPipe } from './ScrollingImage'

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

export function Pipes() {
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
