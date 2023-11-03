import { onCleanup } from 'solid-js'

type FrameCallbackArgs = {
	time: number
	delta: number
	timeSinceStart: number
	FPS: number
}

type FrameCallback = (args: FrameCallbackArgs) => void

const frameEntries: Set<{
	callback: FrameCallback
	timingHelper: (time: number) => TimingInfo
}> = new Set()

let animationFrameId: number | null = null

const animateShared = (time: number) => {
	frameEntries.forEach(entry => {
		const [delta, timeSinceStart, frameRate] = entry.timingHelper(time)
		frameRate.tick = 1
		entry.callback({
			time,
			delta,
			timeSinceStart,
			FPS: frameRate.FPS,
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

type TimingInfo = [number, number, ReturnType<typeof FrameRate>]

function createTimingHelper(): (currentTime: number) => TimingInfo {
	let startTime: number | null = null
	let lastTime: number | null = null
	const fRate = FrameRate()
	return (currentTime: number): TimingInfo => {
		if (startTime === null) startTime = currentTime
		if (lastTime === null) lastTime = currentTime

		const deltaTime = currentTime - (lastTime ?? 0)
		const timeSinceStart = currentTime - (startTime ?? 0)

		lastTime = currentTime

		return [deltaTime, timeSinceStart, fRate]
	}
}

function FrameRate(samples = 20) {
	const times: number[] = []
	let s = samples
	while (s--) {
		times.push(0)
	}
	let head = 0,
		total = 0,
		frame = 0,
		previousNow = 0,
		rate = 0,
		dropped = 0
	const rates = [0, 10, 12, 15, 20, 30, 60, 90, 120, 144, 240]
	const rateSet = rates.length
	const API = {
		sampleCount: samples,
		reset() {
			frame = total = head = 0
			previousNow = performance.now()
			times.fill(0)
		},
		set tick(_: number) {
			const now = performance.now()
			total -= times[head]
			total += times[head++] = now - previousNow
			head %= samples
			frame++
			previousNow = now
		},
		get rate() {
			return frame > samples ? 1000 / (total / samples) : 1
		},
		get FPS() {
			let r = API.rate,
				rr = r | 0,
				i = 0
			while (i < rateSet && rr > rates[i]) {
				i++
			}
			rate = rates[i]
			dropped = Math.round((total - samples * (1000 / rate)) / (1000 / rate))
			return rate
		},
		get dropped() {
			return dropped
		},
	}
	return API
}

export default useFrame
