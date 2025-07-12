import check from 'public/assets/sounds/check.wav'
import lose from 'public/assets/sounds/lose.wav'
import newGame from 'public/assets/sounds/newGame.wav'
import placedPieceSound from 'public/assets/sounds/placePiece.wav'
import takePiece from 'public/assets/sounds/takePiece.wav'
import timeExpiring from 'public/assets/sounds/timeExpiring.wav'
import win from 'public/assets/sounds/win.wav'
import { KeyableAudio } from 'src/6.shared/model/types/Keyable'

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

export default sounds
