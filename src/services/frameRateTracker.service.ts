export function initializeFrameRateTracker(sampleSize: number = 20) {
	let frameTimes = Array(sampleSize).fill(0)
	let currentIndex = 0
	let totalTime = 0
	let frameCount = 0
	let previousTimestamp = performance.now()
	const commonRates = [0, 10, 12, 15, 20, 30, 60, 90, 120, 144, 240]
	const totalRates = commonRates.length

	function reset() {
		frameCount = totalTime = currentIndex = 0
		previousTimestamp = performance.now()
		frameTimes.fill(0)
	}

	function tick() {
		const now = performance.now()
		totalTime -= frameTimes[currentIndex]
		totalTime += frameTimes[currentIndex] = now - previousTimestamp
		currentIndex = (currentIndex + 1) % sampleSize
		frameCount++
		previousTimestamp = now
	}

	function getFPS() {
		return frameCount > sampleSize ? 1000 / (totalTime / sampleSize) : 0
	}

	function getStandardRate() {
		const fps = getFPS()
		let rate = commonRates[totalRates - 1]
		for (let i = 0; i < totalRates; i++) {
			if (fps <= commonRates[i]) {
				rate = commonRates[i]
				break
			}
		}
		return rate
	}

	function getDroppedFrames() {
		const rate = getStandardRate()
		return Math.round((totalTime - sampleSize * (1000 / rate)) / (1000 / rate))
	}

	return {
		tick,
		reset,
		get FPS() {
			return getFPS()
		},
		get standardRate() {
			return getStandardRate()
		},
		get droppedFrames() {
			return getDroppedFrames()
		}
	}
}
