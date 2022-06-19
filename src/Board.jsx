import React, {useContext} from 'react';
import PieceFields from './PieceFields';
import {PieceFieldsContext} from './App';
import { useRef } from 'react';

export default function Board() {

  const chessBoardRef = useRef(null)

  const pieceFields = useContext(PieceFieldsContext)

  return (
    <div className='board' ref={chessBoardRef}>
      {pieceFields.map((row, index) => 
        { 
          if(index % 2) {
            return row.map((field, index) => 
            {
              if  (index % 2) {
                return <PieceFields field={field} color='blackField' key={index} chessBoardRef={chessBoardRef}/>
              } else {
                return <PieceFields field={field} color='whiteField' key={index} chessBoardRef={chessBoardRef}/>
              }
            })
          } else {
            return row.map((field, index) => 
            {
              if  (index % 2) {
                return <PieceFields field={field} color='whiteField' key={index} chessBoardRef={chessBoardRef}/>
              } else {
                return <PieceFields field={field} color='blackField' key={index} chessBoardRef={chessBoardRef}/>
              }
            })
          }
        }
      )}
    </div>
  )
}
