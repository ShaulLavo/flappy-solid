import { Cloudinary } from '@cloudinary/url-gen'
import { blur } from '@cloudinary/url-gen/actions/effect'
import { fill, scale } from '@cloudinary/url-gen/actions/resize'
const cld = new Cloudinary({
	cloud: {
		cloudName: 'dp7akzaod',
	},
	url: {
		secure: true,
	},
})

function getCld() {
	return cld
}

interface ImageData {
	highQualityUrl: string
	lqipUrl: string
}
const getImageUrl = (imageId: string, width?: number, height?: number) => {
	console.log(width, height)
	const highQualityUrl = cld.image(imageId).quality('auto').format('auto')

	if (height) highQualityUrl.resize(fill(undefined, height.toFixed(0)))
	if (width) highQualityUrl.resize(fill(undefined, width.toFixed(0)))
	if (width && height)
		highQualityUrl.resize(scale(width.toFixed(0), height.toFixed(0)))

	const lqipUrl = cld
		.image(imageId)
		.resize(scale(50))
		.quality('auto:low')
		.effect(blur(1000))
		.toURL()
	return {
		highQualityUrl: highQualityUrl.toURL(),
		lqipUrl,
	}
}

const getImageUrls = (
	imageIds: string[],
	width?: number,
	height?: number
): ImageData[] => {
	console.log(imageIds.map(imageId => getImageUrl(imageId, width, height)))
	return imageIds.map(imageId => getImageUrl(imageId, width, height))
}

export { getCld, getImageUrl, getImageUrls }
export type { ImageData }
