import { createIntersectionObserver } from '@solid-primitives/intersection-observer'
import {
	Index,
	createEffect,
	createMemo,
	createResource,
	createSignal,
} from 'solid-js'
import './App.css'
import { getImageUrls } from './cloudinary.service'
import useFrame from './hooks/useFrame'
import useWindowSize from './hooks/useWindowSize'
import { preloadImages } from './image.service'
import h from 'solid-js/h'
function App() {
	return <Background></Background>
}

function scaleImage(screenWidth: number, screenHeight: number) {
	const aspectRatio =
		screenWidth >= screenHeight
			? screenWidth / screenHeight
			: screenHeight / screenWidth
	let width, height

	const potentialHeightByWidth = screenWidth / aspectRatio
	const potentialWidthByHeight = screenHeight / aspectRatio

	if (potentialHeightByWidth >= screenHeight) {
		console.log(1)
		width = screenWidth
		height = potentialHeightByWidth
	} else {
		console.log(2)
		width = potentialWidthByHeight
		height = screenHeight
	}
	console.log(Math.ceil(width), Math.ceil(height))
	return [Math.ceil(width), Math.ceil(height)]
}

export default App

const imageUrls = [
	'background-0_zlb2j9',
	'background-1_s97zje',
	'background-2_bgacqd',
	'background-3_h60wyd',
]

function* getNextElement(elements: any[]) {
	let index = 0
	while (true) {
		yield elements[index]
		index = (index + 1) % imageUrls.length
	}
}

function Background() {
	const { width, height } = useWindowSize()
	const [images, { mutate: setImages, refetch: refetchImages }] =
		createResource(() =>
			preloadImages(
				getImageUrls(imageUrls, width(), height()).map(i => i.highQualityUrl)
			)
		)
	createEffect(() => {
		width(), height()
		refetchImages()
	})
	const imageGenerator = getNextElement(images()!)

	const [left, setLeft] = createSignal(0)

	const [targets, setTargets] = createSignal<Element[]>([])

	let target = 0
	// useFrame(() => {
	// 	if (left() < target) {
	// 		const newBackgroundImages = backgroundImageNames().slice(2)
	// 		newBackgroundImages.push(imageGenerator.next().value!)
	// 		newBackgroundImages.push(imageGenerator.next().value!)

	// 		setBackgroundImageNames(newBackgroundImages)
	// 		target -= width() / 4
	// 	}
	// 	setLeft(l => l - 10)
	// })

	return (
		<div class="scroll">
			<div
				style={{
					top: '0px',
				}}
				class="scroll-inner"
			>
				<Index each={images()}>{img => img()}</Index>
			</div>
		</div>
	)
}
