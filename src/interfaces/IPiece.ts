import { keyableSquares } from "./keyable"

export default interface IPiece {
    color: string,
    type: string,
    img: React.FunctionComponent<React.SVGAttributes<SVGElement>>
    lastMoves?: Array<string>
    onCheck?: boolean
    canMove: 
        (
        from: string, 
        squareState: keyableSquares, 
        movesLeadsToCheck: keyableSquares, 
        initialState?: keyableSquares
        ) => Array<string>
}