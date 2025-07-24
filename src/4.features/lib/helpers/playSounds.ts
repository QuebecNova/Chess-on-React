import { sounds } from 'src/6.shared/model'

export function playSoundOnEnd({
    win,
    draw,
    lose,
}: {
    win?: true
    draw?: true
    lose?: true
}): void {
    if (typeof Audio === 'undefined') return
    if (win) {
        sounds.win.play()
    }
    if (lose) {
        sounds.lose.play()
    }
    if (draw) {
        sounds.draw.play()
    }
}

export function playPlacedPieceSound(isCapture: boolean): void {
    if (typeof Audio === 'undefined') return
    if (isCapture) {
        sounds.takePiece.play()
        return
    } else sounds.placePiece.play()
}
