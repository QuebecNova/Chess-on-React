import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { alphPosOut } from '../services/alphabetPositions.js'
import setupBoard from '../configs/setupBoard.js'
import even from '../services/even.js'

let offsetX = 43.75
let offsetY = 43.75

export default function Board() {

    const [squares, setSquares] = useState(setupBoard())
    const [fieldSizes, setFieldSizes] = useState([])
    const [chessBoardOffsetLeft, setOffsetLeft] = useState(0)
    const [chessBoardOffsetTop, setOffsetTop] = useState(0)
    const chessBoardRef = useRef()

    //changing usable sizes of the board related on it size in browser
    useEffect(() => {
    
        let chessBoard = chessBoardRef.current;
    
        function addUpRowsAndCols(chessBoard) {
          setFieldSizes([])

          setOffsetLeft(chessBoard.offsetLeft)
          setOffsetTop(chessBoard.offsetTop)
          const boardWidth  = chessBoard.clientWidth
          const fieldWidth = boardWidth / 8
          offsetX = fieldWidth / 2.1
          offsetY = fieldWidth / 1.9
        
          let fieldStartsOn = 0;
          const fieldStartsOnArr = [];
          
          for (let i = 0; i < 9; i++) {
            fieldStartsOn = fieldWidth * i;
            fieldStartsOnArr.push(fieldStartsOn)
          }
          setFieldSizes([...fieldStartsOnArr])
        }
    
        function resizedBoard() {
          chessBoard = chessBoardRef.current;
          addUpRowsAndCols(chessBoard)
        }
        
        new ResizeObserver(resizedBoard).observe(chessBoard)
      }, [])
    
    function renderSquares() {
        const boardDisplay = []
        
        let index = 0
        let row = 1
        
        for (const field in squares) {
            if (squares[field]) {
                boardDisplay.push(
                    <div id={field} className={even.defineColor(index, row)} key={index}>
                        <img 
                            src={squares[field].img} 
                            onMouseDown={e => dragStart(e)} 
                            onMouseMove={e => dragMove(e)} 
                            onMouseUp={e => drop(e)}
                            onTouchStart={e => dragStart(e)} 
                            onTouchMove={e => dragMove(e)}
                            onTouchEnd={e => drop(e)}
                            alt={squares[field].type}
                        />
                    </div>
                )
            } else {
                boardDisplay.push(
                    <div id={field} className={even.defineColor(index, row)} key={index}/>
                )
            }
            index++
            if (index % 8 === 0) {
                row++
            }
        }

        return boardDisplay
    }
    
    function getFieldCoordinates(x, y) {
        //displaying coordinates of the mouse related to the board
        // example: cursor at b3: b = row(2), 3 = col(3)
        // if cursor out the board one of the coords is 0

        //mouse positions(x, y)
        x -= chessBoardOffsetLeft
        y -= chessBoardOffsetTop

        const fieldCoords = {row: 0, col: 0}
        
        fieldSizes.forEach((fieldStartsOn, index) => {
        if (x >= fieldStartsOn && x <= fieldSizes[index + 1]) {
            const row = index + 1
            fieldCoords.row = row
        } 
        })

        const fieldSizesReversed = fieldSizes.slice().reverse()
        fieldSizesReversed.forEach((fieldStartsOn, index) => {
        if (y <= fieldStartsOn && y >= fieldSizesReversed[index + 1]) {
            const col = index + 1
            fieldCoords.col = col
        }
        })

        return fieldCoords
    }
    
    let draggedPiece;
    let draggedPieceCoords;

    function dragStart(e) {
        if (e.type === 'mousedown') {
            e.preventDefault()
        }    
        
        if (e.target.classList.contains('whiteField') || e.target.classList.contains('blackField')) return

        let x = 0
        let y = 0

        if (e.type === 'mousedown') {
            x = e.clientX
            y = e.clientY
        } else {
            x = e.touches[0].clientX
            y = e.touches[0].clientY
        }

        draggedPiece = e.target;
        draggedPieceCoords = getFieldCoordinates(x, y)

        draggedPiece.style.position = 'absolute'
        draggedPiece.style.left = `${x - offsetX}px`
        draggedPiece.style.top = `${y - offsetY}px`
    }
    
    function dragMove(e) {
        if (!draggedPiece) return

        let x = 0
        let y = 0

        if (e.type === 'mousedown') {
            x = e.clientX - offsetX
            y = e.clientY - offsetY
        } else {
            x = e.touches[0].clientX - offsetX
            y = e.touches[0].clientY - offsetY
        }
    
        draggedPiece.style.position = 'absolute'
        draggedPiece.style.left = `${x}px`
        draggedPiece.style.top = `${y}px`
    }
    
    function drop(e) {
        if (!draggedPiece) return

        let x = 0
        let y = 0

        if (e.type === 'mousedown') {
            x = e.clientX
            y = e.clientY
        } else {
            x = e.changedTouches[0].clientX
            y = e.changedTouches[0].clientY
        }
        
        const dropCoords = getFieldCoordinates(x, y)
        if (dropCoords.row !== 0 && dropCoords.col !== 0) {
            const initialPieceField = alphPosOut[draggedPieceCoords.row] + draggedPieceCoords.col
            const dropField = alphPosOut[dropCoords.row] + dropCoords.col
            const piece = squares[initialPieceField]

            const pieceOnField = {
                [initialPieceField]: null,
                [dropField]: piece
            }

            if (squares[dropField]) {
                draggedPiece.style = ''
                draggedPiece = undefined
                return 
            }
            setSquares(squares => ({
                ...squares,
                ...pieceOnField,
            }))
        }
        draggedPiece.style = ''
        draggedPiece = undefined
    }

    return (
        <div className='board' ref={chessBoardRef}>
            {renderSquares()}
        </div>
    )
}