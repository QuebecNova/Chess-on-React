import { Colors } from 'src/6.shared/model'
import { Player } from '../player'

export type Players = {
    [Colors.Black]: Player
    [Colors.White]: Player
}
