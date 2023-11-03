function getBrowserName() {
	const userAgent = navigator.userAgent
	const browserRegex = /(Opera|OPR|Edg|Chrome|Safari|Firefox|MSIE|Trident)\//i
	const matches = userAgent.match(browserRegex)

	if (!matches) return 'unknown'

	let browser = matches[1]

	if (browser === 'Chrome') {
		if (userAgent.includes('Edg')) {
			browser = 'Edge'
		} else if (userAgent.includes('Safari') && !userAgent.includes('Edg')) {
			browser = 'Chrome'
		}
	}

	switch (browser) {
		case 'Opera':
		case 'OPR':
			return 'Opera'
		case 'Safari':
			return userAgent.includes('Chrome') ? 'Chrome' : 'Safari'
		case 'Firefox':
			return 'Firefox'
		case 'MSIE':
		case 'Trident':
			return 'IE'
		default:
			return browser
	}
}
const numberToPixels = (n: number) => String(Math.ceil(n)) + 'px'

export { getBrowserName, numberToPixels }
