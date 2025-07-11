class Player {
    readonly color: string
    timer: number
    isPlaying: boolean
    isYou: boolean

    constructor(
        color: string,
        timer: number,
        isPlaying: boolean,
        isYou: boolean
    ) {
        this.color = color
        this.isPlaying = isPlaying
        this.timer = timer
        this.isYou = isYou
    }
}

export default Player
