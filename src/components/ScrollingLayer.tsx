import {
	Index,
	Suspense,
	createEffect,
	createResource,
	createSignal,
	getOwner,
	on,
	onCleanup,
	runWithOwner
} from 'solid-js'
import { getImageUrls } from '../services/cloudinary.service'
import { preloadBitmaps, preloadImages } from '../services/image.service'
import { workerService } from '../services/worker.service'
import { ScrollingImage, ScrollingImageProps } from './ScrollingImage'
import useFrame from '../hooks/useFrame'
import useWindowSize from '../hooks/useWindowSize'
import { store } from '../store'

interface LayerProps {
	speedMultiplierMap: Record<string, number>
	fallbackText: string
}

const ScrollingLayer = ({ speedMultiplierMap, fallbackText }: LayerProps) => {
	const { baseWidth, baseHeight } = useWindowSize(getOwner()!)
	const imageNames = Object.keys(speedMultiplierMap)
	console.log('imageNames', imageNames)
	const [images, { refetch }] = createResource<ImageBitmap[] | HTMLImageElement[]>(() => {
		const urls = getImageUrls(imageNames).map(x => x.highQualityUrl)
		return store.shouldUseWorker ? preloadBitmaps(urls) : preloadImages(urls)
	})

	const [offScreens, setOffScreens] = createSignal<OffscreenCanvas[]>([])
	createEffect(on(() => store.shouldUseWorker, refetch))

	if (store.shouldUseWorker) {
		const owner = getOwner()!
		let cleanUp: () => void
		runWithOwner(owner, () =>
			createEffect(
				on(offScreens, async canvases => {
					console.log('using worker')
					console.log('offScreens', offScreens())
					console.log('images', images())
					if (!images()) return
					const workerMethods = await workerService.initializeRenderer(
						imageNames,
						images() as ImageBitmap[],
						canvases,
						baseWidth(),
						baseHeight(),
						getOwner()!,
						speedMultiplierMap
					)
					workerMethods.syncWithGlobalState()
					if (store.shouldSyncWorkers) {
						const updatePosition = (
							current: number,
							other: number,
							delta: number,
							speedMultiplier: number
						) => {
							const newX = current - 100 * ((delta / 1000) * speedMultiplier * store.scaledSpeed)
							if (newX + baseWidth() < 0) {
								return other + baseWidth()
							}
							return newX
						}
						console.log('syncing workers')
						let imageX = 0
						let imageCopyX = baseWidth()
						console.log('getOwner()', owner)
						cleanUp = useFrame(({ delta }) => {
							imageNames.forEach(name => {
								updatePosition(imageX, imageCopyX, delta, speedMultiplierMap[name])
								updatePosition(imageCopyX, imageX, delta, speedMultiplierMap[name])

								workerMethods.updateCanvasState(name, imageX, imageCopyX)
							})
						})
						onCleanup(cleanUp)
					} else workerMethods.startAutoScroll()
				})
			)
		)
	}

	return (
		<Suspense fallback={<div>Loading..</div>}>
			<Index fallback={<div>{fallbackText}</div>} each={images()}>
				{(image, i) => {
					const props = {
						image: image,
						speedMultiplier: Object.values(speedMultiplierMap)[i],
						widthOffset: 6
					} as ScrollingImageProps
					if (store.shouldUseWorker) props.offscreenSetter = setOffScreens

					return <ScrollingImage {...props} />
				}}
			</Index>
		</Suspense>
	)
}

export function Background() {
	const speedMultiplierMap = {
		sky: 1,
		mountains: 2,
		trees: 2.75
	}

	return <ScrollingLayer speedMultiplierMap={speedMultiplierMap} fallbackText='No Background' />
}

export function Foreground() {
	const speedMultiplierMap = {
		ground: 3,
		grass: 3
	}

	return <ScrollingLayer speedMultiplierMap={speedMultiplierMap} fallbackText='No Foreground' />
}
