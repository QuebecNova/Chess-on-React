import IPiece from 'src/5.entities/model/types/IPiece'
import { Colors } from 'src/6.shared/model/constants/board'
import sounds from '../../../model/constants/sounds'

export function playSoundWhenMated(turn: string, variant: string): void {
    if (typeof Audio === 'undefined') return
    if (variant === Colors.White) {
        if (turn === Colors.Black) sounds.win.play()
        if (turn === Colors.White) sounds.lose.play()
    } else if (variant === Colors.Black) {
        if (turn === Colors.White) sounds.win.play()
        if (turn === Colors.Black) sounds.lose.play()
    }
}

export function playPlacedPieceSound(
    takedPiece?: IPiece,
    empassanted?: boolean
) {
    if (typeof Audio === 'undefined') return
    if (takedPiece || empassanted) {
        sounds.takePiece.play()
        return
    } else sounds.placePiece.play()
}

export default sounds
