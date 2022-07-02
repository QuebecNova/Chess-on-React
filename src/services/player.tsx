class Player {
    readonly color : string
    timer : number
    isPlaying : boolean

    constructor(color : string, timer : number, isPlaying : boolean) {
        this.color = color
        this.isPlaying = isPlaying
        this.timer = timer
    }
}

export default Player