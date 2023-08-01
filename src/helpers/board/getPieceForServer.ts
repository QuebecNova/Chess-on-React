import { keyablePieceOnField } from '../../types/keyable'

export function getPieceOnFieldForServer(
    pieceOnField: keyablePieceOnField,
    castleAvailable: string[],
    castledRookInitialField: string | null,
    pieceFromThisField: string
): keyablePieceOnField {
    const pieceOnFieldForServer = {}

    for (const [key, value] of Object.entries(pieceOnField)) {
        if (value) {
            if (castleAvailable) {
                if (value.type === 'Rook') {
                    pieceOnFieldForServer[key] = {
                        type: value.type,
                        from: castledRookInitialField,
                    }
                    continue
                }
            }
            pieceOnFieldForServer[key] = {
                type: value.type,
                from: pieceFromThisField,
            }
        } else {
            pieceOnFieldForServer[key] = null
        }
    }

    return pieceOnFieldForServer
}
