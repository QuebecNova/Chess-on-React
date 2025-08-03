import { StockfishDifficultyLevels } from 'src/5.entities/lib'
import { Colors } from 'src/6.shared/model'

export type OnSettingsChange = (newSettings: {
    timer?: number
    increment?: number
    computerDifficulty?: keyof StockfishDifficultyLevels
    variant?: Colors
    withComputer?: boolean
    isOfflineMode?: boolean
}) => void
