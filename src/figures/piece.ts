import { keyableBoolean, keyableSquares } from "../interfaces/keyable";

export default class Piece {
    readonly color: string;
    readonly img: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    readonly type: string;

    constructor(color : string, img : React.FunctionComponent<React.SVGAttributes<SVGElement>>, type : string) {
        this.color = color
        this.img = img
        this.type = type
    }
    canMove(from : string, squareState : keyableSquares, movesLeadsToCheck : keyableBoolean, initialState? : keyableSquares) : Array<string> | Error{
        if (from || squareState || movesLeadsToCheck) throw new Error('missing arguments')
        const moves = []
        return moves
    }
}