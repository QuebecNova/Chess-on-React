import React from 'react'
import even from '../services/even'
import settings from '../configs/settings';

type Props = {
    squares: object;
    activeFields: object;
    dragStart: Function;
    dragMove: Function;
    drop: Function;
    touch2Mouse: Function;
}

export default function PieceFields(props: Props) {

    const {
        squares,
        activeFields,
        dragStart,
        dragMove,
        drop,
        touch2Mouse
    } = props
    
    const variant = settings.choosenVariant

    const board = []
        
    let index = 0
    let row = 1
    
    for (const field in squares) {
        let isActive = '';
        if (activeFields[field]) {
            isActive = 'active'
            if (activeFields[field] === 'currentPiece') isActive = 'active__current-piece'
        }

        if (squares[field]) {
            board.push(
                <div id={field} className={`${even.defineColor(index, row)} ${isActive}`} key={index}>
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
                <div id={field} className={`${even.defineColor(index, row)} ${isActive}`} key={index}/>
            )
        }
        index++
        if (index % 8 === 0) {
            row++
        }
    }

    return variant === 'white' ? board : board.reverse()
}