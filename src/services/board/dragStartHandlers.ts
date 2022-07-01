import IPiece from "../../interfaces/IPiece";

export function setEnpassant(moves : Array<string>, piece : IPiece, setEnpassantAvailable : React.Dispatch<React.SetStateAction<string>>) {
    if (moves.length 
        && piece.type === 'Pawn' 
        && moves.slice().pop().includes('enpassant')) {
            setEnpassantAvailable(moves.slice().pop())
    }
}

export function setCastle(moves : Array<string>, piece : IPiece, setCastleAvailable : React.Dispatch<React.SetStateAction<string[]>>) {
    if (moves.length && piece.type === 'King') {
        const castleOnThisSides : Array<string> = []
        if (moves.includes('castleRight')) castleOnThisSides.push('castleRight')
        if (moves.includes('castleLeft')) castleOnThisSides.push('castleLeft')
        setCastleAvailable(castleOnThisSides)
    }
}