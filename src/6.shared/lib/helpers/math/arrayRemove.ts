function arrayRemove(
    arr: Array<string | number>,
    value: string | number
): Array<string | number> {
    return arr.filter(function (ele) {
        return ele !== value
    })
}

export default arrayRemove
