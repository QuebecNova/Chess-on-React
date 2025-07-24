'use client'

import { ReactElement } from 'react'
import { useGameStore } from 'src/4.features/model/providers'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { Bishop, Knight, Queen, Rook } from 'src/5.entities/lib'
import { IPiece, KeyablePieceOnField } from 'src/5.entities/model'

type Props = {
    fieldWidth: number
}

export default function Promotion(props: Props): ReactElement {
    const squares = useGameStore((state) => state.squares)
    const turn = useGameStore((state) => state.turn)
    const promotionMove = useGameStore((state) => state.promotionMove)
    const dispatch = useGameStore((state) => state.dispatch)
    const players = useGameStore((state) => state.players)

    const queen = new Queen(turn)
    const knight = new Knight(turn)
    const bishop = new Bishop(turn)
    const rook = new Rook(turn)

    function transformPiece(piece: IPiece): void {
        if (!promotionMove) return
        const pieceOnField: KeyablePieceOnField = {
            [promotionMove.from]: null,
            [promotionMove.to]: piece,
        }

        dispatch({
            type: GameActionTypes.NEW_MOVE,
            payload: {
                squares: {
                    ...squares,
                    ...pieceOnField,
                },
                piece: squares[promotionMove.from],
                takenPiece: null,
                move: promotionMove,
                promotionTo: piece,
            },
        })
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
