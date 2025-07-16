import { IPiece, KeyableSquares } from 'src/5.entities/model'

export class Piece implements IPiece {
    readonly color: string
    readonly img: React.FunctionComponent<React.SVGAttributes<SVGElement>>
    readonly type: string

    constructor(
        color: string,
        img: React.FunctionComponent<React.SVGAttributes<SVGElement>>,
        type: string
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
