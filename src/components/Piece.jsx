import React, { useState } from 'react'

import piecesImages from '../services/piecesImages.js'

import Queen from '../figures/queen'
import Bishop from '../figures/bishop'
import King from '../figures/king'
import Knight from '../figures/knight'
import Rook from '../figures/rook'
import Pawn from '../figures/pawn'

const piecesMatch = {
  'Queen': Queen,
  'Knight': Knight,
  'King': King,
  'Bishop': Bishop,
  'Pawn': Pawn,
  'Rook': Rook
}

export default function Piece({ initialPositions, field }) {

    const fullType = initialPositions[field]
    if (!fullType) return
    const color = fullType.slice(0, 5)
    const type = fullType.slice(5, 12)
    const pieceImg = piecesImages[fullType]
    const Component = piecesMatch[type]

  return <Component pieceImg={pieceImg} color={color} field={field}/>
}
