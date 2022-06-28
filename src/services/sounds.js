import placedPieceSound from '../sounds/placePiece.wav'
import takePiece from '../sounds/takePiece.wav'
import check from '../sounds/check.wav'
import win from '../sounds/win.wav'
import lose from '../sounds/lose.wav'
import newGame from '../sounds/newGame.wav'

const sounds = {
    placePiece: new Audio(placedPieceSound),
    takePiece: new Audio(takePiece),
    check: new Audio(check),
    win: new Audio(win),
    lose: new Audio(lose),
    newGame: new Audio(newGame)
}

export default sounds