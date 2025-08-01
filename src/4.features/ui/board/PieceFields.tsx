'use client'

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

    const variant = useGameStore((state) => state.variant)
    const premoves = useGameStore((state) => state.premoves)

    const [selectedFields, setSelectedFields] = useState({})
    const [lastSelectedField, setLastSelectedField] = useState(null)

    function onFieldClick(e, field: string) {
        //some magic to highlight squares on right click
        if (e.type === 'mousedown') {
            if (!selectedFields[field]) {
                setSelectedFields((prev) => ({
                    ...prev,
                    [field]: null,
                }))
            }
            setLastSelectedField(field)
        }
        if (e.type === 'mouseup') {
            if (field !== lastSelectedField && !selectedFields[field]) return
            if (field === lastSelectedField) {
                if (selectedFields[field]) {
                    setSelectedFields((prev) => ({
                        ...prev,
                        [field]: null,
                    }))
                } else {
                    setSelectedFields((prev) => ({ ...prev, [field]: true }))
                }
            }
            setLastSelectedField(null)
        }
        if (e.button !== 2) return setSelectedFields({})
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
        const isPremove =
            premoves.length &&
            !!premoves.find(
                (premove) => premove.from === field || premove.to === field
            )
                ? 'premove'
                : ''
        if (squares[field]) {
            board.push(
                <div
                    id={field}
                    className={`${defineColor(index, row)} ${isActive} ${isPremove}`}
                    key={index}
                    style={{ height: fieldWidth }}
                    onContextMenu={(e) => {
                        e.preventDefault()
                        onClick(e, field)
                    }}
                    onMouseMove={(e) => {
                        dragMove(e)
                    }}
                    onMouseDown={(e) => {
                        onFieldClick(e, field)
                        onClick(e, field)
                    }}
                    onMouseUp={(e) => {
                        onFieldClick(e, field)
                    }}
                >
                    {Svg ? (
                        <Svg
                            onMouseDown={(e) => {
                                onFieldClick(e, field)
                                dragStart(e)
                            }}
                            // onMouseMove={(e) => dragMove(e)}
                            onMouseUp={(e) => drop(e)}
                            onTouchStart={(e) => touch2Mouse(e)}
                            onTouchMove={(e) => touch2Mouse(e)}
                            onTouchEnd={(e) => touch2Mouse(e)}
                            onContextMenu={(e) => {
                                e.preventDefault()
                                onClick(e, field)
                            }}
                            data-color={squares[field].color}
                        />
                    ) : (
                        <img
                            onMouseDown={(e) => {
                                onFieldClick(e, field)
                                dragStart(e)
                            }}
                            // onMouseMove={(e) => dragMove(e)}
                            onMouseUp={(e) => drop(e)}
                            onTouchStart={(e) => touch2Mouse(e)}
                            onTouchMove={(e) => touch2Mouse(e)}
                            onTouchEnd={(e) => touch2Mouse(e)}
                            alt={squares[field].type + squares[field].color}
                            onContextMenu={(e) => {
                                e.preventDefault()
                                onClick(e, field)
                            }}
                            data-color={squares[field].color}
                        />
                    )}
                </div>
            )
        } else {
            board.push(
                <div
                    id={field}
                    className={`${defineColor(index, row)} ${isActive} ${isPremove}`}
                    key={index}
                    onContextMenu={(e) => {
                        e.preventDefault()
                        onClick(e, field)
                    }}
                    onMouseMove={(e) => {
                        dragMove(e)
                    }}
                    onMouseDown={(e) => {
                        onFieldClick(e, field)
                        onClick(e, field)
                    }}
                    onMouseUp={(e) => {
                        onFieldClick(e, field)
                    }}
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
