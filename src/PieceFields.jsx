import React from 'react'

export default function PieceFields({field, color}) {
  return (
    <div id={field} className={color}></div>
  )
}
