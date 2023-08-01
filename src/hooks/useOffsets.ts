import { useEffect, useState } from 'react'
import { keyableNumbers } from '../types/keyable'
import useCurrentWidth from './useCurrentWidth'

//changing usable sizes of the board related on it size in browser
export function useChessBoardOffsets(
    ref: React.MutableRefObject<HTMLDivElement>
): [keyableNumbers, keyableNumbers, number[]] {
    const currentWindowWidth = useCurrentWidth()

    const [chessBoardOffsets, setChessBoardOffsets] = useState<keyableNumbers>({
        left: 0,
        top: 0,
    })
    const [fieldOffsets, setFieldOffsets] = useState<keyableNumbers>({
        x: 43.75,
        y: 43.75,
    })
    const [fieldSizes, setFieldSizes] = useState<Array<number>>([])

    useEffect(() => {
        let chessBoard = ref.current

        function addUpRowsAndCols(chessBoard: HTMLDivElement): void {
            setChessBoardOffsets({
                left: chessBoard.offsetLeft,
                top: chessBoard.offsetTop,
            })

            const boardWidth = chessBoard.clientWidth
            const fieldWidth = boardWidth / 8

            setFieldOffsets({ x: fieldWidth / 2.1, y: fieldWidth / 1.9 })

            let fieldStartsOn = 0
            const fieldStartsOnArr: Array<number> = []

            for (let i = 0; i < 9; i++) {
                fieldStartsOn = fieldWidth * i
                fieldStartsOnArr.push(fieldStartsOn)
            }
            setFieldSizes([...fieldStartsOnArr])
        }

        function resizedBoard() {
            chessBoard = ref.current
            addUpRowsAndCols(chessBoard)
        }

        new ResizeObserver(resizedBoard).observe(chessBoard)
    }, [currentWindowWidth, ref])

    return [chessBoardOffsets, fieldOffsets, fieldSizes]
}
