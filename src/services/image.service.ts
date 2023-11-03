const preloadImage = async (url: string): Promise<HTMLImageElement> => {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new Image()
		img.crossOrigin = 'anonymous'

		img.src = url
		img.width = window.innerWidth
		img.height = window.innerHeight
		img.onload = () => resolve(img)
		img.onerror = reject
	})
}

const preloadImages = async (
	imageUrls: string[]
): Promise<HTMLImageElement[]> => {
	const preloadedImages: HTMLImageElement[] = []
	for (const url of imageUrls) {
		const img = await preloadImage(url)
		preloadedImages.push(img)
	}

	return await Promise.all(preloadedImages)
}

export const preloadBitmaps = async (
	imageUrls: string[]
): Promise<ImageBitmap[]> => {
	const images = await preloadImages(imageUrls)
	const bitmaps = await Promise.all(
		images!.map(async image => await createImageBitmap(image))
	)
	return bitmaps
}

export { preloadImage, preloadImages }
