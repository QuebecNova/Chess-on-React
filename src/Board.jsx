import React, {useContext} from 'react'
import PieceFields from './PieceFields'
import {PieceFieldsContext} from './App';

export default function Board() {
  const pieceFields = useContext(PieceFieldsContext)

  return (
    <div className='board'>
      {pieceFields.map((row, index) => 
        { if(index % 2) {
            return row.map((field, index) => 
            {
              if  (index % 2) {
                return <PieceFields field={field} color='blackField' key={index}/>
              } else {
                return <PieceFields field={field} color='whiteField' key={index}/>
              }
            })
          } else {
            return row.map((field, index) => 
            {
              if  (index % 2) {
                return <PieceFields field={field} color='whiteField' key={index}/>
              } else {
                return <PieceFields field={field} color='blackField' key={index}/>
              }
            })
          }
        }
      )}
    </div>
  )
}
