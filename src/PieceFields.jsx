import React from 'react';
import Piece from './Piece';
import { alphPosOut } from './services/alphabetPositions';

export default function PieceFields(props) {

  const {
    field,
    color, 
    fieldSizes, 
    chessBoardOffsetLeft, 
    chessBoardOffsetTop,
  } = props

  let draggedPiece
  
  const draggedPieceCoordinates = {row: 0, col: 0}
  
  function getPieceCoordinates(x, y) {

    //mouse positions(x, y)
    x -= chessBoardOffsetLeft
    y -= chessBoardOffsetTop

    //displaying coordinates of the mouse related to the board
    // exmpl: cursor at b3: b = row(2), 3 = col(3)
    // if cursor out the board one of the coords is 0
    
    fieldSizes.forEach((fieldStartsOn, index) => {
      if (x >= fieldStartsOn && x <= fieldSizes[index + 1]) {
        draggedPieceCoordinates.row = index + 1
      } 
    })

    const fieldSizesReversed = fieldSizes.slice().reverse()
    fieldSizesReversed.forEach((fieldStartsOn, index) => {
      if (y <= fieldStartsOn && y >= fieldSizesReversed[index + 1]) {
        draggedPieceCoordinates.col = index + 1
      }
    })

    return draggedPieceCoordinates
  }
  
  function dragStart(e) {
    e.preventDefault()
    if (e.target.classList.contains('whiteField') || e.target.classList.contains('blackField') || !e.target) return
    draggedPiece = e.target
    const x = e.clientX - 40;
    const y = e.clientY - 45;
    draggedPiece.style.position = 'absolute'
    draggedPiece.style.left = `${x}px`
    draggedPiece.style.top = `${y}px`
  }
  
  function dragMove(e, draggedPiece) {
    if (!draggedPiece) return
    const x = e.clientX;
    const y = e.clientY;
  
    draggedPiece.style.position = 'absolute'
    draggedPiece.style.left = `${x - 40}px`
    draggedPiece.style.top = `${y - 45}px`
  }
  
  function drop(e) {
    if (!draggedPiece) return
    const x = e.clientX
    const y = e.clientY
    const coords = getPieceCoordinates(x, y)
    if (coords.row !== 0 && coords.col !== 0) {
      const field = document.querySelector(`#${alphPosOut[coords.row]}${coords.col}`)
      if (field.hasChildNodes()) {
        draggedPiece.style = ''
        draggedPiece = undefined;
        return 
      }
      field.appendChild(draggedPiece)
    }
    draggedPiece.style = ''
    draggedPiece = undefined;
  }

  return (
    <div 
      id={field}
      className={color} 
      onMouseMove={(e) => dragMove(e, draggedPiece)} 
      onMouseDown={(e) => dragStart(e)}
      onMouseUp={(e) => drop(e)}
    >
      <Piece field={field}/>
    </div>
  )
}