import React, { ReactElement } from 'react'
import even from '../../services/math/even'

type PieceFieldsProps = {
    squares: object;
    activeFields: object;
    variant: string;
    click: (e : any, field : string) => void;
    dragStart: (e : any) => void;
    dragMove: (e : any) => void;
    drop: (e : any) => void;
    touch2Mouse: (e : any) => void;
}

export default function PieceFields(props : PieceFieldsProps) : ReactElement {
    const {
        squares,
        activeFields,
        variant,
        click,
        dragStart,
        dragMove,
        drop,
        touch2Mouse
    } = props

    const board = []
        
    let index = 0
    let row = 1
    
    for (const field in squares) {
        let isActive = '';
        if (activeFields[field]) {
            if (activeFields[field] === 'pieceCanMoveHere') isActive = 'canMoveHere'
            if (activeFields[field] === 'currentPiece') isActive = 'current-piece'
        }

        if (squares[field]) {
            board.push(
                <div id={field} className={`${even.defineColor(index, row)} ${isActive}`} key={index} onClick={(e) => click(e, field)}>
                    <img 
                        src={squares[field].img}
                        onMouseDown={e => dragStart(e)}
                        onMouseMove={e => dragMove(e)} 
                        onMouseUp={e => drop(e)}
                        onTouchStart={e => touch2Mouse(e)} 
                        onTouchMove={e => touch2Mouse(e)}
                        onTouchEnd={e => touch2Mouse(e)}
                        alt={squares[field].type}
                    />
                </div>
            )
        } else {
            board.push(
                <div id={field} className={`${even.defineColor(index, row)} ${isActive}`} key={index} onClick={(e) => click(e, field)}/>
            )
        }
        index++
        if (index % 8 === 0) {
            row++
        }
    }

    return (
        <>
            {variant === 'black' ? board.reverse() : board}
        </>
    )
}