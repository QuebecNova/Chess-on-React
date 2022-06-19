import React from 'react';
import Piece from './Piece';

export default function PieceFields({field, color, chessBoardRef}) {

  let draggedPiece;

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
    const x = e.clientX - 40;
    const y = e.clientY - 45;
    draggedPiece.style.position = 'absolute'
    draggedPiece.style.left = `${x}px`
    draggedPiece.style.top = `${y}px`
  }

  function drop(e) {
    console.log(e);
    if (e.target.classList.contains('whiteField') || e.target.classList.contains('blackField')) {
    }
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
