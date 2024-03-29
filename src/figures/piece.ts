import IPiece from '../types/IPiece'
import { keyableSquares } from '../types/keyable'

export default class Piece implements IPiece {
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
        squareState: keyableSquares,
        movesLeadsToCheck: keyableSquares
    ): Array<string> {
        if (from || squareState || movesLeadsToCheck)
            throw new Error('missing arguments')
        const moves = []
        return moves
    }
}
