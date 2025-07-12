import { Dispatch, ReactElement, SetStateAction, useContext } from 'react'
import { boardContext } from 'src/3.widgets/ui/Board'
import { Bishop, Knight, Queen, Rook } from 'src/5.entities/lib/figures'
import IPiece from 'src/5.entities/model/types/IPiece'
import { Colors } from 'src/6.shared/model/constants/board'

type Props = {
    promotedField: string
    setPromotedField: Dispatch<SetStateAction<string>>
    fieldWidth: number
}

export default function Promotion(props: Props): ReactElement {
    const { promotedField, setPromotedField } = props

    const app = useContext(boardContext)

    const turnReversed = app.turn === Colors.Black ? Colors.White : Colors.Black

    const queen = new Queen(turnReversed)
    const knight = new Knight(turnReversed)
    const bishop = new Bishop(turnReversed)
    const rook = new Rook(turnReversed)

    function transformPiece(piece: IPiece): void {
        app.squares[promotedField] = piece

        const pieceOnField = {
            [promotedField]: piece,
        }

        app.setSquares((squares) => ({
            ...squares,
            ...pieceOnField,
        }))

        setPromotedField(null)
    }

    return (
        <div
            className={`board__promotion ${
                promotedField ? 'active' : 'inactive'
            }`}
        >
            <p>Choose one type of piece</p>
            <div className="board__promotion-pieces-wrapper">
                {[queen, knight, bishop, rook].map((piece) => {
                    const Svg = piece.img
                    return (
                        <div
                            className="board__promotion-pieceBlock"
                            onClick={() => transformPiece(piece)}
                            key={piece.type}
                            style={{ width: props.fieldWidth }}
                        >
                            <Svg />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
