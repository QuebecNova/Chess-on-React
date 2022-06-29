import React from 'react'
import { useState, useEffect, useRef, useMemo, ReactElement } from 'react'
import { keyableSquares, keyableString } from '../interfaces/keyable';
import { useCallback } from 'react'
import alphs from '../services/alphabetPositions'
import setupBoard from '../configs/setupBoard'
import getSquares from "../services/getSquares";
import touch2Mouse from '../services/touch2mouse'
import sounds from '../services/sounds'
import PieceFields from './PieceFields'
import MatedMessage from './MatedMessage';
import Promotion from './Promotion';
import settings from '../configs/settings';
import Coords from '../interfaces/Coords';
import IPiece from '../interfaces/IPiece';
import DefineSide from './DefineSide';

const makedMoves = []
const rawMakedMoves = []
export { rawMakedMoves }
const initialPositions = setupBoard()
const nullSquares = getSquares(null)

export default function Board() : ReactElement {

    const [squares, setSquares] = useState(initialPositions)
    const [activeFields, setActiveFields] = useState({...nullSquares})
    const [draggedPiece, setDraggedPiece] = useState <HTMLImageElement>(null)
    const [isStaleMate, setStaleMate] = useState<boolean>(false)
    const [draggedPieceCoords, setDraggedPieceCoords] = useState <Coords>({col: 0, row: 0})
    const [chessBoardOffsetLeft, setOffsetLeft] = useState <number>(0)
    const [chessBoardOffsetTop, setOffsetTop] = useState <number>(0)
    const [offsetX, setOffsetX] = useState <number>(43.75)
    const [offsetY, setOffsetY] = useState <number>(43.75)
    const [fieldSizes, setFieldSizes] = useState <Array<number>>([])
    const [castleAvailable, setCastleAvailable] = useState <Array<string>>([])
    const [enpassantAvailable, setEnpassantAvailable] = useState <string>(null)
    const [promotedField, setPromotedField] = useState<string>(null)
    const [variant, setVariant] = useState<string>(settings.choosenVariant)
    const [turn, setTurn] = useState <string>('White')

    const chessBoardRef = useRef<HTMLDivElement>(null)

    //changing usable sizes of the board related on it size in browser
    useEffect(() => {
    
        let chessBoard = chessBoardRef.current
    
        function addUpRowsAndCols(chessBoard : HTMLDivElement) : void {

          setOffsetLeft(chessBoard.offsetLeft)
          setOffsetTop(chessBoard.offsetTop)
          const boardWidth  = chessBoard.clientWidth
          const fieldWidth = boardWidth / 8
          setOffsetX(fieldWidth / 2.1)
          setOffsetY(fieldWidth / 1.9)
        
          let fieldStartsOn = 0;
          const fieldStartsOnArr : Array<number> = [];
          
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

    function getFieldCoordinates(x : number, y : number) : Coords {
        //displaying coordinates of the mouse related to the board
        // example: cursor at b3: b = row(2), 3 = col(3)
        // if cursor out the board one of the coords is 0

        //mouse positions(x, y) including borders, and board offset
        x -= chessBoardOffsetLeft + 5
        y -= chessBoardOffsetTop + 5

        const xCoord = x
        const yCoord = y

        const fieldCoords = {row: 0, col: 0}

        if (variant === 'black') {
            x = yCoord
            y = xCoord
        }

        fieldSizes.forEach((fieldStartsOn, index) => {
        if (x >= fieldStartsOn && x <= fieldSizes[index + 1]) {
            const row = index + 1
            variant === 'black' ? fieldCoords.col = row : fieldCoords.row = row
        } 
        })

        const fieldSizesReversed = fieldSizes.slice().reverse()
        fieldSizesReversed.forEach((fieldStartsOn, index) => {
        if (y <= fieldStartsOn && y >= fieldSizesReversed[index + 1]) {
            const col = index + 1
            variant === 'black' ? fieldCoords.row = col : fieldCoords.col = col
        }
        })

        return fieldCoords
    }

    const getMovesThatLeadsToCheck = useCallback((squares : keyableSquares, draggedPiece : IPiece, coords : string) => {
        
        const kingOnCheckAfterThisMoves = {...nullSquares}
        //simulating next move for check
        const moves = draggedPiece.canMove(coords, squares, null, initialPositions)
        moves.forEach((move : string) => {
            const pieceOnField = {
                [coords]: null,
                [move]: draggedPiece
            }
            const simulateNextMoveSquares = {
                ...squares,
                ...pieceOnField
            }

            const simulateNextOppositeMoves = {...nullSquares}
            for (const field in simulateNextMoveSquares) {
                if (simulateNextMoveSquares[field] && simulateNextMoveSquares[field].color !== turn) {
                    const moves = simulateNextMoveSquares[field].canMove
                        (field, simulateNextMoveSquares, null, initialPositions)

                     moves.forEach(move => {
                        if (move) simulateNextOppositeMoves[move] = simulateNextMoveSquares[field]
                    })
                }
            }

            for (const field in simulateNextMoveSquares) {
                if (simulateNextMoveSquares[field] 
                    && simulateNextOppositeMoves[field] 
                    && simulateNextMoveSquares[field].type === 'King' 
                    && simulateNextMoveSquares[field].color === turn)
                    kingOnCheckAfterThisMoves[move] = simulateNextMoveSquares[field]
            }
        })

        return kingOnCheckAfterThisMoves
    }, [turn])
    
    const mated : boolean = useMemo(() => {

        function isMated() : boolean {
    
            //simulating next move for check
            const allLegalMoves = []
            for (const field in squares) {
                if (squares[field]) {
                    if (squares[field].color === turn) {
                        allLegalMoves.push(squares[field].canMove
                            (field, squares, getMovesThatLeadsToCheck(squares, squares[field], field), initialPositions))
                            
                        //checked or not
                        if (squares[field].onCheck) sounds.check.play()
                    }
                }
            }

            if (allLegalMoves.length === 1 && allLegalMoves[0].length === 1 && squares[allLegalMoves[0][0]].type === 'King') setStaleMate(true);
            
            
            
            const mated = allLegalMoves.every(legalMoves => legalMoves.length === 0);

            if(mated) {
                if (variant === 'white') {
                    if (turn === 'Black') sounds.win.play()
                    if (turn === 'White') sounds.lose.play()
                } else {
                    if (turn === 'White') sounds.win.play()
                    if (turn === 'Black') sounds.lose.play()
                }
            }

            return mated
        }
        
        return isMated()
    }, [squares, turn, getMovesThatLeadsToCheck, variant])

    function addActives(moves : Array<string>, currentPiece : string) : keyableString  {
        const movesActiveFields = {}
        moves.forEach((move) => {
            movesActiveFields[move] = 'pieceCanMoveHere'
        })
        movesActiveFields[currentPiece] = 'currentPiece'
        setActiveFields({...activeFields, ...movesActiveFields})
        return movesActiveFields
    }
    
    function removeActives() : void {
        const clearedActiveFields = {}
        for (const field in activeFields) {
            clearedActiveFields[field] = false
        }
        setActiveFields({...clearedActiveFields})
    }

    function dragStart(e : any) : void {

        e.preventDefault() 
        
        if (e.target.classList.contains('whiteField') || e.target.classList.contains('blackField')) return
        
        if (e.target !== draggedPiece) setDraggedPiece(e.target);
        
        if (!e.target.src.includes(turn)) return

        const x = e.clientX
        const y = e.clientY

        const localDraggedPieceCoords = getFieldCoordinates(x, y)
        setDraggedPieceCoords(getFieldCoordinates(x, y))

        const pieceField = alphs.posOut[localDraggedPieceCoords.row].toString() + localDraggedPieceCoords.col.toString()
        const piece = squares[pieceField]
        const moves = piece.canMove
            (pieceField, squares, getMovesThatLeadsToCheck(squares, piece, pieceField), initialPositions)

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
    
    function dragMove(e : any) : void {
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
    
    function drop(e : any) : void {
        if (!draggedPiece) return
        if (!draggedPiece.src.includes(turn)) return
        
        let x = 0
        let y = 0

        x = e.clientX
        y = e.clientY

        const dropCoords = getFieldCoordinates(x, y)
        if (dropCoords.row !== 0 && dropCoords.col !== 0) {
            const pieceFromThisField = alphs.posOut[draggedPieceCoords.row].toString() + draggedPieceCoords.col.toString() 
            const dropField = alphs.posOut[dropCoords.row].toString()  + dropCoords.col.toString() 
            const piece = squares[pieceFromThisField]
            let empassanted = false

            const pieceOnField = {
                [pieceFromThisField]: null,
                [dropField]: piece
            }

            if ((dropField[1] === '1' && piece.type === 'Pawn' && piece.color === 'Black') 
                || (dropField[1] === '8' && piece.type === 'Pawn' && piece.color === 'White')) 
            {
                setPromotedField(dropField)
            }


            if (enpassantAvailable) {
                let enpassantedField : string
                if (piece.color === 'White' && enpassantAvailable.includes('Left')) enpassantedField = alphs.changeAlphPos(pieceFromThisField, '-', 1)
                if (piece.color === 'White' && enpassantAvailable.includes('Right')) enpassantedField = alphs.changeAlphPos(pieceFromThisField, '+', 1)
                if (piece.color === 'Black' && enpassantAvailable.includes('Left')) enpassantedField = alphs.changeAlphPos(pieceFromThisField, '-', 1)
                if (piece.color === 'Black' && enpassantAvailable.includes('Right')) enpassantedField = alphs.changeAlphPos(pieceFromThisField, '+', 1)
                if (dropField === alphs.changeAlphPos(pieceFromThisField, '+', 1, '+', 1) 
                    || dropField === alphs.changeAlphPos(pieceFromThisField, '+', 1, '-', 1)
                    || dropField === alphs.changeAlphPos(pieceFromThisField, '-', 1, '-', 1)
                    || dropField === alphs.changeAlphPos(pieceFromThisField, '-', 1, '+', 1)) 
                    {
                        pieceOnField[enpassantedField] = null
                        empassanted = true
                    }
            }
            
            if (castleAvailable) {

                const kingMovedLeft = (alphs.changeAlphPos(pieceFromThisField, '-', 2) === dropField)
                const kingMovedRight = (alphs.changeAlphPos(pieceFromThisField, '+', 2) === dropField)
                let castledRookLeft : string
                let castledRookRight : string
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
                || !activeFields[dropField]
                || piece === squares[dropField]) {
                //if we clicked on illegal move field - reset all states and return
                draggedPiece.setAttribute('style', '');
                setDraggedPiece(null)
                removeActives()
                return 
            }

            setSquares(squares => ({
                ...squares,
                ...pieceOnField,
            }))

            if (squares[dropField] || empassanted) {
                sounds.takePiece.play()
            } else {
                sounds.placePiece.play()
            }

            //last moves
            makedMoves.push(`${piece.color} ${piece.type} ${pieceFromThisField} to ${dropField}`)
            rawMakedMoves.push(`${piece.type.slice(0, 1)}${pieceFromThisField}`)
            if (piece.lastMoves) piece.lastMoves.push(pieceFromThisField)
            console.log(makedMoves); // all played moves here!

            setEnpassantAvailable(null)
            draggedPiece.setAttribute('style', '');
            setTurn(turn === 'White' ? 'Black' : 'White')
            setDraggedPiece(null)   
            removeActives()
        } else {
            draggedPiece.setAttribute('style', '');
            setDraggedPiece(null)
            removeActives()
            return 
        }
    }

    function restartGame() : void {
        sounds.newGame.play()
        setSquares(initialPositions)
        setStaleMate(false)
        setTurn('White')
        setVariant(variant === 'white' ? 'black' : 'white')
    }

    return (
        <div className='board' ref={chessBoardRef} onMouseMove={e => dragMove(e)}>
            <DefineSide setVariant={setVariant}/>
            <PieceFields
                squares={squares} 
                activeFields={activeFields}
                variant={variant}
                dragStart={dragStart} 
                dragMove={dragMove} 
                drop={drop} 
                touch2Mouse={touch2Mouse}
            />
            <Promotion 
                promotedField={promotedField} 
                setPromotedField={setPromotedField} 
                turn={turn} 
                squares={squares} 
                setSquares={setSquares}
            />
            <MatedMessage turn={turn} restartGame={restartGame} mated={mated} isStaleMate={isStaleMate}/>
        </div>
    )
}