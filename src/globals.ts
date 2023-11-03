//globals.ts

import { createSignal } from 'solid-js'
import { getBrowserName } from './services/utils'

export const [shouldUseWorker, setShouldUseWorker] = createSignal(
	!(getBrowserName() === 'Firefox')
)
export const [speed, setSpeed] = createSignal(1)
export const localUrl = import.meta.url
