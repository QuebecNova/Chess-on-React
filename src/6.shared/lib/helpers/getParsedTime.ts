export const getParsedTime = (countDown: number): number[] => {
    let hours = Math.floor(
        (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
    if (hours < 0) hours = 0

    let minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))
    if (minutes < 0) minutes = 0

    let seconds = Math.floor((countDown % (1000 * 60)) / 1000)
    if (seconds < 0) seconds = 0

    return [hours, minutes, seconds]
}
