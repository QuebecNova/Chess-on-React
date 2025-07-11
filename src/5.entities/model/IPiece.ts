import { KeyableSquares } from './Keyable'

export default interface IPiece {
    color: string
    type: string
    img: React.FunctionComponent<React.SVGAttributes<SVGElement>>
    lastMoves?: Array<string>
    onCheck?: boolean
    canMove: (
        from: string,
        squareState: KeyableSquares,
        movesLeadsToCheck: KeyableSquares,
        initialState?: KeyableSquares
    ) => Array<string>
}
