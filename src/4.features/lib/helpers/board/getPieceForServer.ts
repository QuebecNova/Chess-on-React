// import { KeyablePieceOnField } from 'src/5.entities/model'
// import { Pieces } from 'src/6.shared/model'

// export function getPieceOnFieldForServer(
//     pieceOnField: KeyablePieceOnField,
//     castleAvailable: string[],
//     castledRookInitialField: string | null,
//     pieceFromThisField: string
// ): KeyablePieceOnField {
//     const pieceOnFieldForServer = {}

//     for (const [key, value] of Object.entries(pieceOnField)) {
//         if (value) {
//             if (castleAvailable) {
//                 if (value.type === Pieces.Rook) {
//                     pieceOnFieldForServer[key] = {
//                         type: value.type,
//                         from: castledRookInitialField,
//                     }
//                     continue
//                 }
//             }
//             pieceOnFieldForServer[key] = {
//                 type: value.type,
//                 from: pieceFromThisField,
//             }
//         } else {
//             pieceOnFieldForServer[key] = null
//         }
//     }

//     return pieceOnFieldForServer
// }
