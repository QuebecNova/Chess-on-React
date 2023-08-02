import React, { ReactElement, useContext } from 'react'
import even from '../../helpers/math/even'
import { boardContext } from '../Board'

type PieceFieldsProps = {
    activeFields: object
    click: (e: any, field: string) => void
    dragStart: (e: any) => void
    dragMove: (e: any) => void
    drop: (e: any) => void
    touch2Mouse: (e: any) => void
}

export default function PieceFields(props: PieceFieldsProps): ReactElement {
    const { activeFields, click, dragStart, dragMove, drop, touch2Mouse } =
        props

    const app = useContext(boardContext)

    const board = []
    let index = 0
    let row = 1

    for (const field in app.squares) {
        const Svg = app.squares[field]?.img || <img />
        console.log(app.squares)

        let isActive = ''
        if (activeFields[field]) {
            if (activeFields[field] === 'pieceCanMoveHere')
                isActive = 'canMoveHere'
            if (activeFields[field] === 'currentPiece')
                isActive = 'current-piece'
        }

        if (app.squares[field]) {
            board.push(
                <div
                    id={field}
                    className={`${even.defineColor(index, row)} ${isActive}`}
                    key={index}
                    onClick={(e) => click(e, field)}
                >
                    <Svg
                        onMouseDown={(e) => dragStart(e)}
                        onMouseMove={(e) => dragMove(e)}
                        onMouseUp={(e) => drop(e)}
                        onTouchStart={(e) => touch2Mouse(e)}
                        onTouchMove={(e) => touch2Mouse(e)}
                        onTouchEnd={(e) => touch2Mouse(e)}
                        alt={app.squares[field].type + app.squares[field].color}
                        data-color={app.squares[field].color}
                    />
                </div>
            )
        } else {
            board.push(
                <div
                    id={field}
                    className={`${even.defineColor(index, row)} ${isActive}`}
                    key={index}
                    onClick={(e) => click(e, field)}
                />
            )
        }
        index++
        if (index % 8 === 0) {
            row++
        }
    }

    return <>{app.variant === 'black' ? board.reverse() : board}</>
}
