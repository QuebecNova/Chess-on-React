import React, {useContext} from 'react'
import {PieceFieldsContext} from './App';
import piecesImages from './services/piecesImages';

import initialPosition from './configs/initialPosition';

export default function Piece({field}) {

  const pieceType = initialPosition[field];
  const pieceImg = piecesImages[pieceType];

  if (initialPosition[field]) {
    return (
      <div 
      style={{
        backgroundImage: `url(${pieceImg})`
      }}
      className='piece'></div>
    )
  }
}
