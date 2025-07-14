import { Colors } from "src/6.shared/model"

export class Player {
    readonly color: string
    timer: number
    isPlaying: boolean
    isCurrentUser: boolean
    wantsRestart: boolean
    
    constructor(
        color: Colors,
        isPlaying: boolean,
        isCurrentUser: boolean
    ) {
        this.color = color
        this.isPlaying = isPlaying
        this.timer = 60000
        this.isCurrentUser = isCurrentUser
        this.wantsRestart = false
    }
}
