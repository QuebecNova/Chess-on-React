'use client'

import { ReactElement } from 'react'
import { defineColor } from 'src/4.features/lib/helpers'
import { useGameStore } from 'src/4.features/model/providers'
import { Colors, FieldStates } from 'src/6.shared/model'

type PieceFieldsProps = {
    activeFields: object
    fieldWidth: number
    click: (e: any, field: string) => void
    dragStart: (e: any) => void
    dragMove: (e: any) => void
    drop: (e: any) => void
    touch2Mouse: (e: any) => void
}

export default function PieceFields(props: PieceFieldsProps): ReactElement {
    const {
        activeFields,
        fieldWidth,
        click,
        dragStart,
        dragMove,
        drop,
        touch2Mouse,
    } = props

    const squares = useGameStore((state) => state.squares)
    const variant = useGameStore((state) => state.variant)

    const board = []
    let index = 0
    let row = 1

    for (const field in squares) {
        const Svg = squares[field]?.img

        let isActive = ''
        if (activeFields[field]) {
            if (activeFields[field] === FieldStates.PieceCanMoveHere)
                isActive = FieldStates.PieceCanMoveHere
            if (activeFields[field] === FieldStates.CurrentPiece)
                isActive = FieldStates.CurrentPiece
        }

        if (squares[field]) {
            board.push(
                <div
                    id={field}
                    className={`${defineColor(index, row)} ${isActive}`}
                    key={index}
                    style={{ height: fieldWidth }}
                    onClick={(e) => click(e, field)}
                >
                    {Svg ? (
                        <Svg
                            onMouseDown={(e) => dragStart(e)}
                            onMouseMove={(e) => dragMove(e)}
                            onMouseUp={(e) => drop(e)}
                            onTouchStart={(e) => touch2Mouse(e)}
                            onTouchMove={(e) => touch2Mouse(e)}
                            onTouchEnd={(e) => touch2Mouse(e)}
                            data-color={squares[field].color}
                        />
                    ) : (
                        <img
                            onMouseDown={(e) => dragStart(e)}
                            onMouseMove={(e) => dragMove(e)}
                            onMouseUp={(e) => drop(e)}
                            onTouchStart={(e) => touch2Mouse(e)}
                            onTouchMove={(e) => touch2Mouse(e)}
                            onTouchEnd={(e) => touch2Mouse(e)}
                            alt={squares[field].type + squares[field].color}
                            data-color={squares[field].color}
                        />
                    )}
                </div>
            )
        } else {
            board.push(
                <div
                    id={field}
                    className={`${defineColor(index, row)} ${isActive}`}
                    key={index}
                    onClick={(e) => click(e, field)}
                    style={{ height: fieldWidth }}
                />
            )
        }
        index++
        if (index % 8 === 0) {
            row++
        }
    }

    return <>{variant === Colors.Black ? board.reverse() : board}</>
}
