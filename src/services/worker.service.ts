import { localUrl } from '../globals'

export async function createWorkerTask(
	ids: string[],
	imageBitmaps: ImageBitmap[],
	canvases: OffscreenCanvas[],
	canvasWidth: number,
	canvasHeight: number
): Promise<void> {
	try {
		const worker = new Worker(new URL('./worker.ts', localUrl))
		console.log(ids, canvases, imageBitmaps, canvasWidth, canvasHeight)
		ids.forEach((id, index) => {
			worker.postMessage(
				{
					canvasId: id,
					offscreen: canvases[index],
					imageBitmap: imageBitmaps[index],
					canvasWidth,
					canvasHeight,
					type: 'init',
				},
				[canvases[index], imageBitmaps[index]]
			)
		})

		worker.postMessage({ type: 'start' })
		worker.onmessage = function (event: MessageEvent) {
			console.log(event.data)
		}
	} catch (error) {
		console.error(error)
	}
}
