import React from 'react';
import {useState, useEffect, useRef, useMemo, ReactElement, createContext} from 'react'

import { isKeyableString, keyableNumbers, keyableString } from '../interfaces/keyable';
import Coords from '../interfaces/Coords';

import { getMovesThatLeadsToCheck, isMated } from '../services/board/checkAndMateHandler';
import { addActives, removeActives } from '../services/board/setActives';
import { setCastle, setEnpassant } from '../services/board/dragStartHandlers';
import { checkForCastle, checkForEnpassant } from '../services/board/dropHandlers';
import getFieldCoordinates from '../services/board/getFieldCoordinates';
import getSquares from "../services/board/getSquares";

import sounds, { playTakedPieceSound } from '../services/misc/sounds'
import alphs from '../services/math/alphabetPositions'
import touch2Mouse from '../services/misc/touch2mouse'

import setupBoard from '../configs/setupBoard'

import PieceFields from './board components/PieceFields'
import PlayedMoves from './board components/PlayedMoves';
import MatedMessage from './board components/MatedMessage';
import Promotion from './board components/Promotion';
import Timer from './timer/Timers';
import StartingSettings from './board components/StartingSettings';
import Player from '../services/player';
import {stopAllTimers, stopAndStartPlayerTime} from '../services/updatePlayerTime';

import socket from '../connection/socket';

const playedMoves = []
const rawMakedMoves = []
export { rawMakedMoves }
const initialPositions = setupBoard()

export const boardContext = createContext(null)

const playerWhite = new Player('White', 60000, false)
const playerBlack = new Player('Black', 60000, false)

export default function Board() : ReactElement {

    const [squares, setSquares] = useState(initialPositions)
    const [activeFields, setActiveFields] = useState(getSquares(null))
    const [draggedPiece, setDraggedPiece] = useState <HTMLImageElement>(null)
    const [clickedPiece, setClickedPiece] = useState <HTMLImageElement>(null)
    const [isStaleMate, setStaleMate] = useState <boolean>(false)
    const [draggedPieceCoords, setDraggedPieceCoords] = useState <Coords>({col: 0, row: 0})
    const [chessBoardOffsets, setChessBoardOffsets] = useState <keyableNumbers>({left: 0, top: 0})
    const [fieldOffsets, setFieldOffsets] = useState <keyableNumbers>({x: 43.75, y: 43.75})
    const [fieldSizes, setFieldSizes] = useState <Array<number>>([])
    const [castleAvailable, setCastleAvailable] = useState <Array<string>>([])
    const [enpassantAvailable, setEnpassantAvailable] = useState <string>(null)
    const [promotedField, setPromotedField] = useState <string>(null)
    const [variant, setVariant] = useState <string>('notChoosen')
    const [turn, setTurn] = useState <string>('White')
    const [isSettingsReady, setSettingsReady] = useState <boolean>(false)
    const [isTimerSet, setIsTimerSet] = useState <boolean>(false)
    const [timeExpired, setTimeExpired] = useState <boolean>(false)

    const boardContextValue = {
        variant, 
        setVariant, 
        turn, 
        squares,
        isSettingsReady,
        setSettingsReady,
        timeExpired,
        setTimeExpired,
        isTimerSet,
        setIsTimerSet,
        playerWhite,
        playerBlack,
    }

    const chessBoardRef = useRef<HTMLDivElement>(null)

    //changing usable sizes of the board related on it size in browser
    useEffect(() => {
    
        let chessBoard = chessBoardRef.current
    
        function addUpRowsAndCols(chessBoard : HTMLDivElement) : void {

          setChessBoardOffsets({left: chessBoard.offsetLeft, top: chessBoard.offsetTop})

          const boardWidth  = chessBoard.clientWidth
          const fieldWidth = boardWidth / 8

          setFieldOffsets({x: fieldWidth / 2.1, y: fieldWidth / 1.9})
        
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

    
    const mated : boolean = useMemo(() => {
        const matedOrStaleMated = isMated(squares, turn)
        
        if (typeof matedOrStaleMated === 'string') {
            setStaleMate(true)
        } else {
            return matedOrStaleMated
        }
    }, [squares, turn])
    
    socket.on('piece-on-field', (pieceOnFieldData) => {
        const pieceOnField = {}

        for (const [key, value] of Object.entries(pieceOnFieldData)) {
            if (value && isKeyableString(value)) {
                pieceOnField[key] = squares[value.from]
            } else {
                pieceOnField[key] = null
            }
        }
        
        setSquares({...squares, ...pieceOnField})
    })

    function click(e : any, field : string) : void {
        if (!e.target.classList.contains('canMoveHere') || !isSettingsReady) return
        if (activeFields[field] || e.nativeEvent.path[1].classList.contains('canMoveHere')) {
            drop(e)
        }
    }

    function dragStart(e : any) : void {

        e.preventDefault() 

        if (!isSettingsReady) return
        
        if (e.target.src.includes(turn)) setClickedPiece(e.target)
        
        if (e.target.classList.contains('whiteField') || e.target.classList.contains('blackField')) return
        
        if (e.target !== draggedPiece && e.target.src.includes(turn)) setDraggedPiece(e.target);
        
        if (!e.target.src.includes(turn)) return
        
        const x = e.clientX
        const y = e.clientY

        const coords = {x: e.clientX, y: e.clientY}
        
        const localDraggedPieceCoords = getFieldCoordinates(coords, chessBoardOffsets, fieldSizes, variant)
        setDraggedPieceCoords(localDraggedPieceCoords)

        const pieceField = alphs.posOut[localDraggedPieceCoords.row].toString() + localDraggedPieceCoords.col.toString()
        const piece = squares[pieceField]
        const moves = piece.canMove
            (pieceField, squares, getMovesThatLeadsToCheck(squares, piece, pieceField, turn), initialPositions)

        setEnpassant(moves, piece, setEnpassantAvailable)
        setCastle(moves, piece, setCastleAvailable)
        addActives(moves, pieceField, setActiveFields)
        
        e.target.style.position = 'absolute'
        e.target.style.left = `${x - fieldOffsets.x}px`
        e.target.style.top = `${y - fieldOffsets.y}px`
    }
    
    function dragMove(e : any) : void {
        if (!draggedPiece) return
        if (!draggedPiece.src.includes(turn)) return

        const x = e.clientX - fieldOffsets.x
        const y = e.clientY - fieldOffsets.y
    
        draggedPiece.style.position = 'absolute'
        draggedPiece.style.left = `${x}px`
        draggedPiece.style.top = `${y}px`
    }
    
    function drop(e : any) : void {
        
        if (!draggedPiece && !clickedPiece) return
        
        if (draggedPiece && !draggedPiece.src.includes(turn)) return

        const coords = {x: e.clientX, y: e.clientY}

        const dropCoords = getFieldCoordinates(coords, chessBoardOffsets, fieldSizes, variant)
        
        if (dropCoords.row !== 0 && dropCoords.col !== 0) {
            const pieceFromThisField = alphs.posOut[draggedPieceCoords.row].toString() + draggedPieceCoords.col.toString() 
            const dropField = alphs.posOut[dropCoords.row].toString()  + dropCoords.col.toString() 
            const piece = squares[pieceFromThisField]
            let empassanted = false
            let castledRookInitialField = null

            let pieceOnField = {
                [pieceFromThisField]: null,
                [dropField]: piece
            }

            const pieceOnFieldForServer = {}

            if (enpassantAvailable) {
                const enpassantedFields = checkForEnpassant(squares, dropField, pieceFromThisField, enpassantAvailable)
                pieceOnField = {...pieceOnField, ...enpassantedFields}
                empassanted = true
            }

            if (castleAvailable.length) {
                const castledFields = checkForCastle(squares, dropField, pieceFromThisField, castleAvailable)
                pieceOnField = {...pieceOnField, ...castledFields.modifiedPieceOnField}
                castledRookInitialField = castledFields.rookInitialPieceField
            }

            const IllegalMove = squares[dropField]?.color === piece.color || !activeFields[dropField]
            const tryingToMoveOnInitialField = piece === squares[dropField]

            if (IllegalMove) {
                if (tryingToMoveOnInitialField) {
                    if (draggedPiece) draggedPiece.setAttribute('style', '');
                    setDraggedPiece(null)
                    return
                }
                resetAll(draggedPiece)
                return 
            }

            const blackPawnOnPromotionField = (dropField[1] === '1' && piece.type === 'Pawn' && piece.color === 'Black')
            const whitePawnOnPromotionField = (dropField[1] === '8' && piece.type === 'Pawn' && piece.color === 'White')
            const pawnOnPromotionField = (blackPawnOnPromotionField || whitePawnOnPromotionField)

            if (pawnOnPromotionField && piece.color === turn) setPromotedField(dropField)
            
            setSquares({...squares, ...pieceOnField})
            const currentPlayer = turn === 'White' ? playerWhite : playerBlack

            stopAndStartPlayerTime(currentPlayer, [playerWhite, playerBlack])
            playTakedPieceSound(squares[dropField], empassanted)

            for (const [key, value] of Object.entries(pieceOnField)) {
                if (value) {
                    if (castleAvailable) {
                        if (value.type === 'Rook') {
                            pieceOnFieldForServer[key] = {
                                type: value.type,
                                from: castledRookInitialField
                            }
                            continue
                        }
                    }
                    pieceOnFieldForServer[key] = {
                        type: value.type,
                        from: pieceFromThisField
                    }
                } else {
                    pieceOnFieldForServer[key] = null
                }
            }

            socket.emit('move-played', pieceOnFieldForServer)

            //last moves, all played moves here!
            playedMoves.push(`${piece.color} ${piece.type} ${pieceFromThisField} to ${dropField}`)
            rawMakedMoves.push(`${piece.type.slice(0, 1)}${pieceFromThisField}`)
            if (piece.lastMoves) piece.lastMoves.push(pieceFromThisField)
            //

            resetAll(draggedPiece)
            setTurn(turn === 'White' ? 'Black' : 'White')
        } else {
            resetAll(draggedPiece)
        }
    }

    function resetAll(draggedPiece : HTMLImageElement) {
        if (draggedPiece) draggedPiece.setAttribute('style', '');
        setEnpassantAvailable(null)
        setDraggedPiece(null)
        setClickedPiece(null)  
        removeActives(activeFields, setActiveFields)
    }

    function restartGame() : void {
        sounds.newGame.play()
        setSquares(initialPositions)
        setStaleMate(false)
        setTimeExpired(false)
        setIsTimerSet(false)
        playerBlack.timer = 60000
        playerWhite.timer = 60000
        stopAllTimers([playerWhite, playerBlack])
        setTurn('White')
        setVariant(variant === 'white' ? 'black' : 'white')
    }

    return (
        <boardContext.Provider value={boardContextValue}>
            <div className='board-wrapper'>
                <StartingSettings/>
                <Timer/>
                <div className='board' ref={chessBoardRef} onMouseMove={e => dragMove(e)}>
                    <PieceFields
                        squares={squares} 
                        activeFields={activeFields}
                        variant={variant}
                        click={click}
                        dragStart={dragStart} 
                        dragMove={dragMove} 
                        drop={drop} 
                        touch2Mouse={touch2Mouse}
                    />
                </div>
                <Promotion 
                    promotedField={promotedField} 
                    setPromotedField={setPromotedField} 
                    turn={turn} 
                    squares={squares} 
                    setSquares={setSquares}
                />
                <MatedMessage 
                    restartGame={restartGame} 
                    mated={mated} 
                    isStaleMate={isStaleMate}
                />
                <PlayedMoves playedMoves={playedMoves}/>
            </div>
        </boardContext.Provider>
    )
}