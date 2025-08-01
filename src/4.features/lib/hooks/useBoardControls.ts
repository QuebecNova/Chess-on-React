'use client'

import { useEffect, useState } from 'react'

import {
    addActives,
    getFieldCoordinates,
    getSquares,
    isDragStartIllegal,
    removeActives,
    UniversalBoardDrawer,
} from 'src/4.features/lib/helpers'

import { useChessBoardOffsets } from 'src/4.features/lib/hooks'
import { ActiveFields } from 'src/4.features/model'
import { useGameStore } from 'src/4.features/model/providers'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { alphs, Chessboard } from 'src/5.entities/lib'
import { Colors, FieldStates, Move } from 'src/6.shared/model'

type ReturnType = [
    dragStart: (e: any) => void,
    dragMove: (e: any) => void,
    dragDrop: (e: any) => void,
    onClick: (e: any, field: string) => void,
    activeFields: ActiveFields,
]

type Arrows = {
    [key: string]: { remove: () => void }
}

export function useBoardControls(
    chessBoardRef: React.RefObject<HTMLDivElement>,
    disabled: boolean
): ReturnType {
    const dispatch = useGameStore((state) => state.dispatch)
    const players = useGameStore((state) => state.players)
    const squares = useGameStore((state) => state.squares)
    const premovedSquares = useGameStore((state) => state.premovedSquares)
    const turn = useGameStore((state) => state.turn)
    const variant = useGameStore((state) => state.variant)
    const playedMoves = useGameStore((state) => state.playedMoves)
    const withComputer = useGameStore((state) => state.withComputer)
    const premoves = useGameStore((state) => state.premoves)
    const isOfflineMode = useGameStore((state) => state.isOfflineMode)
    const chessboard = useGameStore((state) => state.chessboard)

    const squaresState = premoves.length
        ? { ...squares, ...premovedSquares }
        : squares

    const [activeFields, setActiveFields] = useState<ActiveFields>(
        getSquares(null)
    )
    const [draggedPiece, setDraggedPiece] = useState<HTMLImageElement>(null)
    const [clickedPiece, setClickedPiece] = useState<HTMLImageElement>(null)
    const [draggedField, setDraggedField] = useState<string>()
    const [boardDrawer, setBoardDrawer] = useState(null)
    const [arrow, setArrow] = useState<Move>({ from: null, to: null })
    const [arrows, setArrows] = useState<Arrows>({})
    //

    //getting offsets for correct drag-n-drop functionality
    //this helps to handle different screen sizes and when the screen size changes
    const { chessBoardOffsets, fieldOffsets, fieldSizes, fieldWidth } =
        useChessBoardOffsets(chessBoardRef)
    //

    // useSocket('piece-on-field', (piecesOnFieldData: KeyablePiecesOnFields) => {
    //     const piecesOnFields = parsePiecesOnFields(piecesOnFieldData, squares)
    //     dispatch({
    //         type: GameActionTypes.SQUARES,
    //         payload: { squares: { ...squares, ...piecesOnFields } },
    //     })
    //     //BUG
    //     switchTurn()
    // })

    useEffect(() => {
        if (!chessBoardRef.current) return
        const BoardDrawer = new UniversalBoardDrawer(chessBoardRef.current, {
            window: window,
            boardDimensions: [8, 8],
            orientation: variant[0],
            zIndex: 99999,
        })
        setBoardDrawer(BoardDrawer)
    }, [chessBoardRef])

    useEffect(() => {
        if (!boardDrawer) return
        boardDrawer.setOrientation(variant[0])
    }, [variant])

    useEffect(() => {
        if (squares[draggedField]?.color !== (isOfflineMode ? turn : variant)) {
            resetAll()
        }
    }, [squares])

    useEffect(() => {
        if (!arrow.from || !arrow.to || arrow.from === arrow.to) return
        if (arrows[arrow.from]) {
            arrows[arrow.from].remove()
        }
        const piece = squares[arrow.from]
        const fillColor =
            piece?.color === Colors.White
                ? '--lime'
                : piece?.color === Colors.Black
                  ? '--yellow'
                  : '--ocean'
        const elem = boardDrawer.createShape('arrow', [arrow.from, arrow.to], {
            style: `fill: var(${fillColor});opacity: 0.85;`,
        })
        setArrows({ ...arrows, [arrow.from]: elem })
    }, [arrow])

    function getField(e: any) {
        const coords = {
            x: e.clientX,
            y: e.clientY,
        }
        const fieldCoords = getFieldCoordinates(
            coords,
            chessBoardOffsets,
            fieldSizes,
            variant
        )
        if (fieldCoords.row !== 0 && fieldCoords.col !== 0) {
            return (
                alphs.posOut[fieldCoords.row].toString() +
                fieldCoords.col.toString()
            )
        }
    }

    //onClick handler for possibility to place piece on click
    function onClick(e: any, field: string): void {
        //handling arrow drawing
        if (e.button === 2 && e.type === 'mousedown') {
            const from = getField(e)
            setArrow({ from, to: null })
            return resetAll()
        }
        if (e.type === 'contextmenu') {
            setArrow({ from: null, to: null })
            dispatch({ type: GameActionTypes.RESET_PREMOVES })
            return resetAll()
        }
        if (e.button === 0) {
            Object.values(arrows).forEach((arrow: { remove: () => void }) =>
                arrow.remove()
            )
            setArrows({})
        }
        //
        if (!activeFields[field] && clickedPiece && !squaresState[field])
            return resetAll()
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
                players[Colors.Black],
                withComputer
            )
        )
            return

        if (e.target.dataset.color.includes(isOfflineMode ? turn : variant))
            setClickedPiece(e.target)
        if (
            e.target !== draggedPiece &&
            e.target.dataset.color.includes(isOfflineMode ? turn : variant)
        )
            setDraggedPiece(e.target)
        if (!e.target.dataset.color.includes(isOfflineMode ? turn : variant))
            return

        //getting all legal moves and display that on board
        const pieceField = e.target.parentElement.id
        setDraggedField(pieceField)
        const piece = squaresState[pieceField]
        let moves = []
        console.log(turn !== variant && !isOfflineMode)
        if (turn !== variant && !isOfflineMode) {
            moves = chessboard.getPremoves(pieceField, premoves, piece)
        } else {
            moves = chessboard.getMoves(pieceField)
        }
        addActives(moves, pieceField, setActiveFields)

        //moving static piece image to cursor (field offsets needed to center piece on cursor)
        e.target.style.position = 'absolute'
        e.target.style.left = `${e.clientX - chessBoardOffsets.left - fieldOffsets.x + (window ? window.scrollX : 0)}px`
        e.target.style.top = `${e.clientY - chessBoardOffsets.top - fieldOffsets.y + (window ? window.scrollY : 0)}px`
        e.target.style.width = `${fieldWidth}px`
    }
    //

    //drag move function for moving taken pieces
    function dragMove(e: any): void {
        if (arrow.from) {
            const to = getField(e)
            setArrow({ ...arrow, to })
        }

        if (!draggedPiece) return
        if (
            !(draggedPiece as HTMLElement).dataset.color.includes(
                isOfflineMode ? turn : variant
            )
        )
            return

        //mouse coordinates (field offsets included)
        const x =
            e.clientX -
            chessBoardOffsets.left -
            fieldOffsets.x +
            (window ? window.scrollX : 0)
        const y =
            e.clientY -
            chessBoardOffsets.top -
            fieldOffsets.y +
            (window ? window.scrollY : 0)

        //moving static piece image to cursor when move it
        draggedPiece.style.position = 'absolute'
        draggedPiece.style.left = `${x}px`
        draggedPiece.style.top = `${y}px`
    }
    //

    //drag start function for dropping pieces
    function dragDrop(e: any): void {
        if (arrow) {
            setArrow({ from: null, to: null })
        }
        if (!draggedPiece && !clickedPiece) return
        if (
            draggedPiece &&
            !(draggedPiece as HTMLElement).dataset.color.includes(
                isOfflineMode ? turn : variant
            )
        )
            return

        const dropField = getField(e)

        if (dropField) {
            if (draggedField === dropField) {
                if (draggedPiece) draggedPiece.setAttribute('style', '')
                setDraggedPiece(null)
                return
            }

            if (!activeFields[dropField]) {
                resetAll()
                return
            }

            const move: Move = {
                from: draggedField,
                to: dropField,
            }

            const isPromotion = Chessboard.isPromotion(
                squaresState[move.from],
                move.to
            )
            if (variant !== turn && !isOfflineMode) {
                if (isPromotion) {
                    dispatch({
                        type: GameActionTypes.PROMOTION_MOVE,
                        payload: {
                            promotionMove: { ...move, premove: true },
                        },
                    })
                } else {
                    dispatch({
                        type: GameActionTypes.PREMOVE,
                        payload: move,
                    })
                }
                resetAll()
                return
            }

            if (isPromotion) {
                dispatch({
                    type: GameActionTypes.PROMOTION_MOVE,
                    payload: { promotionMove: move },
                })

                resetAll()

                return
            }

            //

            //sending moved piece data to server if not in offline mode
            // if (!settings.offlineMode) {
            //     const piecesOnFieldForServers = getPiecesOnFieldForServers(
            //         piecesOnFields,
            //         castleAvailable,
            //         castledRookInitialField,
            //         draggedField
            //     )

            //     socket.emit('move-played', piecesOnFieldForServers)
            //     console.log(piecesOnFieldForServers)
            // }

            dispatch({
                type: GameActionTypes.NEW_MOVE,
                payload: move,
            })

            resetAll()
        } else {
            resetAll()
        }
    }

    //reset board and piece states
    function resetAll() {
        if (draggedPiece) draggedPiece.setAttribute('style', '')
        setDraggedPiece(null)
        setClickedPiece(null)
        removeActives(activeFields, setActiveFields)
    }

    return [dragStart, dragMove, dragDrop, onClick, activeFields]
}
