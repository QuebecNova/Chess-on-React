import { IPiece, KeyableSquares } from 'src/5.entities/model'
import { Colors, Pieces } from 'src/6.shared/model'

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
}
