import Player from "./player";

export function stopAndStartPlayerTime(currentPlayer : Player, players : Player[]) {

    if (currentPlayer.color === 'White') {
        players[1].isPlaying = true
        currentPlayer.isPlaying = false
    }

    if (currentPlayer.color === 'Black') {
        players[0].isPlaying = true
        currentPlayer.isPlaying = false
    }
}

export function stopAllTimers(players : Player[]) {
    players[0].isPlaying = false
    players[1].isPlaying = false
}