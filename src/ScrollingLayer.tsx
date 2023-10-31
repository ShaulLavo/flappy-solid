import { Index, createResource, createSignal } from 'solid-js'
import { ScrollingImage } from './ScrollingImage'
import { getImageUrls } from './cloudinary.service'
import useWindowSize from './hooks/useWindowSize'
import { preloadImages } from './image.service'

interface LayerProps {
	speedMultipliers: Record<string, number>
	fallbackText: string
}

const ScrollingLayer = ({ speedMultipliers, fallbackText }: LayerProps) => {
	const SPEED = 1
	const [speed] = createSignal(SPEED)

	const imageSpeedMap: Record<string, () => number> = {}
	for (const key in speedMultipliers) {
		imageSpeedMap[key] = () => speedMultipliers[key] * speed()
	}

	const { width, height } = useWindowSize(200)
	const [images] = createResource(() =>
		preloadImages(
			getImageUrls(Object.keys(speedMultipliers)).map(x => x.highQualityUrl)
		)
	)

	return (
		<Index fallback={<div>{fallbackText}</div>} each={images()}>
			{(image, i) => (
				<ScrollingImage
					height={height}
					width={width}
					image={image}
					speed={Object.values(imageSpeedMap)[i]}
					widthOffset={6}
				/>
			)}
		</Index>
	)
}

export function Background() {
	const speedMultipliers = {
		sky: 1,
		mountains: 2,
		trees: 2.75,
	}

	return (
		<ScrollingLayer
			speedMultipliers={speedMultipliers}
			fallbackText="No Background"
		/>
	)
}

export function Foreground() {
	const speedMultipliers = {
		ground: 3,
		grass: 3,
	}

	return (
		<ScrollingLayer
			speedMultipliers={speedMultipliers}
			fallbackText="No Foreground"
		/>
	)
}
