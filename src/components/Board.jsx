import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { alphPosOut } from '../services/alphabetPositions.js'
import setupBoard from '../configs/setupBoard.js'
import even from '../services/even.js'

export default function Board() {

    const [squares, setSquares] = useState(setupBoard())
    const [dragCoords, setDragCoords] = useState({row: 0, col: 0})
    const [fieldSizes, setFieldSizes] = useState([])
    const [chessBoardOffsetLeft, setOffsetLeft] = useState(0)
    const [chessBoardOffsetTop, setOffsetTop] = useState(0)
    const chessBoardRef = useRef()

    //changing usable sizes of the board related on it size in browser
    useEffect(() => {
    
        let chessBoard = chessBoardRef.current;
    
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
                        <img src={squares[field].img} onMouseDown={e => dragStart(e)} onMouseMove={e => dragMove(e)} onMouseUp={e => drop(e)}/>
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
        // exmpl: cursor at b3: b = row(2), 3 = col(3)
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
        e.preventDefault()
        if (e.target.classList.contains('whiteField') || e.target.classList.contains('blackField')) return

        draggedPiece = e.target;
        const x = e.clientX
        const y = e.clientY
        draggedPieceCoords = getFieldCoordinates(x, y)

        draggedPiece.style.position = 'absolute'
        draggedPiece.style.left = `${x - 40}px`
        draggedPiece.style.top = `${y - 45}px`
    }
    
    function dragMove(e) {
        if (!draggedPiece) return
        const x = e.clientX - 40
        const y = e.clientY - 45
    
        draggedPiece.style.position = 'absolute'
        draggedPiece.style.left = `${x}px`
        draggedPiece.style.top = `${y}px`
    }
    
    function drop(e) {
        if (!draggedPiece) return
        const x = e.clientX
        const y = e.clientY
        const dropCoords = getFieldCoordinates(x, y)
        if (dropCoords.row !== 0 && dropCoords.col !== 0) {
            const initialPieceField = alphPosOut[draggedPieceCoords.row] + draggedPieceCoords.col
            const dropField = alphPosOut[dropCoords.row] + dropCoords.col
            const piece = squares[initialPieceField]

            const pieceOnField = {
                [initialPieceField]: null,
                [dropField]: piece
            }

            console.log(pieceOnField);

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