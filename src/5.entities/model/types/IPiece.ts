import { CastlingSide, Colors, Move, Pieces } from 'src/6.shared/model'
import { KeyableSquares } from './Keyable'
import { PlayedMove } from './Move'

export interface IPiece {
    readonly color: Colors
    readonly type: Pieces
    readonly img: React.FunctionComponent<React.SVGAttributes<SVGElement>>
    readonly side?: CastlingSide
    readonly lastMoves?: Move[]
    onCheck?: boolean
    canMove: (
        from: string,
        squareState: KeyableSquares,
        movesLeadsToCheck: KeyableSquares,
        initialState?: KeyableSquares,
        playedMoves?: PlayedMove[]
    ) => Array<string>
    addMove?: (move: Move) => Move[]
}
