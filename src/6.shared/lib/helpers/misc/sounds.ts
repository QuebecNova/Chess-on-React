import placedPieceSound from 'public/assets/sounds/placePiece.wav'
import takePiece from 'public/assets/sounds/takePiece.wav'
import check from 'public/assets/sounds/check.wav'
import win from 'public/assets/sounds/win.wav'
import lose from 'public/assets/sounds/lose.wav'
import newGame from 'public/assets/sounds/newGame.wav'
import timeExpiring from 'public/assets/sounds/timeExpiring.wav'
import { KeyableAudio } from 'src/6.shared/model/Keyable'
import IPiece from 'src/5.entities/model/IPiece'

const sounds: KeyableAudio =
    typeof Audio === 'undefined'
        ? {}
        : {
              placePiece: new Audio(placedPieceSound),
              takePiece: new Audio(takePiece),
              check: new Audio(check),
              win: new Audio(win),
              lose: new Audio(lose),
              newGame: new Audio(newGame),
              timeExpiring: new Audio(timeExpiring),
          }

export function playSoundWhenMated(turn: string, variant: string): void {
    if (typeof Audio === 'undefined') return
    if (variant === 'white') {
        if (turn === 'Black') sounds.win.play()
        if (turn === 'White') sounds.lose.play()
    } else if (variant === 'black') {
        if (turn === 'White') sounds.win.play()
        if (turn === 'Black') sounds.lose.play()
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
