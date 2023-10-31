import { onCleanup, createSignal } from 'solid-js'
import debounce from 'just-debounce-it'
function useWindowSize(
	wait: number = 0,
	callback?: {
		(width: number, height: number): unknown
	}
) {
	const [width, setWidth] = createSignal(window.innerWidth)
	const [height, setHeight] = createSignal(window.innerHeight)
	const [prevWidth, setPrevWidth] = createSignal<number>(null!)
	const [prevHeight, setPrevHeight] = createSignal<number>(null!)

	const handleResize = debounce(() => {
		setPrevWidth(width())
		setPrevHeight(height())
		setWidth(window.innerWidth)
		setHeight(window.innerHeight)
		callback?.(window.innerWidth, window.innerHeight)
	}, wait)

	window.addEventListener('resize', handleResize)

	onCleanup(() => {
		window.removeEventListener('resize', handleResize)
	})

	return { width, height, prevWidth, prevHeight }
}

export default useWindowSize
