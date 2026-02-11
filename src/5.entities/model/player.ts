import { Colors } from 'src/6.shared/model'
import { Premove } from './types/Move'

export class Player {
    readonly color: Colors
    timer: number
    isPlaying: boolean
    isCurrentUser: boolean
    wantsRestart: boolean
    premoves: Premove[]

    constructor(color: Colors, isPlaying: boolean, isCurrentUser: boolean) {
        this.color = color
        this.isPlaying = isPlaying
        this.timer = 300000
        this.isCurrentUser = isCurrentUser
        this.wantsRestart = false
        this.premoves = []
    }
}
