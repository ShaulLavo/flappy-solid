//globals.ts

import { createSignal } from 'solid-js'
import { getBrowserName } from './services/utils'

// global constants
export const localUrl = import.meta.url

// global state
export const [shouldUseWorker, setShouldUseWorker] = createSignal(
	!(getBrowserName() === 'Firefox')
)
export const [speed, setSpeed] = createSignal(1)
