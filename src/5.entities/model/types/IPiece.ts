import { CastlingSide, Colors, Move, Moves, Pieces } from 'src/6.shared/model'
import { KeyableSquares } from './Keyable'
import { PlayedMove, Premove } from './Move'

export interface IPiece {
    readonly color: Colors
    readonly type: Pieces
    readonly img: React.FunctionComponent<React.SVGAttributes<SVGElement>>
    readonly side?: CastlingSide
    readonly canEnpassantOn?: Moves
    readonly lastMoves?: Move[]
    readonly canCastleTo?: CastlingSide[]

    onCheck?: boolean
    canMove: (
        from: string,
        squareState: KeyableSquares,
        movesLeadsToCheck: KeyableSquares,
        initialState?: KeyableSquares,
        playedMoves?: PlayedMove[]
    ) => Array<string>
    getRawMoves(
        from: string,
        color?: Colors,
        squareState?: KeyableSquares,
        premoves?: Premove[]
    ): string[]
    isMoveValid?: (
        move: string,
        index?: number,
        premoves?: Premove[],
        field?: string
    ) => boolean
    addMove?: (move: Move) => Move[]
}
