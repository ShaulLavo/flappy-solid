import { Index, createResource, createSignal, onMount } from 'solid-js'
import { ScrollingImage, ScrollingImageProps } from './ScrollingImage'
import { getImageUrls } from '../services/cloudinary.service'
import { preloadImages } from '../services/image.service'
import { shouldUseWorker, speed } from '../App'

interface LayerProps {
	imageSpeedMap: Record<string, () => number>
	fallbackText: string
}

const ScrollingLayer = ({ imageSpeedMap, fallbackText }: LayerProps) => {
	const length = Object.keys(imageSpeedMap).length
	const [images] = createResource(() =>
		preloadImages(
			getImageUrls(Object.keys(imageSpeedMap)).map(x => x.highQualityUrl)
		)
	)
	const canvases: OffscreenCanvas[] = shouldUseWorker
		? new Array(length).fill(null)
		: undefined!

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
	const imageSpeedMap = {
		sky: () => 1 * speed(),
		mountains: () => 2 * speed(),
		trees: () => 2.75 * speed(),
	}

	return (
		<ScrollingLayer
			imageSpeedMap={imageSpeedMap}
			fallbackText="No Background"
		/>
	)
}

export function Foreground() {
	const imageSpeedMap = {
		ground: () => 3 * speed(),
		grass: () => 3 * speed(),
	}

	return (
		<ScrollingLayer
			imageSpeedMap={imageSpeedMap}
			fallbackText="No Foreground"
		/>
	)
}
