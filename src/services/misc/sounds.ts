import placedPieceSound from '../../assets/sounds/placePiece.wav'
import takePiece from '../../assets/sounds/takePiece.wav'
import check from '../../assets/sounds/check.wav'
import win from '../../assets/sounds/win.wav'
import lose from '../../assets/sounds/lose.wav'
import newGame from '../../assets/sounds/newGame.wav'
import timeExpiring from '../../assets/sounds/timeExpiring.wav'
import { keyableAudio } from '../../interfaces/keyable'
import IPiece from '../../interfaces/IPiece'

const sounds : keyableAudio = {
    placePiece: new Audio(placedPieceSound),
    takePiece: new Audio(takePiece),
    check: new Audio(check),
    win: new Audio(win),
    lose: new Audio(lose),
    newGame: new Audio(newGame),
    timeExpiring: new Audio(timeExpiring)
}

export function playSoundWhenMated(turn : string, variant : string) : void {

    if (variant === 'white') {
        if (turn === 'Black') sounds.win.play()
        if (turn === 'White') sounds.lose.play()
    } else if (variant === 'black') {
        if (turn === 'White') sounds.win.play()
        if (turn === 'Black') sounds.lose.play()
    }
}

export function playPlacedPieceSound(takedPiece? : IPiece, empassanted? : boolean) {
    if (takedPiece || empassanted) {
        sounds.takePiece.play()
        return
    } else
    
    sounds.placePiece.play()
}

export default sounds