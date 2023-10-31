import { onCleanup } from 'solid-js'

type FrameCallbackArgs = {
	time: number
	delta: number
	timeSinceStart: number
}

type FrameCallback = (args: FrameCallbackArgs) => void

const frameEntries: {
	callback: FrameCallback
	timingHelper: (time: number) => TimingInfo
}[] = []

let animationFrameId: number | null = null

const animateShared = (time: number) => {
	frameEntries.forEach(entry => {
		const timingHelperResult = entry.timingHelper(time)
		entry.callback({
			time,
			delta: timingHelperResult[0],
			timeSinceStart: timingHelperResult[1],
		})
	})
	animationFrameId = requestAnimationFrame(animateShared)
}

function useFrame(callback: FrameCallback): void {
	const timingHelper = createTimingHelper()

	frameEntries.push({ callback, timingHelper })

	if (animationFrameId === null) {
		animationFrameId = requestAnimationFrame(animateShared)
	}

	onCleanup(() => {
		const index = frameEntries.findIndex(entry => entry.callback === callback)
		if (index > -1) {
			frameEntries.splice(index, 1)
		}

		if (frameEntries.length === 0 && animationFrameId !== null) {
			cancelAnimationFrame(animationFrameId)
			animationFrameId = null
		}
	})
}

type TimingInfo = [number, number]

function createTimingHelper(): (currentTime: number) => TimingInfo {
	let startTime: number | null = null
	let lastTime: number | null = null

	return (currentTime: number): TimingInfo => {
		if (startTime === null) startTime = currentTime
		if (lastTime === null) lastTime = currentTime

		const deltaTime = currentTime - lastTime
		const timeSinceStart = currentTime - startTime

		lastTime = currentTime

		return [deltaTime, timeSinceStart]
	}
}

export default useFrame
