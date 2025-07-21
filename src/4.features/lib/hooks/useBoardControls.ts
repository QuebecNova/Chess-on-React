'use client'

import { useState } from 'react'

import {
    addActives,
    checkForCastle,
    checkForEnpassant,
    getFieldCoordinates,
    getMovesThatLeadsToCheck,
    getPieceOnFieldForServer,
    getSquares,
    isDragStartIllegal,
    playPlacedPieceSound,
    removeActives,
    setCastle,
    setEnpassant,
    stopAndStartPlayerTime,
} from 'src/4.features/lib/helpers'

import { setupBoard } from 'src/4.features/config/setupBoard'
import { useChessBoardOffsets } from 'src/4.features/lib/hooks'
import { useGameStore } from 'src/4.features/model/providers'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { alphs } from 'src/5.entities/lib'
import { socket } from 'src/6.shared/api'
import { settings } from 'src/6.shared/config/settings'
import {
    CastlingSide,
    Colors,
    FieldStates,
    Move,
    Pieces,
} from 'src/6.shared/model'

type ReturnType = [
    dragStart: (e: any) => void,
    dragMove: (e: any) => void,
    dragDrop: (e: any) => void,
    onClick: (e: any, field: string) => void,
    activeFields: object,
]

export function useBoardControls(
    chessBoardRef: React.RefObject<HTMLDivElement>,
    disabled: boolean
): ReturnType {
    const dispatch = useGameStore((state) => state.dispatch)
    const players = useGameStore((state) => state.players)
    const squares = useGameStore((state) => state.squares)
    const turn = useGameStore((state) => state.turn)
    const variant = useGameStore((state) => state.variant)
    const playedMoves = useGameStore((state) => state.playedMoves)

    const [activeFields, setActiveFields] = useState(getSquares(null))
    const [draggedPiece, setDraggedPiece] = useState<HTMLImageElement>(null)
    const [clickedPiece, setClickedPiece] = useState<HTMLImageElement>(null)
    const [draggedPieceCoords, setDraggedPieceCoords] = useState<string>()
    const [castleAvailable, setCastleAvailable] = useState<Array<string>>([])
    const [enpassantAvailable, setEnpassantAvailable] = useState<string>(null)
    //

    //getting offsets for correct drag-n-drop functionality
    //this helps to handle different screen sizes and when the screen size changes
    const { chessBoardOffsets, fieldOffsets, fieldSizes, fieldWidth } =
        useChessBoardOffsets(chessBoardRef)
    //

    // useSocket('piece-on-field', (pieceOnFieldData: KeyablePieceOnField) => {
    //     const pieceOnField = parsePieceOnField(pieceOnFieldData, squares)
    //     dispatch({
    //         type: GameActionTypes.SQUARES,
    //         payload: { squares: { ...squares, ...pieceOnField } },
    //     })
    //     //BUG
    //     playPlacedPieceSound(false)
    //     switchTurn()

    //     const currentPlayer =
    //         turn === Colors.White
    //             ? players[Colors.White]
    //             : players[Colors.Black]
    //     stopAndStartPlayerTime(currentPlayer, [
    //         players[Colors.White],
    //         players[Colors.Black],
    //     ])
    // })

    //onClick handler for possibility to place piece on click
    function onClick(e: any, field: string): void {
        if (
            !e.target.classList.contains(FieldStates.PieceCanMoveHere) ||
            disabled
        )
            return
        if (
            activeFields[field] ||
            e.nativeEvent.path[1].classList.contains(
                FieldStates.PieceCanMoveHere
            )
        ) {
            dragDrop(e)
        }
    }
    //

    //drag start function for taking pieces
    function dragStart(e: any): void {
        e.preventDefault()

        if (
            isDragStartIllegal(
                e,
                !disabled,
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

        //getting all legal moves and display that on board
        const pieceField = e.target.parentElement.id
        setDraggedPieceCoords(pieceField)
        const piece = squares[pieceField]
        const moves = piece.canMove(
            pieceField,
            squares,
            getMovesThatLeadsToCheck(squares, piece, pieceField, turn),
            setupBoard(),
            playedMoves
        )

        setEnpassant(moves, piece, setEnpassantAvailable)
        setCastle(moves, piece, setCastleAvailable)
        addActives(moves, pieceField, setActiveFields)

        //moving static piece image to cursor (field offsets needed to center piece on cursor)
        e.target.style.position = 'absolute'
        e.target.style.left = `${e.clientX - chessBoardOffsets.left - fieldOffsets.x + window.scrollX}px`
        e.target.style.top = `${e.clientY - chessBoardOffsets.top - fieldOffsets.y + window.scrollY}px`
        e.target.style.width = `${fieldWidth}px`
    }
    //

    //drag move function for moving taked pieces
    function dragMove(e: any): void {
        if (!draggedPiece) return
        if (!(draggedPiece as HTMLElement).dataset.color.includes(turn)) return

        //mouse coordinates (field offsets included)
        const x =
            e.clientX - chessBoardOffsets.left - fieldOffsets.x + window.scrollX
        const y =
            e.clientY - chessBoardOffsets.top - fieldOffsets.y + window.scrollY

        // //moving static piece image to cursor when move it
        draggedPiece.style.position = 'absolute'
        draggedPiece.style.left = `${x}px`
        draggedPiece.style.top = `${y}px`
    }
    //

    //drag start function for dropping pieces
    function dragDrop(e: any): void {
        if (!draggedPiece && !clickedPiece) return
        if (
            draggedPiece &&
            !(draggedPiece as HTMLElement).dataset.color.includes(turn)
        )
            return

        const coords = {
            x: e.clientX,
            y: e.clientY,
        }
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
            const dropField =
                alphs.posOut[dropCoords.row].toString() +
                dropCoords.col.toString()
            const piece = squares[draggedPieceCoords]

            let pieceOnField = {
                [draggedPieceCoords]: null,
                [dropField]: piece,
            }

            //enpassant and castle dataset
            let enpassanted = false
            let castledRookInitialField: string | null = null

            if (enpassantAvailable) {
                const [isEnpassanted, enpassantedFields] = checkForEnpassant(
                    squares,
                    dropField,
                    draggedPieceCoords,
                    enpassantAvailable
                )
                if (isEnpassanted) {
                    pieceOnField = { ...pieceOnField, ...enpassantedFields }
                    enpassanted = true
                }
            }
            let castledSide: CastlingSide | null = null
            if (castleAvailable.length) {
                const {
                    modifiedPieceOnField,
                    rookInitialPieceField,
                    castlingSide,
                } = checkForCastle(
                    squares,
                    dropField,
                    draggedPieceCoords,
                    castleAvailable
                )
                pieceOnField = {
                    ...pieceOnField,
                    ...modifiedPieceOnField,
                }
                castledRookInitialField = rookInitialPieceField
                castledSide = castlingSide
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
            const isCapture = !!squares[dropField] || enpassanted
            const move: Move = {
                from: draggedPieceCoords,
                to: dropField,
                isCapture,
            }
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

            if (pawnOnPromotionField && piece.color === turn) {
                dispatch({
                    type: GameActionTypes.PROMOTION_MOVE,
                    payload: { move },
                })

                resetAll(draggedPiece)

                return
            }

            const currentPlayer =
                turn === Colors.White
                    ? players[Colors.White]
                    : players[Colors.Black]
            stopAndStartPlayerTime(currentPlayer, [
                players[Colors.White],
                players[Colors.Black],
            ])
            playPlacedPieceSound(isCapture)
            //

            //sending moved piece data to server if not in offline mode
            if (!settings.offlineMode) {
                const pieceOnFieldForServer = getPieceOnFieldForServer(
                    pieceOnField,
                    castleAvailable,
                    castledRookInitialField,
                    draggedPieceCoords
                )

                socket.emit('move-played', pieceOnFieldForServer)
                console.log(pieceOnFieldForServer)
            }

            if (piece.addMove) piece.addMove(move)

            dispatch({
                type: GameActionTypes.NEW_MOVE,
                payload: {
                    squares: { ...squares, ...pieceOnField },
                    move,
                    promotionTo: null,
                    piece,
                    isEnpassant: enpassanted,
                    castlingSide: castledSide,
                },
            })

            resetAll(draggedPiece)
        } else {
            resetAll(draggedPiece)
        }
    }

    //reset board and piece states
    function resetAll(draggedPiece: HTMLImageElement) {
        if (draggedPiece) draggedPiece.setAttribute('style', '')
        setEnpassantAvailable(null)
        setDraggedPiece(null)
        setClickedPiece(null)
        removeActives(activeFields, setActiveFields)
    }

    return [dragStart, dragMove, dragDrop, onClick, activeFields]
}
