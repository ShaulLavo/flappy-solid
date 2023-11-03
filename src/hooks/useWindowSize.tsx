import { onCleanup, createSignal } from 'solid-js'
function useWindowSize(callback?: {
	(width: number, height: number): unknown
}) {
	const [width, setWidth] = createSignal(window.innerWidth)
	const [height, setHeight] = createSignal(window.innerHeight)
	const [prevWidth, setPrevWidth] = createSignal<number>(null!)
	const [prevHeight, setPrevHeight] = createSignal<number>(null!)
	const [baseWidth] = createSignal(width())
	const [baseHeight] = createSignal(height())
	const scaleX = () => width() / baseWidth()
	const scaleY = () => height() / baseHeight()
	const handleResize = () => {
		setPrevWidth(width())
		setPrevHeight(height())
		setWidth(window.innerWidth)
		setHeight(window.innerHeight)
		callback?.(window.innerWidth, window.innerHeight)
	}

	window.addEventListener('resize', handleResize)

	onCleanup(() => {
		window.removeEventListener('resize', handleResize)
	})

	return {
		width,
		height,
		prevWidth,
		prevHeight,
		baseWidth,
		baseHeight,
		scaleX,
		scaleY,
	}
}

export default useWindowSize
