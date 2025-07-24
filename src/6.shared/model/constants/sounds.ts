import check from 'public/assets/sounds/check.wav'
import draw from 'public/assets/sounds/draw.wav'
import lose from 'public/assets/sounds/lose.wav'
import newGame from 'public/assets/sounds/newGame2.wav'
import placedPieceSound from 'public/assets/sounds/placePiece.wav'
import takePiece from 'public/assets/sounds/takePiece.wav'
import timeExpiring from 'public/assets/sounds/timeExpiring.wav'
import win from 'public/assets/sounds/win.wav'
import { KeyableAudio } from 'src/6.shared/model'

export const sounds: KeyableAudio =
    typeof Audio === 'undefined'
        ? {}
        : ({
              placePiece: new Audio(placedPieceSound),
              takePiece: new Audio(takePiece),
              check: new Audio(check),
              win: new Audio(win),
              draw: new Audio(draw),
              lose: new Audio(lose),
              newGame: new Audio(newGame),
              timeExpiring: new Audio(timeExpiring),
          } as const)
