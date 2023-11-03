import {
	Index,
	Suspense,
	createReaction,
	createResource,
	createSignal,
} from 'solid-js'
import { shouldUseWorker, speed } from '../globals'
import useWindowSize from '../hooks/useWindowSize'
import { getImageUrls } from '../services/cloudinary.service'
import { preloadBitmaps, preloadImages } from '../services/image.service'
import { createWorkerTask } from '../services/worker.service'
import { ScrollingImage, ScrollingImageProps } from './ScrollingImage'

interface LayerProps {
	imageSpeedMap: Record<string, () => number>
	fallbackText: string
}

const ScrollingLayer = ({ imageSpeedMap, fallbackText }: LayerProps) => {
	const { width, height } = useWindowSize()

	const imageNames = Object.keys(imageSpeedMap)
	const [images] = createResource<ImageBitmap[] | HTMLImageElement[]>(() => {
		const urls = getImageUrls(imageNames).map(x => x.highQualityUrl)
		return shouldUseWorker() ? preloadBitmaps(urls) : preloadImages(urls)
	})

	//TODO: find better way to handle worker
	const [canvases, setCanvases] = shouldUseWorker()
		? createSignal<OffscreenCanvas[]>([])
		: [null!, null!]

	const track = shouldUseWorker()
		? createReaction(() =>
				createWorkerTask(
					imageNames,
					images() as ImageBitmap[],
					canvases(),
					width(),
					height()
				)
		  )
		: null!
	track?.(() => canvases?.())

	return (
		<Suspense fallback={<div>Loading..</div>}>
			<Index fallback={<div>{fallbackText}</div>} each={images()}>
				{(image, i) => {
					const props = {
						image: image,
						speed: Object.values(imageSpeedMap)[i],
						widthOffset: 6,
					} as ScrollingImageProps
					if (shouldUseWorker()) props.offscreenSetter = setCanvases

					return <ScrollingImage {...props} />
				}}
			</Index>
		</Suspense>
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
