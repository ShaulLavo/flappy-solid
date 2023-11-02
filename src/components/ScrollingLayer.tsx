import { Index, createResource, createSignal, onMount } from 'solid-js'
import { ScrollingImage, ScrollingImageProps } from './ScrollingImage'
import { getImageUrls } from '../services/cloudinary.service'
import { preloadImages } from '../services/image.service'
import { shouldUseWorker } from '../App'

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

	const [images] = createResource(() =>
		preloadImages(
			getImageUrls(Object.keys(speedMultipliers)).map(x => x.highQualityUrl)
		)
	)

	const canvases: OffscreenCanvas[] = []

	onMount(() => {
		if (!shouldUseWorker) return
	})

	return (
		<Index fallback={<div>{fallbackText}</div>} each={images()}>
			{(image, i) => {
				// Construct props inside the loop to have access to image and i
				const props = {
					image: image, // or just "image," if using ES6 property shorthand
					speed: Object.values(imageSpeedMap)[i],
					widthOffset: 6,
				} as ScrollingImageProps
				if (shouldUseWorker) props.offscreen = canvases[i]
				// Pass props to ScrollingImage
				return <ScrollingImage {...props} />
			}}
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
