import { useEffect, useState } from 'react'
import { KeyableNumbers } from 'src/6.shared/model'
import { useCurrentWidth } from './useCurrentWidth'

type ReturnType = {
    chessBoardOffsets: KeyableNumbers
    fieldOffsets: KeyableNumbers
    fieldSizes: number[]
    fieldWidth: number
}

//changing usable sizes of the board related on it size in browser
//this helps to handle different screen sizes and when the screen size changes
export function useChessBoardOffsets(
    ref: React.RefObject<HTMLDivElement>
): ReturnType {
    const currentWindowWidth = useCurrentWidth()

    const [chessBoardOffsets, setChessBoardOffsets] = useState<KeyableNumbers>({
        left: 0,
        top: 0,
    })
    const [fieldOffsets, setFieldOffsets] = useState<KeyableNumbers>({
        x: 43.75,
        y: 43.75,
    })
    const [fieldSizes, setFieldSizes] = useState<Array<number>>([])
    const [fieldWidth, setFieldWidth] = useState<number>()

    useEffect(() => {
        let chessBoard = ref.current
        if (!chessBoard) return
        function addUpRowsAndCols(chessBoard: HTMLDivElement): void {
            const { left, top } = chessBoard.getBoundingClientRect()
            setChessBoardOffsets({
                left: left + (window ? window.scrollX : 0),
                top: top + (window ? window.scrollY : 0),
            })

            const boardWidth = chessBoard.clientWidth
            const currentFieldWidth = boardWidth / 8
            setFieldWidth(currentFieldWidth)
            setFieldOffsets({
                x: currentFieldWidth / 1.9,
                y: currentFieldWidth / 1.9,
            })

            let fieldStartsOn = 0
            const fieldStartsOnArr: Array<number> = []

            for (let i = 0; i < 9; i++) {
                fieldStartsOn = currentFieldWidth * i
                fieldStartsOnArr.push(fieldStartsOn)
            }
            setFieldSizes([...fieldStartsOnArr])
        }

        function resizedBoard() {
            addUpRowsAndCols(chessBoard)
        }

        new ResizeObserver(resizedBoard).observe(chessBoard)
    }, [currentWindowWidth, ref])

    return { chessBoardOffsets, fieldOffsets, fieldSizes, fieldWidth }
}
