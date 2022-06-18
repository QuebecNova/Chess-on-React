import React from 'react'

import Piece from './Piece'

export default function PieceFields({field, color}) {
  return (
    <div id={field} className={color}><Piece field={field}/></div>
  )
}
