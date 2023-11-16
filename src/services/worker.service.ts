import { Owner, createEffect, on, runWithOwner } from 'solid-js';
import { WorkerMessageData } from '../worker';
import useWindowSize from '../hooks/useWindowSize';
import { store } from '../store';

export type WorkerMethods = Awaited<ReturnType<typeof initializeRenderer>>;

// helper for type checking
function postMessageToWorker(worker: Worker, message: WorkerMessageData) {
	worker.postMessage(message);
}

function initWorker() {
	const worker = new Worker(new URL('./worker.ts', store.localUrl));

	worker.onmessage = function (event: MessageEvent) {
		//worker debugging
		console.log('msg from worker:', event.data);
	};
	return worker;
}

async function initializeRenderer(
	ids: string[],
	imageBitmaps: ImageBitmap[],
	canvases: OffscreenCanvas[],
	canvasWidth: number,
	canvasHeight: number,
	owner: Owner,
	speedMultiplierMap?: Record<string, number>,
	widthOffset: number = 2
) {
	const worker = initWorker();
	ids.forEach((id, index) => {
		worker.postMessage(
			{
				canvasId: id,
				offscreen: canvases[index],
				imageBitmap: imageBitmaps[index],
				canvasWidth,
				canvasHeight,
				widthOffset,
				speedMultiplier: speedMultiplierMap ? speedMultiplierMap[id] : 1,
				type: 'init'
			} as WorkerMessageData,
			[canvases[index], imageBitmaps[index]]
		);
	});

	return {
		startAutoScroll() {
			postMessageToWorker(worker, { type: 'start' });
			return this;
		},
		stopAutoScroll() {
			postMessageToWorker(worker, { type: 'stop' });
			return this;
		},
		updateCanvasState(id: string, imageX: number, imageCopyX: number) {
			postMessageToWorker(worker, { type: 'update', id, imageX, imageCopyX });
			return this;
		},
		setSpeed(speed: number) {
			postMessageToWorker(worker, { type: 'setSpeed', speed });
			return this;
		},
		setWidthOffset(widthOffset: number) {
			postMessageToWorker(worker, { type: 'setWidthOffset', widthOffset });
			return this;
		},
		setSize(width: number, height: number) {
			postMessageToWorker(worker, { type: 'setSize', width, height });
			return this;
		},
		closeTask() {
			worker.terminate();
			return this;
		},
		syncWithGlobalState() {
			return runWithOwner(owner, () => {
				const { baseHeight, baseWidth } = useWindowSize(owner);
				createEffect(on(() => store.scaledSpeed, s => this.setSpeed(s)));
				createEffect(on(baseWidth, width => this.setSize(width, baseHeight())));
				createEffect(on(baseHeight, height => this.setSize(baseWidth(), height)));
				createEffect(on(() => store.shouldUseWorker, should => should || this.closeTask()));
				return this;
			});
		}
	};
}

export const workerService = {
	initializeRenderer
};
