import settings from "../../configs/settings"
import Player from './../player';

export function isDragStartIllegal
    (
        e : any, 
        isSettingsReady: boolean, 
        playerWhite : Player, 
        playerBlack : Player,
    ) : boolean {
    
    if (!isSettingsReady) return true
       
    if (e.target.classList.contains('whiteField') || e.target.classList.contains('blackField')) return true
        
    if (playerBlack.isYou && !e.target.src.includes(playerBlack.color) && !settings.offlineMode) return true
    if (playerWhite.isYou && !e.target.src.includes(playerWhite.color) && !settings.offlineMode) return true

    return false
}