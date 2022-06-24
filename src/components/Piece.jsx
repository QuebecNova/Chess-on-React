import React from 'react'

import piecesImages from '../services/piecesImages.js'
import piecesComponents from '../services/piecesComponents.js'

export default function Piece({ initialPositions, field }) {

    const fullType = initialPositions[field]
    if (!fullType) return
    const color = fullType.slice(0, 5)
    const type = fullType.slice(5, 12)
    const pieceImg = piecesImages[fullType]
    const Component = piecesMatch[type]

  return <Component pieceImg={pieceImg} color={color} field={field}/>
}
