import { ValueOf } from 'src/6.shared/model'

export class Stockfish {
    private stockfish: Worker | null

    constructor() {
        this.stockfish =
            typeof Worker !== 'undefined' ? new Worker('/stockfish.js') : null

        this.onMessage = this.onMessage.bind(this)
        if (this.stockfish) {
            this.#sendMessage('uci')
            this.#sendMessage('isready')
        }
    }

    onMessage(callback: (data: { bestMove: string }) => void) {
        if (this.stockfish) {
            const eventListenerCallback = (e) => {
                const bestMove = e.data?.match(/bestmove\s+(\S+)/)?.[1]
                callback({ bestMove })
            }
            this.stockfish.addEventListener('message', eventListenerCallback)

            return () =>
                this.stockfish.removeEventListener(
                    'message',
                    eventListenerCallback
                )
        }
        return () => {}
    }

    evaluatePosition(fen: string, difficulty: StockfishDifficultyLevels) {
        if (this.stockfish) {
            this.stockfish.postMessage(`position fen ${fen}`)
            this.stockfish.postMessage(
                `setoption name Skill Level value ${difficulty}`
            )
            this.stockfish.postMessage(`go depth 12`)
        }
    }

    stop() {
        this.#sendMessage('stop')
    }

    quit() {
        this.#sendMessage('quit')
    }

    #sendMessage(message: string) {
        if (this.stockfish) {
            this.stockfish.postMessage(message)
        }
    }
}

export const StockfishDifficultyLevels = {
    1: 0,
    2: 2,
    3: 4,
    4: 7,
    5: 11,
    6: 14,
    7: 17,
    8: 20,
} as const
export type StockfishDifficultyLevels = ValueOf<
    typeof StockfishDifficultyLevels
>
export function isStockfishDifficultyLevels(
    value: any
): value is StockfishDifficultyLevels {
    return true
}
