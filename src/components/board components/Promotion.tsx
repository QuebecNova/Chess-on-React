import React, { Dispatch, ReactElement, SetStateAction } from 'react'
import Bishop from '../../figures/bishop'
import Knight from '../../figures/knight'
import Queen from '../../figures/queen'
import Rook from '../../figures/rook'
import IPiece from '../../interfaces/IPiece'
import { keyableSquares } from '../../interfaces/keyable'

type Props = {
    promotedField: string
    setPromotedField: Dispatch<SetStateAction<string>>
    turn: string
    squares: keyableSquares
    setSquares: Dispatch<SetStateAction<keyableSquares>>
}

export default function Promotion(props: Props) : ReactElement {

    const {
        promotedField, 
        setPromotedField, 
        turn, 
        squares, 
        setSquares,
    } = props

    const turnReversed = turn === 'Black' ? 'White' : 'Black'

    const queen = new Queen(turnReversed)
    const knight = new Knight(turnReversed)
    const bishop = new Bishop(turnReversed)
    const rook = new Rook(turnReversed)

    function transformPiece(piece : IPiece) : void {
        squares[promotedField] = piece
        
        const pieceOnField = {
            [promotedField]: piece
        }

        setSquares(squares => ({
            ...squares,
            ...pieceOnField,
        }))

        setPromotedField(null)
    }
    
  return (
    <div className={`board__promotion ${promotedField ? 'active' : 'inactive'}`}>
        <p>Choose one type of piece</p>
        <div className='board__promotion-pieces-wrapper'>
            <button className='board__promotion-pieceBlock' onClick={() => transformPiece(queen)}>
                <img src={queen.img.toString()} alt='Queen'/>
            </button>
            <button className='board__promotion-pieceBlock' onClick={() => transformPiece(knight)}>
                <img src={knight.img.toString()} alt='Knight'/>
            </button>
            <button className='board__promotion-pieceBlock' onClick={() => transformPiece(bishop)}>
                <img src={bishop.img.toString()} alt='Bishop'/>
            </button>
            <button className='board__promotion-pieceBlock' onClick={() => transformPiece(rook)}>
                <img src={rook.img.toString()} alt='Rook'/>
            </button>
        </div>
    </div>
  )
}