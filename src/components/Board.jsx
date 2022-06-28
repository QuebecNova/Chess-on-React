import React from 'react'
import { useState, useEffect, useRef, useMemo } from 'react'
import alphs from '../services/alphabetPositions.js'
import setupBoard from '../configs/setupBoard.js'
import even from '../services/even.js'
import getSquares from "../services/getSquares";
import touch2Mouse from '../services/touch2mouse.js'
import { useCallback } from 'react'

const makedMoves = []
const rawMakedMoves = []
export { rawMakedMoves }
const initialPositions = setupBoard()
const falseSquares = getSquares(false)

export default function Board() {

    const [squares, setSquares] = useState(initialPositions)
    const [fieldSizes, setFieldSizes] = useState([])
    const [chessBoardOffsetLeft, setOffsetLeft] = useState(0)
    const [chessBoardOffsetTop, setOffsetTop] = useState(0)
    const [activeFields, setActiveFields] = useState({...falseSquares})
    const [draggedPiece, setDraggedPiece] = useState()
    const [draggedPieceCoords, setDraggedPieceCoords] = useState({col: 0, row: 0})
    const [offsetX, setOffsetX] = useState(43.75)
    const [offsetY, setOffsetY] = useState(43.75)
    const [enpassantAvailable, setEnpassantAvailable] = useState()
    const [castleAvailable, setCastleAvailable] = useState()
    const [turn, setTurn] = useState('White')


    const chessBoardRef = useRef()

    //changing usable sizes of the board related on it size in browser
    useEffect(() => {
    
        let chessBoard = chessBoardRef.current
    
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
                            onMouseUp={e => drop(e)}
                            onTouchStart={e => touch2Mouse(e)} 
                            onTouchMove={e => touch2Mouse(e)}
                            onTouchEnd={e => touch2Mouse(e)}
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

    const getMovesThatLeadsToCheck = useCallback((squares, draggedPiece, coords) => {
        
        const kingOnCheckAfterThisMoves = {...falseSquares}
        //simulating next move for check
        const moves = draggedPiece.canMove(coords, squares, null, initialPositions)
        moves.forEach(move => {
            const pieceOnField = {
                [coords]: null,
                [move]: draggedPiece
            }
            const simulateNextMoveSquares = {
                ...squares,
                ...pieceOnField
            }

            const simulateNextOppositeMoves = {...falseSquares}
            for (const field in simulateNextMoveSquares) {
                if (simulateNextMoveSquares[field] && simulateNextMoveSquares[field].color !== turn) {
                    const moves = simulateNextMoveSquares[field].canMove(field, simulateNextMoveSquares, null, initialPositions)
                     moves.forEach(move => {
                        if (move) simulateNextOppositeMoves[move] = true
                    })
                }
            }

            for (const field in simulateNextMoveSquares) {
                if (simulateNextMoveSquares[field] 
                    && simulateNextOppositeMoves[field] 
                    && simulateNextMoveSquares[field].type === 'King' 
                    && simulateNextMoveSquares[field].color === turn)
                    kingOnCheckAfterThisMoves[move] = true
            }
        })

        return kingOnCheckAfterThisMoves
    }, [turn])
    
    const mated = useMemo(() => {
        
        function isMated() {
    
            //simulating next move for check
            const allLegalMoves = []
            for (const field in squares) {
                if (squares[field]) {
                    if (squares[field].color === turn) {
                        allLegalMoves.push(squares[field].canMove(field, squares, getMovesThatLeadsToCheck(squares, squares[field], field), initialPositions))
                    }
                }
            }

            const mated = (function checkForNoLegalMoves() {
                return allLegalMoves.every(legalMoves => legalMoves.length === 0);
            })()

            return mated
        }
        return isMated()
    }, [squares, turn, getMovesThatLeadsToCheck])

    function addActives(moves, currentPiece) {
        const movesActiveFields = {}
        moves.forEach(move => {
            movesActiveFields[move] = true
        })
        movesActiveFields[currentPiece] = 'currentPiece'
        setActiveFields({...activeFields, ...movesActiveFields})
        return movesActiveFields
    }
    
    function removeActives() {
        const clearedActiveFields = {}
        for (const field in activeFields) {
            clearedActiveFields[field] = false
        }
        setActiveFields({...clearedActiveFields})
    }

    function dragStart(e) {

        e.preventDefault() 
        
        if (e.target.classList.contains('whiteField') || e.target.classList.contains('blackField')) return
        
        if (e.target !== draggedPiece) setDraggedPiece(e.target);
        
        if (!e.target.src.includes(turn)) return
        
        
        let x = 0
        let y = 0

        x = e.clientX
        y = e.clientY

        const localDraggedPieceCoords = getFieldCoordinates(x, y)
        setDraggedPieceCoords(getFieldCoordinates(x, y))

        const pieceField = alphs.posOut[localDraggedPieceCoords.row] + localDraggedPieceCoords.col
        const piece = squares[pieceField]
        const moves = piece.canMove(pieceField, squares, getMovesThatLeadsToCheck(squares, piece, pieceField), initialPositions)

        if (moves.length 
            && piece.type === 'Pawn' 
            && moves.slice().pop().includes('enpassant')) {
                setEnpassantAvailable(moves.slice().pop())
        }
            
        if (moves.length  && piece.type === 'King') {
            const castleOnThisSides = []
            if (moves.includes('castleRight')) castleOnThisSides.push('castleRight')
            if (moves.includes('castleLeft')) castleOnThisSides.push('castleLeft')
            setCastleAvailable(castleOnThisSides)
        }

        addActives(moves, pieceField)
        
        e.target.style.position = 'absolute'
        e.target.style.left = `${x - offsetX}px`
        e.target.style.top = `${y - offsetY}px`
    }
    
    function dragMove(e) {
        if (!draggedPiece) return
        if (!draggedPiece.src.includes(turn)) return

        let x = 0
        let y = 0

        x = e.clientX - offsetX
        y = e.clientY - offsetY
    
        draggedPiece.style.position = 'absolute'
        draggedPiece.style.left = `${x}px`
        draggedPiece.style.top = `${y}px`
    }
    
    function drop(e) {
        if (!draggedPiece) return
        if (!draggedPiece.src.includes(turn)) return
        
        let x = 0
        let y = 0

        x = e.clientX
        y = e.clientY

        const dropCoords = getFieldCoordinates(x, y)
        if (dropCoords.row !== 0 && dropCoords.col !== 0) {
            const pieceFromThisField = alphs.posOut[draggedPieceCoords.row] + draggedPieceCoords.col
            const dropField = alphs.posOut[dropCoords.row] + dropCoords.col
            const piece = squares[pieceFromThisField]

            const pieceOnField = {
                [pieceFromThisField]: null,
                [dropField]: piece
            }

            if (enpassantAvailable) {
                let enpassantedField
                if (piece.color === 'White' && enpassantAvailable.includes('Left')) enpassantedField = alphs.changeAlphPos(pieceFromThisField, '-', 1)
                if (piece.color === 'White' && enpassantAvailable.includes('Right')) enpassantedField = alphs.changeAlphPos(pieceFromThisField, '+', 1)
                if (piece.color === 'Black' && enpassantAvailable.includes('Left')) enpassantedField = alphs.changeAlphPos(pieceFromThisField, '-', 1)
                if (piece.color === 'Black' && enpassantAvailable.includes('Right')) enpassantedField = alphs.changeAlphPos(pieceFromThisField, '+', 1)
                pieceOnField[enpassantedField] = null
            }
            
            if (castleAvailable) {

                const kingMovedLeft = (alphs.changeAlphPos(pieceFromThisField, '-', 2) === dropField)
                const kingMovedRight = (alphs.changeAlphPos(pieceFromThisField, '+', 2) === dropField)
                let castledRookLeft
                let castledRookRight
                const rookLeft = alphs.changeAlphPos(pieceFromThisField, '-', 4)
                const rookRight = alphs.changeAlphPos(pieceFromThisField, '+', 3)

                castleAvailable.forEach(castle => {
                    if (castle.includes('Left') && kingMovedLeft) castledRookLeft = alphs.changeAlphPos(rookLeft, '+', 3)
                    if (castle.includes('Right') && kingMovedRight) castledRookRight = alphs.changeAlphPos(rookRight, '-', 2)
                })

                if (castledRookLeft) {
                    pieceOnField[rookLeft] = null
                    pieceOnField[castledRookLeft] = squares[rookLeft]
                }

                if (castledRookRight) {
                    pieceOnField[rookRight] = null
                    pieceOnField[castledRookRight] = squares[rookRight]
                }
            }


            if ((squares[dropField] 
                && squares[dropField].color === piece.color) 
                || activeFields[dropField] !== true 
                || piece === squares[dropField]) {
                //if we clicked on illegal move field - reset all states and return
                draggedPiece.style = ''
                setDraggedPiece()
                removeActives()
                return 
            }
            
            setSquares(squares => ({
                ...squares,
                ...pieceOnField,
            }))

            //last moves
            makedMoves.push(`${piece.color} ${piece.type} ${pieceFromThisField} to ${dropField}`)
            rawMakedMoves.push(`${piece.type.slice(0, 1)}${pieceFromThisField}`)
            if (piece.lastMoves) piece.lastMoves.push(pieceFromThisField)
            console.log(makedMoves); // all played moves here!

            setEnpassantAvailable()
            draggedPiece.style = ''
            setTurn(turn === 'White' ? 'Black' : 'White')
            setDraggedPiece()   
            removeActives()
        } else {
            draggedPiece.style = ''
            setDraggedPiece()
            removeActives()
            return 
        }
    }

    function restartGame() {
        setSquares(initialPositions)
        setTurn('White')
    }

    return (
        <div className='board' ref={chessBoardRef} onMouseMove={e => dragMove(e)} >
            <div className={`board__mated ${mated ? 'active' : 'inactive'}`}>
                <p>Mate!</p>
                <p>{turn === 'White' ? 'Black' : 'White'} player wins!</p>
                <button className="custom-btn btn-5" onClick={restartGame}><span>New game</span></button>
            </div>
            {renderSquares()}
        </div>
    )
}