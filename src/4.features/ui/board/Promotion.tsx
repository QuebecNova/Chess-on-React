'use client'

import { ReactElement } from 'react'
import { useGameStore } from 'src/4.features/model/providers'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { Bishop, Knight, Queen, Rook } from 'src/5.entities/lib'
import { IPiece, KeyablePieceOnField } from 'src/5.entities/model'
import { Colors } from 'src/6.shared/model'

type Props = {
    fieldWidth: number
}

export default function Promotion(props: Props): ReactElement {
    const squares = useGameStore((state) => state.squares)
    const turn = useGameStore((state) => state.turn)
    const promotedField = useGameStore((state) => state.promotedField)
    const dispatch = useGameStore((state) => state.dispatch)

    const turnReversed = turn === Colors.Black ? Colors.White : Colors.Black

    const queen = new Queen(turnReversed)
    const knight = new Knight(turnReversed)
    const bishop = new Bishop(turnReversed)
    const rook = new Rook(turnReversed)

    function transformPiece(piece: IPiece): void {
        //TEST
        const pieceOnField: KeyablePieceOnField = {
            [promotedField]: piece,
        }

        dispatch({
            type: GameActionTypes.SQUARES,
            payload: {
                squares: {
                    ...squares,
                    ...pieceOnField,
                },
            },
        })

        dispatch({
            type: GameActionTypes.PROMOTED_FIELD,
            payload: { promotedField: null },
        })
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
