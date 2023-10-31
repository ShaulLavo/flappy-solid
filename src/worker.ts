// Define a custom type for the message event data
interface WorkerEventData {
    canvas: OffscreenCanvas;
    image: HTMLImageElement;
}

self.onmessage = async function (event: MessageEvent<WorkerEventData>) {
    const offscreenCanvas = event.data.canvas;
    const image = event.data.image;
    const ctx = offscreenCanvas.getContext("2d")!;

    // Draw the image onto the OffscreenCanvas
    ctx.drawImage(image, 0, 0);

    // Send the rendered OffscreenCanvas back to the main thread
    self.postMessage({ bitmap: offscreenCanvas.transferToImageBitmap() });
};
