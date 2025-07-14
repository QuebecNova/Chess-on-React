'use client'

import { useEffect, useRef, useState } from 'react'

import {
    addActives,
    checkForCastle,
    checkForEnpassant,
    getFieldCoordinates,
    getMovesThatLeadsToCheck,
    getPieceOnFieldForServer,
    getSquares,
    isDragStartIllegal,
    parsePieceOnField,
    playPlacedPieceSound,
    removeActives,
    setCastle,
    setEnpassant,
    stopAndStartPlayerTime,
} from 'src/4.features/lib/helpers'

import { touch2Mouse } from 'src/6.shared/lib/helpers'

import PieceFields from 'src/4.features/ui/board/PieceFields'

import { setupBoard } from 'src/4.features/config/setupBoard'
import { useChessBoardOffsets } from 'src/4.features/lib/hooks'
import { useGameStore } from 'src/4.features/model/providers'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { alphs } from 'src/5.entities/lib'
import { Coords, KeyablePieceOnField } from 'src/5.entities/model'
import { socket } from 'src/6.shared/api'
import { settings } from 'src/6.shared/config/settings'
import { Colors, FieldStates, Pieces } from 'src/6.shared/model'
import Promotion from './Promotion'

// export const rawMadeMoves = []

//there should be board itself
export default function Board() {
    const dispatch = useGameStore((state) => state.dispatch)
    const isSettingsReady = useGameStore((state) => state.isSettingsReady)
    const playedMoves = useGameStore((state) => state.playedMoves)
    const players = useGameStore((state) => state.players)
    const squares = useGameStore((state) => state.squares)
    const turn = useGameStore((state) => state.turn)
    const variant = useGameStore((state) => state.variant)
    //this is main board state (store if you prefer)
    const [activeFields, setActiveFields] = useState(getSquares(null))
    const [draggedPiece, setDraggedPiece] = useState<HTMLImageElement>(null)
    const [clickedPiece, setClickedPiece] = useState<HTMLImageElement>(null)
    const [draggedPieceCoords, setDraggedPieceCoords] = useState<Coords>({
        col: 0,
        row: 0,
    })
    const [castleAvailable, setCastleAvailable] = useState<Array<string>>([])
    const [enpassantAvailable, setEnpassantAvailable] = useState<string>(null)
    //

    //getting offsets for correct drag-n-drop functionality
    //this helps to handle different screen sizes and when the screen size changes
    const chessBoardRef = useRef<HTMLDivElement>(null)
    const [chessBoardOffsets, fieldOffsets, fieldSizes, fieldWidth] =
        useChessBoardOffsets(chessBoardRef)
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

        if (
            isDragStartIllegal(
                e,
                isSettingsReady,
                players[Colors.White],
                players[Colors.Black]
            )
        )
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
            setupBoard()
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
                console.log(enpassantedFields)
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
                dispatch({
                    type: GameActionTypes.PROMOTED_FIELD,
                    payload: { promotedField: dropField },
                })
            //
            console.log(pieceOnField)
            //finally, setting squares data with placed piece
            dispatch({
                type: GameActionTypes.SQUARES,
                payload: { squares: { ...squares, ...pieceOnField } },
            })

            const currentPlayer =
                turn === Colors.White
                    ? players[Colors.White]
                    : players[Colors.Black]
            stopAndStartPlayerTime(currentPlayer, [
                players[Colors.White],
                players[Colors.Black],
            ])
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
            // rawMadeMoves.push(`${piece.type.slice(0, 1)}${pieceFromThisField}`)
            if (piece.lastMoves) piece.lastMoves.push(pieceFromThisField)
            //

            //resetting board and piece states and changing turn
            resetAll(draggedPiece)
            switchTurn()
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

    useEffect(() => {
        socket.on('piece-on-field', (pieceOnFieldData: KeyablePieceOnField) => {
            const pieceOnField = parsePieceOnField(pieceOnFieldData, squares)
            dispatch({
                type: GameActionTypes.SQUARES,
                payload: { squares: { ...squares, ...pieceOnField } },
            })

            playPlacedPieceSound()
            switchTurn()

            const currentPlayer =
                turn === Colors.White
                    ? players[Colors.White]
                    : players[Colors.Black]
            stopAndStartPlayerTime(currentPlayer, [
                players[Colors.White],
                players[Colors.Black],
            ])
        })

        return () => {
            socket.removeListener('piece-on-field')
        }
    }, [])

    function switchTurn() {
        dispatch({
            type: GameActionTypes.TURN,
            payload: {
                turn: turn === Colors.White ? Colors.Black : Colors.White,
            },
        })
    }
    return (
        <>
            <div
                className="board"
                ref={chessBoardRef}
                onMouseMove={(e) => dragMove(e)}
            >
                <PieceFields
                    fieldWidth={fieldWidth}
                    activeFields={activeFields}
                    click={click}
                    dragStart={dragStart}
                    dragMove={dragMove}
                    drop={drop}
                    touch2Mouse={touch2Mouse}
                />
            </div>
            <Promotion fieldWidth={fieldWidth} />
        </>
    )
}
