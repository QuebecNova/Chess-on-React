import settings from 'src/6.shared/config/settings'
import Player from 'src/6.shared/lib/helpers/player'
import { Fields } from 'src/6.shared/model/constants/board'

export function isDragStartIllegal(
    e: any,
    isSettingsReady: boolean,
    playerWhite: Player,
    playerBlack: Player
): boolean {
    if (!isSettingsReady) return true

    if (
        e.target.classList.contains(Fields.WhiteField) ||
        e.target.classList.contains(Fields.BlackField)
    )
        return true
    if (
        playerBlack.isYou &&
        !e.target.dataset.color.includes(playerBlack.color) &&
        !settings.offlineMode
    )
        return true
    if (
        playerWhite.isYou &&
        !e.target.dataset.color.includes(playerWhite.color) &&
        !settings.offlineMode
    )
        return true

    return false
}
