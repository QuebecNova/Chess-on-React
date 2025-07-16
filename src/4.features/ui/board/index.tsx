'use client'

import { useRef } from 'react'

import { touch2Mouse } from 'src/6.shared/lib/helpers'

import { PieceFields } from 'src/4.features/ui'

import {
    useBoardControls,
    useChessBoardOffsets,
} from 'src/4.features/lib/hooks'
import Promotion from './Promotion'

export default function Board() {
    const chessBoardRef = useRef<HTMLDivElement>(null)

    const { fieldWidth } = useChessBoardOffsets(chessBoardRef)

    const [dragStart, dragMove, dragDrop, onClick, activeFields] =
        useBoardControls(chessBoardRef)

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
