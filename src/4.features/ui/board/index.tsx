'use client'

import { useEffect, useRef } from 'react'

import { touch2Mouse } from 'src/6.shared/lib/helpers'

import { PieceFields } from 'src/4.features/ui'

import {
    useBoardControls,
    useChessBoardOffsets,
} from 'src/4.features/lib/hooks'
import { useGameStore } from 'src/4.features/model/providers'
import { GameActionTypes } from 'src/4.features/model/store/game'
import Promotion from './Promotion'

export default function Board({ disabled }: { disabled: boolean }) {
    const chessBoardRef = useRef<HTMLDivElement>(null)
    const dispatch = useGameStore((state) => state.dispatch)
    const { fieldWidth } = useChessBoardOffsets(chessBoardRef)
    const [dragStart, dragMove, dragDrop, onClick, activeFields] =
        useBoardControls(chessBoardRef, disabled)

    useEffect(() => {
        return () => {
            dispatch({ type: GameActionTypes.RESET_STORE })
        }
    }, [])

    return (
        <>
            <div
                className="board"
                ref={chessBoardRef}
                onMouseMove={(e) => dragMove(e)}
            >
                <PieceFields
                    fieldWidth={fieldWidth}
                    activeFields={activeFields}
                    onClick={onClick}
                    dragStart={dragStart}
                    dragMove={dragMove}
                    drop={dragDrop}
                    touch2Mouse={touch2Mouse}
                />
            </div>
            <Promotion fieldWidth={fieldWidth} />
        </>
    )
}
