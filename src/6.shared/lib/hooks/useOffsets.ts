import { useEffect, useState } from 'react'
import useCurrentWidth from './useCurrentWidth'
import { KeyableNumbers } from 'src/6.shared/model/Keyable'

//changing usable sizes of the board related on it size in browser
export function useChessBoardOffsets(
    ref: React.RefObject<HTMLDivElement>
): [KeyableNumbers, KeyableNumbers, number[], number] {
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

        function addUpRowsAndCols(chessBoard: HTMLDivElement): void {
            setChessBoardOffsets({
                left: chessBoard.offsetLeft,
                top: chessBoard.offsetTop,
            })

            const boardWidth = chessBoard.clientWidth
            const currentFieldWidth = boardWidth / 8
            
            setFieldWidth(currentFieldWidth)
            setFieldOffsets({ x: currentFieldWidth / 2.1, y: currentFieldWidth / 1.9 })

            let fieldStartsOn = 0
            const fieldStartsOnArr: Array<number> = []

            for (let i = 0; i < 9; i++) {
                fieldStartsOn = currentFieldWidth * i
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

    return [chessBoardOffsets, fieldOffsets, fieldSizes, fieldWidth]
}
