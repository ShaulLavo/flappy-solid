import { Owner, createEffect, createSignal, onCleanup, runWithOwner } from 'solid-js'
import { setStore } from '../store'
function useWindowSize(owner?: Owner, callback?: { (width: number, height: number): unknown }) {
	const [width, setWidth] = createSignal(window.innerWidth)
	const [height, setHeight] = createSignal(window.innerHeight)
	const [prevWidth, setPrevWidth] = createSignal<number>(null!)
	const [prevHeight, setPrevHeight] = createSignal<number>(null!)
	const [baseWidth] = createSignal(width())
	const [baseHeight] = createSignal(height())
	createEffect(() => {
		setStore('scaleX', width() / baseWidth())
		setStore('scaleY', height() / baseHeight())
	})
	const handleResize = () => {
		setPrevWidth(width())
		setPrevHeight(height())
		setWidth(window.innerWidth)
		setHeight(window.innerHeight)
		callback?.(window.innerWidth, window.innerHeight)
	}

	window.addEventListener('resize', handleResize)

	if (owner) {
		runWithOwner(
			owner,
			onCleanup(() => {
				window.removeEventListener('resize', handleResize)
			})
		)
	} else {
		onCleanup(() => {
			window.removeEventListener('resize', handleResize)
		})
	}

	return {
		width,
		height,
		prevWidth,
		prevHeight,
		baseWidth,
		baseHeight
	}
}

export default useWindowSize
