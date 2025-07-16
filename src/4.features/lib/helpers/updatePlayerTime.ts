import { Player } from 'src/5.entities/model'
import { Colors } from 'src/6.shared/model'

export function stopAndStartPlayerTime(
    currentPlayer: Player,
    players: Player[]
): void {
    if (currentPlayer.color === Colors.White) {
        players[1].isPlaying = true
    }

    if (currentPlayer.color === Colors.Black) {
        players[0].isPlaying = true
    }

    currentPlayer.isPlaying = false
}

export function stopAllTimers(players: Player[]): void {
    players[0].isPlaying = false
    players[1].isPlaying = false
}
