'use client'

import { Box } from '@chakra-ui/react'
import { ReactElement, useState } from 'react'
import { defineColor } from 'src/4.features/lib/helpers'
import { useGameStore } from 'src/4.features/model/providers'
import { KeyableSquares } from 'src/5.entities/model'
import { Colors, FieldStates } from 'src/6.shared/model'

type PieceFieldsProps = {
    squares: KeyableSquares
    activeFields: object
    fieldWidth: number
    onClick: (e: any, field: string) => void
    dragStart: (e: any) => void
    dragMove: (e: any) => void
    drop: (e: any) => void
    touch2Mouse: (e: any) => void
}

export default function PieceFields(props: PieceFieldsProps): ReactElement {
    const {
        squares,
        activeFields,
        fieldWidth,
        onClick,
        dragStart,
        dragMove,
        drop,
        touch2Mouse,
    } = props

    const [selectedFields, setSelectedFields] = useState({})

    const variant = useGameStore((state) => state.variant)

    function onFieldClick(field: string) {
        setSelectedFields((prev) => ({ ...prev, [field]: true }))
    }

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
        if (selectedFields[field]) isActive = FieldStates.Selected

        if (squares[field]) {
            board.push(
                <Box
                    id={field}
                    className={`${defineColor(index, row)} ${isActive}`}
                    key={index}
                    style={{ height: fieldWidth }}
                    onMouseDown={(e) => {
                        setSelectedFields({})
                        onClick(e, field)
                    }}
                    onMouseUp={(e) => {
                        onClick(e, field)
                    }}
                    onContextMenu={(e) => {
                        e.preventDefault()
                        onFieldClick(field)
                    }}
                >
                    {Svg ? (
                        <Svg
                            onMouseDown={(e) => {
                                if (e.nativeEvent.button === 2) {
                                    onClick(e, null)
                                    onFieldClick(field)
                                } else {
                                    setSelectedFields({})
                                    dragStart(e)
                                }
                            }}
                            onMouseMove={(e) => dragMove(e)}
                            onMouseUp={(e) => drop(e)}
                            onTouchStart={(e) => touch2Mouse(e)}
                            onTouchMove={(e) => touch2Mouse(e)}
                            onTouchEnd={(e) => touch2Mouse(e)}
                            data-color={squares[field].color}
                        />
                    ) : (
                        <img
                            onMouseDown={(e) => {
                                if (e.nativeEvent.button === 2) {
                                    onClick(e, null)
                                    onFieldClick(field)
                                } else {
                                    setSelectedFields({})
                                    dragStart(e)
                                }
                            }}
                            onMouseMove={(e) => dragMove(e)}
                            onMouseUp={(e) => drop(e)}
                            onTouchStart={(e) => touch2Mouse(e)}
                            onTouchMove={(e) => touch2Mouse(e)}
                            onTouchEnd={(e) => touch2Mouse(e)}
                            alt={squares[field].type + squares[field].color}
                            data-color={squares[field].color}
                        />
                    )}
                </Box>
            )
        } else {
            board.push(
                <div
                    id={field}
                    className={`${defineColor(index, row)} ${isActive}`}
                    key={index}
                    onMouseDown={(e) => {
                        setSelectedFields({})
                        onClick(e, field)
                    }}
                    onMouseUp={(e) => {
                        onClick(e, field)
                    }}
                    style={{ height: fieldWidth }}
                    onContextMenu={(e) => {
                        e.preventDefault()
                        onClick(e, null)
                        onFieldClick(field)
                    }}
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
