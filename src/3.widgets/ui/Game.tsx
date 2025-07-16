import { GameStoreProvider } from 'src/4.features/model/providers'
import {
    AcceptRestart,
    Board,
    Chat,
    MatedMessage,
    PlayedMoves,
    StartingSettings,
} from 'src/4.features/ui'
import Timers from './Timers'

export default function Game() {
    return (
        <GameStoreProvider>
            <div className="board-wrapper">
                <StartingSettings />
                <Timers />
                <Board />
                <MatedMessage />
                <AcceptRestart />
                <PlayedMoves />
                <Chat />
            </div>
        </GameStoreProvider>
    )
}
