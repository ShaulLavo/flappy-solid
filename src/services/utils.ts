function getBrowserName() {
	const userAgent = navigator.userAgent
	const browserRegex = /(Opera|OPR|Edg|Chrome|Safari|Firefox|MSIE|Trident)\//i
	const matches = userAgent.match(browserRegex)

	if (!matches) return 'unknown'

	const browser = matches[1]

	switch (browser) {
		case 'Opera':
		case 'OPR':
			return 'Opera'
		case 'Edg':
			return 'Edge'
		case 'Chrome':
			return userAgent.includes('Safari') ? 'Safari' : 'Chrome'
		case 'Safari':
			return 'Safari'
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
