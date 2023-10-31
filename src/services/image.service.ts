const preloadImage = async (url: string): Promise<HTMLImageElement> => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
};

const preloadImages = async (imageUrls: string[]): Promise<HTMLImageElement[]> => {
    const preloadedImages: HTMLImageElement[] = [];
    for (const url of imageUrls) {
        const img = await preloadImage(url);
        preloadedImages.push(img);
    }

    return (await Promise.all(preloadedImages));

};


export { preloadImage, preloadImages };