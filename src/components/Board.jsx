import React from 'react'
import { useState, useEffect, useRef } from 'react'
import alphs from '../services/alphabetPositions.js'
import setupBoard from '../configs/setupBoard.js'
import even from '../services/even.js'
import getSquares from "../services/getSquares";

export default function Board() {

    const [squares, setSquares] = useState(setupBoard())
    const [fieldSizes, setFieldSizes] = useState([])
    const [chessBoardOffsetLeft, setOffsetLeft] = useState(0)
    const [chessBoardOffsetTop, setOffsetTop] = useState(0)
    const [activeFields, setActiveFields] = useState(getSquares(false))
    const [draggedPiece, setDraggedPiece] = useState()
    const [draggedPieceCoords, setDraggedPieceCoords] = useState({col: 0, row: 0})
    const [offsetX, setOffsetX] = useState(43.75)
    const [offsetY, setOffsetY] = useState(43.75)
    const chessBoardRef = useRef()

    let chessBoard
    //changing usable sizes of the board related on it size in browser
    useEffect(() => {
    
        chessBoard = chessBoardRef.current
    
        function addUpRowsAndCols(chessBoard) {
          setFieldSizes([])

          setOffsetLeft(chessBoard.offsetLeft)
          setOffsetTop(chessBoard.offsetTop)
          const boardWidth  = chessBoard.clientWidth
          const fieldWidth = boardWidth / 8
          setOffsetX(fieldWidth / 2.1)
          setOffsetY(fieldWidth / 1.9)
        
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
        const board = []
        
        let index = 0
        let row = 1
        
        for (const field in squares) {
            let isActive = '';
            if (activeFields[field]) {
                isActive = 'active'
                if (activeFields[field] === 'currentPiece') isActive = 'active__current-piece'
            }

            if (squares[field]) {
                board.push(
                    <div id={field} className={`${even.defineColor(index, row)} ${isActive}`} key={index}>
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
                board.push(
                    <div id={field} className={`${even.defineColor(index, row)} ${isActive}`} key={index}/>
                )
            }
            index++
            if (index % 8 === 0) {
                row++
            }
        }

        return board
    }

    function getFieldCoordinates(x, y) {
        //displaying coordinates of the mouse related to the board
        // example: cursor at b3: b = row(2), 3 = col(3)
        // if cursor out the board one of the coords is 0

        //mouse positions(x, y) including borders, and board offset
        x -= chessBoardOffsetLeft + 5
        y -= chessBoardOffsetTop + 5

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

    function addActives(moves, currentPiece) {
        const movesActiveFields = {}
        moves.forEach(move => {
            movesActiveFields[move] = true
        })
        movesActiveFields[currentPiece] = 'currentPiece'
        setActiveFields({...activeFields, ...movesActiveFields})
    }
    
    function removeActives() {
        const clearedActiveFields = {}
        for (const field in activeFields) {
            clearedActiveFields[field] = false
        }
        setActiveFields({...clearedActiveFields})
    }

    function dragStart(e) {
        if (e.type === 'mousedown') {
            e.preventDefault()
        }    
        
        if (e.target.classList.contains('whiteField') || e.target.classList.contains('blackField')) return
        
        setDraggedPiece(e.target);
        
        let x = 0
        let y = 0

        if (e.type === 'mousedown') {
            x = e.clientX
            y = e.clientY
        } else {
            x = e.touches[0].clientX
            y = e.touches[0].clientY
        }

        const localDraggedPieceCoords = getFieldCoordinates(x, y)
        setDraggedPieceCoords(getFieldCoordinates(x, y))

        const pieceField = alphs.posOut[localDraggedPieceCoords.row] + localDraggedPieceCoords.col
        const moves = squares[pieceField].canMove(pieceField)

        addActives(moves, pieceField)
        
        e.target.style.position = 'absolute'
        e.target.style.left = `${x - offsetX}px`
        e.target.style.top = `${y - offsetY}px`
    }
    
    function dragMove(e) {
        if (!draggedPiece) return

        let x = 0
        let y = 0

        if (e.type === 'mousemove') {
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
        
        if (e.type === 'mouseup') {
            x = e.clientX
            y = e.clientY
        } else {
            x = e.changedTouches[0].clientX
            y = e.changedTouches[0].clientY
        }

        const dropCoords = getFieldCoordinates(x, y)
        if (dropCoords.row !== 0 && dropCoords.col !== 0) {
            const initialPieceField = alphs.posOut[draggedPieceCoords.row] + draggedPieceCoords.col
            const dropField = alphs.posOut[dropCoords.row] + dropCoords.col
            const piece = squares[initialPieceField]

            const pieceOnField = {
                [initialPieceField]: null,
                [dropField]: piece
            }

            if (squares[dropField] && squares[dropField].color === piece.color) {
                draggedPiece.style = ''
                setDraggedPiece()
                removeActives()
                return 
            }
            setSquares(squares => ({
                ...squares,
                ...pieceOnField,
            }))
        }
        draggedPiece.style = ''
        setDraggedPiece()   
        removeActives()
    }

    return (
        <div className='board' ref={chessBoardRef}>
            {renderSquares()}
        </div>
    )
}