'use client'
import { createContext, useEffect, useRef, useState } from 'react'

import Coords from 'src/5.entities/model/types/Coords'
import { KeyablePieceOnField } from 'src/5.entities/model/types/Keyable'

import { getPieceOnFieldForServer } from 'src/4.features/lib/helpers/getPieceForServer'
import getSquares from 'src/4.features/lib/helpers/getSquares'
import { parsePieceOnField } from 'src/4.features/lib/helpers/parsePieceOnField'
import {
    addActives,
    removeActives,
} from 'src/4.features/lib/helpers/setActives'
import { getMovesThatLeadsToCheck } from 'src/6.shared/lib/helpers/board/checkAndMateHandler'
import { isDragStartIllegal } from 'src/6.shared/lib/helpers/board/dragNDropLegals'
import {
    setCastle,
    setEnpassant,
} from 'src/6.shared/lib/helpers/board/dragStartHandlers'
import {
    checkForCastle,
    checkForEnpassant,
} from 'src/6.shared/lib/helpers/board/dropHandlers'
import getFieldCoordinates from 'src/6.shared/lib/helpers/board/getFieldCoordinates'

import alphs from 'src/6.shared/lib/helpers/math/alphabetPositions'
import sounds, {
    playPlacedPieceSound,
} from 'src/6.shared/lib/helpers/misc/playSounds'
import touch2Mouse from 'src/6.shared/lib/helpers/misc/touch2mouse'
import { stopAndStartPlayerTime } from 'src/6.shared/lib/helpers/updatePlayerTime'

import setupBoard from 'src/3.widgets/config/setupBoard'

import Promotion from 'src/4.features/ui/board/Promotion'
import AcceptRestart from 'src/4.features/ui/gameState/AcceptRestart'
import Chat from 'src/4.features/ui/gameState/Chat'
import {
    playerBlack,
    playerWhite,
} from 'src/4.features/ui/gameState/DefineSide'
import MatedMessage from 'src/4.features/ui/gameState/MatedMessage'
import PlayedMoves from 'src/4.features/ui/gameState/PlayedMoves'
import StartingSettings from 'src/4.features/ui/gameState/StartingSettings'
import PieceFields from 'src/5.entities/ui/PieceFields'
import Timers from './Timers'

import { useMated } from 'src/4.features/lib/hooks/useMated'
import socket from 'src/6.shared/api/socket'
import settings from 'src/6.shared/config/settings'
import { useChessBoardOffsets } from 'src/6.shared/lib/hooks/useOffsets'
import { Colors, FieldStates, Pieces } from 'src/6.shared/model/constants/board'

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
    const [turn, setTurn] = useState<string>(Colors.White)
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
    //this helps to handle different screen sizes and when the screen size changes
    const chessBoardRef = useRef<HTMLDivElement>(null)
    const [chessBoardOffsets, fieldOffsets, fieldSizes, fieldWidth] =
        useChessBoardOffsets(chessBoardRef)
    //

    //mated or stalemated states for count win/draw
    const [mated, isStaleMate] = useMated(squares, turn)

    useEffect(() => {})
    //listening on event, when another player send you request for restart a game
    socket.on('player-restarted-game', () => {
        setOpponentWantsRestart(true)
    })
    //

    /* when another player sends to server move-played event
       this events fires, and we parse raw played move data to
       valid data, play sounds, change turn and start/stop players timers */
    socket.on('piece-on-field', (pieceOnFieldData: KeyablePieceOnField) => {
        const pieceOnField = parsePieceOnField(pieceOnFieldData, squares)
        setSquares({ ...squares, ...pieceOnField })

        playPlacedPieceSound()
        setTurn(turn === Colors.White ? Colors.Black : Colors.White)

        const currentPlayer = turn === Colors.White ? playerWhite : playerBlack
        stopAndStartPlayerTime(currentPlayer, [playerWhite, playerBlack])
    })
    //

    //click handler for possibility to place piece on click
    function click(e: any, field: string): void {
        if (
            !e.target.classList.contains(FieldStates.PieceCanMoveHere) ||
            !isSettingsReady
        )
            return
        if (
            activeFields[field] ||
            e.nativeEvent.path[1].classList.contains(
                FieldStates.PieceCanMoveHere
            )
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

        if (e.target.dataset.color.includes(turn)) setClickedPiece(e.target)
        if (e.target !== draggedPiece && e.target.dataset.color.includes(turn))
            setDraggedPiece(e.target)
        if (!e.target.dataset.color.includes(turn)) return

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
        e.target.style.width = `${fieldWidth}px`
    }
    //

    //drag move function for moving taked pieces
    function dragMove(e: any): void {
        if (!draggedPiece) return
        if (!(draggedPiece as HTMLElement).dataset.color.includes(turn)) return

        //mouse coordinates (field offsets included)
        const x = e.clientX - fieldOffsets.x
        const y = e.clientY - fieldOffsets.y

        //moving static piece image to cursor when move it
        draggedPiece.style.position = 'absolute'
        draggedPiece.style.left = `${x}px`
        draggedPiece.style.top = `${y}px`
    }
    //

    //drag start function for dropping pieces
    function drop(e: any): void {
        if (!draggedPiece && !clickedPiece) return
        if (
            draggedPiece &&
            !(draggedPiece as HTMLElement).dataset.color.includes(turn)
        )
            return

        const coords = { x: e.clientX, y: e.clientY }

        const dropCoords = getFieldCoordinates(
            coords,
            chessBoardOffsets,
            fieldSizes,
            variant
        )

        //start this calculations only when dropfield is valid (not outside board)
        //if dropfield is not valid => call resetAll()
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
                piece.type === Pieces.Pawn &&
                piece.color === Colors.Black
            const whitePawnOnPromotionField =
                dropField[1] === '8' &&
                piece.type === Pieces.Pawn &&
                piece.color === Colors.White
            const pawnOnPromotionField =
                blackPawnOnPromotionField || whitePawnOnPromotionField

            if (pawnOnPromotionField && piece.color === turn)
                setPromotedField(dropField)
            //

            //finally, setting squares data with placed piece
            setSquares({ ...squares, ...pieceOnField })

            const currentPlayer =
                turn === Colors.White ? playerWhite : playerBlack
            stopAndStartPlayerTime(currentPlayer, [playerWhite, playerBlack])
            playPlacedPieceSound(squares[dropField], empassanted)
            //

            //sending moved piece data to server if not in offline mode
            if (!settings.offlineMode) {
                const pieceOnFieldForServer = getPieceOnFieldForServer(
                    pieceOnField,
                    castleAvailable,
                    castledRookInitialField,
                    pieceFromThisField
                )

                socket.emit('move-played', pieceOnFieldForServer)
                console.log(pieceOnFieldForServer)
            }
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
            setTurn(turn === Colors.White ? Colors.Black : Colors.White)
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
        setTurn(Colors.White)
        setVariant(variant === Colors.White ? Colors.Black : Colors.White)
        //
    }
    //

    return (
        <boardContext.Provider value={boardContextValue}>
            <div className="board-wrapper">
                <StartingSettings />
                <Timers />
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
                    fieldWidth={fieldWidth}
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
