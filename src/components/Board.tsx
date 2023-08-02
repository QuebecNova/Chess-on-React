import React from 'react'
import { useState, useRef, ReactElement, createContext } from 'react'

import Coords from '../types/Coords'
import { keyablePieceOnField } from '../types/keyable'

import { getMovesThatLeadsToCheck } from '../helpers/board/checkAndMateHandler'
import { addActives, removeActives } from '../helpers/board/setActives'
import { setCastle, setEnpassant } from '../helpers/board/dragStartHandlers'
import {
    checkForCastle,
    checkForEnpassant,
} from '../helpers/board/dropHandlers'
import { isDragStartIllegal } from '../helpers/board/dragNDropLegals'
import { getPieceOnFieldForServer } from '../helpers/board/getPieceForServer'
import { parsePieceOnField } from '../helpers/board/parsePieceOnField'
import getFieldCoordinates from '../helpers/board/getFieldCoordinates'
import getSquares from '../helpers/board/getSquares'

import alphs from '../helpers/math/alphabetPositions'
import sounds, { playPlacedPieceSound } from '../helpers/misc/sounds'
import touch2Mouse from '../helpers/misc/touch2mouse'
import { stopAndStartPlayerTime } from '../helpers/updatePlayerTime'

import setupBoard from '../configs/setupBoard'

import PieceFields from './board components/PieceFields'
import PlayedMoves from './board components/PlayedMoves'
import MatedMessage from './board components/MatedMessage'
import Promotion from './board components/Promotion'
import StartingSettings from './board components/StartingSettings'
import { playerWhite, playerBlack } from './board components/DefineSide'
import Chat from './board components/Chat'
import AcceptRestart from './board components/AcceptRestart'
import Timer from './timer/Timers'

import socket from '../services/socket'
import settings from '../configs/settings'
import { useChessBoardOffsets } from '../hooks/useOffsets'
import { useMated } from './../hooks/useMated'

const playedMoves = []
const initialPositions = setupBoard()

export const rawMakedMoves = []
export const boardContext = createContext(null)

export default function Board() {
    //this is main board state (store if you prefer)
    const [squares, setSquares] = useState(initialPositions)
    const [activeFields, setActiveFields] = useState(getSquares(null))
    const [draggedPiece, setDraggedPiece] = useState<HTMLImageElement>(null)
    const [clickedPiece, setClickedPiece] = useState<HTMLImageElement>(null)
    const [draggedPieceCoords, setDraggedPieceCoords] = useState<Coords>({
        col: 0,
        row: 0,
    })
    const [castleAvailable, setCastleAvailable] = useState<Array<string>>([])
    const [enpassantAvailable, setEnpassantAvailable] = useState<string>(null)
    const [promotedField, setPromotedField] = useState<string>(null)
    const [variant, setVariant] = useState<string>('notChoosen')
    const [turn, setTurn] = useState<string>('White')
    const [isSettingsReady, setSettingsReady] = useState<boolean>(false)
    const [isTimerSet, setIsTimerSet] = useState<boolean>(false)
    const [timeExpired, setTimeExpired] = useState<boolean>(false)
    const [opponnentWantsRestart, setOpponentWantsRestart] =
        useState<boolean>(false)
    //

    //value for useContext
    const boardContextValue = {
        variant,
        setVariant,
        turn,
        squares,
        setSquares,
        isSettingsReady,
        setSettingsReady,
        timeExpired,
        setTimeExpired,
        isTimerSet,
        setIsTimerSet,
        playerWhite,
        playerBlack,
        opponnentWantsRestart,
        setOpponentWantsRestart,
        restartGame,
    }
    //

    //getting offsets for correct drag-n-drop functionality
    //this helps to handle different screen sizes and when it changes
    const chessBoardRef = useRef<HTMLDivElement>(null)
    const [chessBoardOffsets, fieldOffsets, fieldSizes] =
        useChessBoardOffsets(chessBoardRef)
    //

    //mated or stalemated states for count win/draw
    const [mated, isStaleMate] = useMated(squares, turn)

    //listening on event, when another player send you restart game
    socket.on('player-restarted-game', () => {
        setOpponentWantsRestart(true)
    })
    //

    /* when another player sends to server move-played event
       this events fires, and we parse raw played move data to
       valid data, play sounds, change turn and start/stop players timers */
    socket.on('piece-on-field', (pieceOnFieldData: keyablePieceOnField) => {
        const pieceOnField = parsePieceOnField(pieceOnFieldData, squares)
        setSquares({ ...squares, ...pieceOnField })

        playPlacedPieceSound()
        setTurn(turn === 'White' ? 'Black' : 'White')

        const currentPlayer = turn === 'White' ? playerWhite : playerBlack
        stopAndStartPlayerTime(currentPlayer, [playerWhite, playerBlack])
    })
    //

    //click handler for possibility to place piece on click
    function click(e: any, field: string): void {
        if (!e.target.classList.contains('canMoveHere') || !isSettingsReady)
            return
        if (
            activeFields[field] ||
            e.nativeEvent.path[1].classList.contains('canMoveHere')
        ) {
            drop(e)
        }
    }
    //

    //drag start function for taking pieces
    function dragStart(e: any): void {
        e.preventDefault()

        if (isDragStartIllegal(e, isSettingsReady, playerWhite, playerBlack))
            return

        if (e.target.parentNode.dataset.color.includes(turn)) setClickedPiece(e.target)
        if (e.target !== draggedPiece && e.target.parentNode.dataset.color.includes(turn))
            setDraggedPiece(e.target)
        if (!e.target.parentNode.dataset.color.includes(turn)) return

        //mouse coordinates
        const x: number = e.clientX
        const y: number = e.clientY

        const coords = { x: e.clientX, y: e.clientY }

        const localDraggedPieceCoords = getFieldCoordinates(
            coords,
            chessBoardOffsets,
            fieldSizes,
            variant
        )
        setDraggedPieceCoords(localDraggedPieceCoords)

        //getting all legal moves and display that on board
        const pieceField =
            alphs.posOut[localDraggedPieceCoords.row].toString() +
            localDraggedPieceCoords.col.toString()
        const piece = squares[pieceField]
        const moves = piece.canMove(
            pieceField,
            squares,
            getMovesThatLeadsToCheck(squares, piece, pieceField, turn),
            initialPositions
        )

        setEnpassant(moves, piece, setEnpassantAvailable)
        setCastle(moves, piece, setCastleAvailable)
        addActives(moves, pieceField, setActiveFields)

        //moving static piece image to cursor (field offsets needed to center piece on cursor)
        e.target.style.position = 'absolute'
        e.target.style.left = `${x - fieldOffsets.x}px`
        e.target.style.top = `${y - fieldOffsets.y}px`
    }
    //

    //drag move function for moving taked pieces
    function dragMove(e: any): void {
        if (!draggedPiece) return
        if (!draggedPiece.parentNode.dataset.color.includes(turn)) return

        //mouse coordinates (field offsets included)
        const x = e.clientX - fieldOffsets.x
        const y = e.clientY - fieldOffsets.y

        //moving static piece image to cursor when move it
        draggedPiece.style.position = 'absolute'
        draggedPiece.style.left = `${x}px`
        draggedPiece.style.top = `${y}px`
    }
    //

    //drag start function for drop taked pieces
    function drop(e: any): void {
        if (!draggedPiece && !clickedPiece) return
        if (draggedPiece && !draggedPiece.parentNode.dataset.color.includes(turn)) return

        const coords = { x: e.clientX, y: e.clientY }

        const dropCoords = getFieldCoordinates(
            coords,
            chessBoardOffsets,
            fieldSizes,
            variant
        )

        //start this calculations only when dropfield is valid (not aside board)
        //if dropfield not valid => call resetAll()
        if (dropCoords.row !== 0 && dropCoords.col !== 0) {
            //getting piece data
            const pieceFromThisField =
                alphs.posOut[draggedPieceCoords.row].toString() +
                draggedPieceCoords.col.toString()
            const dropField =
                alphs.posOut[dropCoords.row].toString() +
                dropCoords.col.toString()
            const piece = squares[pieceFromThisField]

            let pieceOnField = {
                [pieceFromThisField]: null,
                [dropField]: piece,
            }

            //empassant and castle dataset
            let empassanted = false
            let castledRookInitialField: string | null = null

            if (enpassantAvailable) {
                const enpassantedFields = checkForEnpassant(
                    squares,
                    dropField,
                    pieceFromThisField,
                    enpassantAvailable
                )
                pieceOnField = { ...pieceOnField, ...enpassantedFields }
                empassanted = true
            }

            if (castleAvailable.length) {
                const castledFields = checkForCastle(
                    squares,
                    dropField,
                    pieceFromThisField,
                    castleAvailable
                )
                pieceOnField = {
                    ...pieceOnField,
                    ...castledFields.modifiedPieceOnField,
                }
                castledRookInitialField = castledFields.rookInitialPieceField
            }
            //

            //checking if move illegal (ex: trying to move same colors pieces on eachother)
            //if true => return
            const IllegalMove =
                squares[dropField]?.color === piece.color ||
                !activeFields[dropField]
            const tryingToMoveOnInitialField = piece === squares[dropField]

            if (IllegalMove) {
                if (tryingToMoveOnInitialField) {
                    if (draggedPiece) draggedPiece.setAttribute('style', '')
                    setDraggedPiece(null)
                    return
                }
                resetAll(draggedPiece)
                return
            }
            //

            //handling promotions for pawns
            const blackPawnOnPromotionField =
                dropField[1] === '1' &&
                piece.type === 'Pawn' &&
                piece.color === 'Black'
            const whitePawnOnPromotionField =
                dropField[1] === '8' &&
                piece.type === 'Pawn' &&
                piece.color === 'White'
            const pawnOnPromotionField =
                blackPawnOnPromotionField || whitePawnOnPromotionField

            if (pawnOnPromotionField && piece.color === turn)
                setPromotedField(dropField)
            //

            //finally, setting squares data with placed piece
            setSquares({ ...squares, ...pieceOnField })

            const currentPlayer = turn === 'White' ? playerWhite : playerBlack
            stopAndStartPlayerTime(currentPlayer, [playerWhite, playerBlack])
            playPlacedPieceSound(squares[dropField], empassanted)
            //

            //sending moved piece data to server if not in offline mode
            const pieceOnFieldForServer = getPieceOnFieldForServer(
                pieceOnField,
                castleAvailable,
                castledRookInitialField,
                pieceFromThisField
            )

            if (!settings.offlineMode)
                socket.emit('move-played', pieceOnFieldForServer)
            //

            //setting last played moves
            playedMoves.push(
                `${piece.color} ${piece.type} ${pieceFromThisField} to ${dropField}`
            )
            rawMakedMoves.push(`${piece.type.slice(0, 1)}${pieceFromThisField}`)
            if (piece.lastMoves) piece.lastMoves.push(pieceFromThisField)
            //

            //resetting board and piece states and changing turn
            resetAll(draggedPiece)
            setTurn(turn === 'White' ? 'Black' : 'White')
        } else {
            resetAll(draggedPiece)
        }
    }
    //

    //reset board and piece states
    function resetAll(draggedPiece: HTMLImageElement) {
        if (draggedPiece) draggedPiece.setAttribute('style', '')
        setEnpassantAvailable(null)
        setDraggedPiece(null)
        setClickedPiece(null)
        removeActives(activeFields, setActiveFields)
    }
    //

    //restart game with changing players colors that they play
    function restartGame(): void {
        sounds.newGame.play()
        setSquares(initialPositions)
        setTimeExpired(false)
        setIsTimerSet(false)
        playerBlack.timer = 60000
        playerWhite.timer = 60000
        playedMoves.length = 0

        //changing players colors
        if (playerBlack.isYou) {
            playerBlack.isYou = false
            playerWhite.isYou = true
        } else if (playerWhite.isYou) {
            playerWhite.isYou = false
            playerBlack.isYou = true
        }
        setTurn('White')
        setVariant(variant === 'white' ? 'black' : 'white')
        //
    }
    //

    return (
        <boardContext.Provider value={boardContextValue}>
            <div className="board-wrapper">
                <StartingSettings />
                <Timer />
                <div
                    className="board"
                    ref={chessBoardRef}
                    onMouseMove={(e) => dragMove(e)}
                >
                    <PieceFields
                        activeFields={activeFields}
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
                />
                <MatedMessage
                    restartGame={restartGame}
                    mated={mated}
                    isStaleMate={isStaleMate}
                />
                <AcceptRestart />
                <PlayedMoves playedMoves={playedMoves} />
                <Chat />
            </div>
        </boardContext.Provider>
    )
}
