// Thanks to RobG https://stackoverflow.com/questions/9763441/milliseconds-to-time-in-javascript/9763479
const renderNum = (n: number, len: number) => {
	let str = n.toString()
	while (str.length < len) {
		str = '0' + str
	}
	return `${str.substring(0,len)}`
}

const renderMillis = (n: number) => {
	return ~~(n/100)
}

export const render = (s: number) =>  {
	const ms = s % 1000
	s = (s - ms) / 1000
	const secs = s % 60
	s = (s - secs) / 60
	const mins = s % 60
	const hrs = (s - mins) / 60

	return renderNum(mins,2 ) + ':' + renderNum(secs,2) + '.' + renderMillis(ms)
}