import { Colors, sounds } from 'src/6.shared/model'

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

export function playPlacedPieceSound(isCapture: boolean): void {
    if (typeof Audio === 'undefined') return
    if (isCapture) {
        sounds.takePiece.play()
        return
    } else sounds.placePiece.play()
}
