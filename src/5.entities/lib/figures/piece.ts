import { IPiece, KeyableSquares, Premove } from 'src/5.entities/model'
import { Colors, Pieces } from 'src/6.shared/model'
import { alphs } from '../alphabetPositions'

export class Piece implements IPiece {
    readonly color: Colors
    readonly img: React.FunctionComponent<React.SVGAttributes<SVGElement>>
    readonly type: Pieces

    constructor(
        color: Colors,
        img: React.FunctionComponent<React.SVGAttributes<SVGElement>>,
        type: Pieces
    ) {
        this.color = color
        this.img = img
        this.type = type
    }

    canMove(
        from: string,
        squareState: KeyableSquares,
        movesLeadsToCheck: KeyableSquares
    ): Array<string> {
        if (from || squareState || movesLeadsToCheck)
            throw new Error('missing arguments')
        const moves = []
        return moves
    }

    getRawMoves(
        from: string,
        color?: Colors,
        squareState?: KeyableSquares,
        premoves?: Premove[]
    ): string[] {
        return []
    }

    isMoveValid(move: string, index?: number) {
        const num = alphs.getNum(move)

        return move && !move[2] && num > 0 && num < 9
    }

    static filterInvalidMoves(
        moves: string[],
        piece: IPiece,
        premoves?: Premove[],
        field?: string
    ) {
        if (piece.type === Pieces.Pawn) {
            console.log(moves)
        }
        return moves.filter((move, index) =>
            piece.isMoveValid(move, index, premoves, field)
        )
    }
}
