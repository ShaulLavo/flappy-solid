import { Owner, onCleanup, runWithOwner } from 'solid-js'
import { initializeFrameRateTracker } from '../services/frameRateTracker.service'
type FrameCallbackArgs = {
	time: number
	delta: number
	// timeSinceStart: number
	FPS: number
}

type FrameCallback = (args: FrameCallbackArgs) => void

const frameCallbacksSet: Set<{
	callback: FrameCallback
	timingHelper: (time: number) => TimingInfo
}> = new Set()

let animationFrameId: number | null = null

const animateShared = (time: number) => {
	frameCallbacksSet.forEach(entry => {
		const timingHelper = entry.timingHelper(time)
		entry.callback({
			time,
			delta: timingHelper.delta,
			FPS: timingHelper.frameRateTracker.FPS
		})
		timingHelper.frameRateTracker.tick()
	})

	if (frameCallbacksSet.size > 0) {
		requestAnimationFrame(animateShared)
	} else animationFrameId = null
}
type CleanUpFunction = () => void
function useFrame(callback: FrameCallback): CleanUpFunction {
	const timingHelper = createTimingHelper()

	const entry = { callback, timingHelper }
	frameCallbacksSet.add(entry)

	if (!animationFrameId) {
		animationFrameId = requestAnimationFrame(animateShared)
	}

	return () => {
		frameCallbacksSet.delete(entry)

		if (frameCallbacksSet.size === 0 && animationFrameId !== null) {
			cancelAnimationFrame(animationFrameId)
			animationFrameId = null
		}
	}
}

type TimingInfo = {
	delta: number
	totalElapsedTime: number
	frameRateTracker: ReturnType<typeof initializeFrameRateTracker>
}

function createTimingHelper(): (currentTime: number) => TimingInfo {
	let startTime: number | null = null
	let lastTime: number | null = null
	const frameRateTracker = initializeFrameRateTracker()
	return (currentTime: number): TimingInfo => {
		if (startTime === null) startTime = currentTime
		if (lastTime === null) lastTime = currentTime

		const delta = currentTime - (lastTime ?? 0)
		const totalElapsedTime = currentTime - (startTime ?? 0)

		lastTime = currentTime

		return { delta, totalElapsedTime, frameRateTracker }
	}
}

export default useFrame
