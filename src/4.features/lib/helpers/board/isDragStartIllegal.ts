import { Player } from 'src/5.entities/model'
import { settings } from 'src/6.shared/config'
import { Fields } from 'src/6.shared/model'

export function isDragStartIllegal(
    e: any,
    isSettingsReady: boolean,
    playerWhite: Player,
    playerBlack: Player,
    withComputer: boolean
): boolean {
    if (!isSettingsReady) return true

    if (
        e.target.classList.contains(Fields.WhiteField) ||
        e.target.classList.contains(Fields.BlackField)
    )
        return true
    if (
        playerBlack.isCurrentUser &&
        !e.target.dataset.color.includes(playerBlack.color) &&
        (!settings.offlineMode || withComputer)
    )
        return true
    if (
        playerWhite.isCurrentUser &&
        !e.target.dataset.color.includes(playerWhite.color) &&
        (!settings.offlineMode || withComputer)
    )
        return true

    return false
}
