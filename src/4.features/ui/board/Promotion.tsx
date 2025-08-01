'use client'

import { ReactElement } from 'react'
import { useGameStore } from 'src/4.features/model/providers'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { Bishop, Knight, Queen, Rook } from 'src/5.entities/lib'
import { IPiece } from 'src/5.entities/model'

type Props = {
    fieldWidth: number
}

export default function Promotion(props: Props): ReactElement {
    const squares = useGameStore((state) => state.squares)
    const turn = useGameStore((state) => state.turn)
    const variant = useGameStore((state) => state.variant)
    const promotionMove = useGameStore((state) => state.promotionMove)
    const dispatch = useGameStore((state) => state.dispatch)
    const players = useGameStore((state) => state.players)

    const color = promotionMove?.premove ? variant : turn

    const queen = new Queen(color)
    const knight = new Knight(color)
    const bishop = new Bishop(color)
    const rook = new Rook(color)

    function transformPiece(piece: IPiece): void {
        console.log(piece)
        if (!promotionMove) return
        if (promotionMove.premove) {
            dispatch({
                type: GameActionTypes.PREMOVE,
                payload: {
                    ...promotionMove,
                    promotionTo: piece,
                },
            })
        } else {
            dispatch({
                type: GameActionTypes.NEW_MOVE,
                payload: {
                    ...promotionMove,
                    promotionTo: piece,
                },
            })
        }
    }

    return (
        <div
            className={`board__promotion ${
                promotionMove ? 'active' : 'inactive'
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
