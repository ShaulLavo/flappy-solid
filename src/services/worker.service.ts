import { localUrl } from '../globals'
import useWindowSize from '../hooks/useWindowSize'
import { WorkerMessageData } from '../worker'

export type WorkerMethods = Awaited<ReturnType<typeof initializeRenderer>>

const { baseHeight, baseWidth } = useWindowSize()

// helper for type checking
function postMessageToWorker(worker: Worker, message: WorkerMessageData) {
	worker.postMessage(message)
}

function initWorker() {
	const worker = new Worker(new URL('./worker.ts', localUrl))

	worker.onmessage = function (event: MessageEvent) {
		//worker debugging
		console.log('msg from worker:', event.data)
	}
	return worker
}

async function initializeRenderer(
	ids: string[],
	imageBitmaps: ImageBitmap[],
	canvases: OffscreenCanvas[],
	speedMap?: Record<string, () => number>,
	canvasWidth: number = baseHeight(),
	canvasHeight: number = baseWidth(),
	widthOffset: number = 2
) {
	const worker = initWorker()
	ids.forEach((id, index) => {
		worker.postMessage(
			{
				// canvasId: id,
				offscreen: canvases[index],
				imageBitmap: imageBitmaps[index],
				canvasWidth,
				canvasHeight,
				widthOffset,
				speedMultiplier: speedMap ? speedMap[id]() : 1,
				type: 'init',
			} as WorkerMessageData,
			[canvases[index], imageBitmaps[index]]
		)
	})

	return {
		startAutoScroll() {
			postMessageToWorker(worker, { type: 'start' })
		},
		stopAutoScroll() {
			postMessageToWorker(worker, { type: 'stop' })
		},
		setSpeed(speed: number) {
			postMessageToWorker(worker, { type: 'setSpeed', speed })
		},
		updateCanvasState(id: string, imageX: number, imageCopyX: number) {
			postMessageToWorker(worker, { type: 'update', id, imageX, imageCopyX })
		},
		setWidthOffset(widthOffset: number) {
			postMessageToWorker(worker, { type: 'setWidthOffset', widthOffset })
		},
		setSize(width: number, height: number) {
			postMessageToWorker(worker, { type: 'setSize', width, height })
		},
	}
}

export const workerService = {
	initializeRenderer,
}
