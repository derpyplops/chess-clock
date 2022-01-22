// Thanks to RobG https://stackoverflow.com/questions/9763441/milliseconds-to-time-in-javascript/9763479
const renderNum = (n, len) => {
    let str = n.toString()
    while (str.length < len) {
        str = '0' + str
    }
    return str
}

export const renderMillis = (s: number) =>  {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return renderNum(hrs, 2) + ':' + renderNum(mins,2 ) + ':' + renderNum(secs,2) + '.' + renderNum(ms,3);
}