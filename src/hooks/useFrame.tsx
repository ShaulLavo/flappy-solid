import { onCleanup } from 'solid-js'

type FrameCallbackArgs = {
	time: number
	delta: number
	timeSinceStart: number
}

type FrameCallback = (args: FrameCallbackArgs) => void

const frameEntries: Set<{
	callback: FrameCallback
	timingHelper: (time: number) => TimingInfo
}> = new Set()

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

	// Continue the loop only if we have entries
	if (frameEntries.size > 0) {
		requestAnimationFrame(animateShared)
	} else animationFrameId = null
}

function useFrame(callback: FrameCallback): void {
	const timingHelper = createTimingHelper()

	const entry = { callback, timingHelper }
	frameEntries.add(entry)

	if (!animationFrameId) {
		animationFrameId = requestAnimationFrame(animateShared)
	}

	onCleanup(() => {
		frameEntries.delete(entry)

		if (frameEntries.size === 0 && animationFrameId !== null) {
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

		const deltaTime = currentTime - (lastTime ?? 0)
		const timeSinceStart = currentTime - (startTime ?? 0)

		lastTime = currentTime

		return [deltaTime, timeSinceStart]
	}
}

export default useFrame
