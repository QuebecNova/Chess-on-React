import React, { useEffect, useState, useRef } from 'react';
import PieceFields from './PieceFields';

export default function Board({pieceFields}) {

  const chessBoardRef = useRef(null)

  const [fieldSizes, setFieldSizes] = useState([])
  const [chessBoardOffsetLeft, setOffsetLeft] = useState(0)
  const [chessBoardOffsetTop, setOffsetTop] = useState(0)

  useEffect(() => {
    let chessBoard = chessBoardRef.current;

    function resizedBoard() {
      chessBoard = chessBoardRef.current;
      addUpRowsAndCols(chessBoard)
    }
    
    new ResizeObserver(resizedBoard).observe(chessBoard)
  }, [])
  
  function addUpRowsAndCols(chessBoard) {
    setFieldSizes([])
    /*const borderSize = 5;
    const maxY = chessBoard.clientHeight + chessBoard.offsetTop
    const minY = chessBoard.offsetTop + borderSize
    const boardHeight = chessBoard.clientHeight
    const fieldHeight = boardHeight / 8
  
    const maxX = chessBoard.clientWidth + chessBoard.offsetLeft
    const minX = chessBoard.offsetLeft + borderSize*/
    setOffsetLeft(chessBoard.offsetLeft)
    setOffsetTop(chessBoard.offsetTop)
    const boardWidth  = chessBoard.clientWidth
    const fieldWidth = boardWidth / 8
  
    let fieldStartsOn = 0;
    const fieldStartsOnArr = [];
    
    for (let i = 0; i < 9; i++) {
      fieldStartsOn = fieldWidth * i;
      fieldStartsOnArr.push(fieldStartsOn)
    }
    setFieldSizes([...fieldSizes, ...fieldStartsOnArr])
  }

  function renderPieceFields() {
    return pieceFields.map((row, index) => 
        { 
          if(index % 2) {
            return row.map((field, index) => 
            {
              if  (index % 2) {
                return (
                  <PieceFields 
                    field={field} 
                    color='blackField' 
                    key={index} 
                    fieldSizes={fieldSizes} 
                    chessBoardOffsetLeft={chessBoardOffsetLeft} 
                    chessBoardOffsetTop={chessBoardOffsetTop}
                  />
                )
              } else {
                return (
                  <PieceFields 
                    field={field} 
                    color='whiteField' 
                    key={index} 
                    fieldSizes={fieldSizes} 
                    chessBoardOffsetLeft={chessBoardOffsetLeft} 
                    chessBoardOffsetTop={chessBoardOffsetTop}
                  />
                )
              }
            })
          } else {
            return row.map((field, index) => 
            {
              if  (index % 2) {
                return (
                  <PieceFields 
                    field={field} 
                    color='whiteField' 
                    key={index} 
                    fieldSizes={fieldSizes} 
                    chessBoardOffsetLeft={chessBoardOffsetLeft} 
                    chessBoardOffsetTop={chessBoardOffsetTop}
                  />
                )
              } else {
                return (
                  <PieceFields 
                    field={field} 
                    color='blackField' 
                    key={index} 
                    fieldSizes={fieldSizes} 
                    chessBoardOffsetLeft={chessBoardOffsetLeft} 
                    chessBoardOffsetTop={chessBoardOffsetTop}
                  />
                )
              }
            })
          }
        }
      )
  }

  return (
    <div className='board' ref={chessBoardRef}>
      {renderPieceFields()}
    </div>
  )
}
