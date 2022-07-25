import React, { Dispatch, ReactElement, SetStateAction, useContext } from 'react'
import Bishop from '../../figures/bishop'
import Knight from '../../figures/knight'
import Queen from '../../figures/queen'
import Rook from '../../figures/rook'
import IPiece from '../../interfaces/IPiece'
import { boardContext } from '../Board'

type Props = {
    promotedField: string
    setPromotedField: Dispatch<SetStateAction<string>>
}

export default function Promotion(props: Props) : ReactElement {

    const {
        promotedField, 
        setPromotedField,
    } = props

    const app = useContext(boardContext)

    const turnReversed = app.turn === 'Black' ? 'White' : 'Black'

    const queen = new Queen(turnReversed)
    const knight = new Knight(turnReversed)
    const bishop = new Bishop(turnReversed)
    const rook = new Rook(turnReversed)

    function transformPiece(piece : IPiece) : void {
        app.squares[promotedField] = piece
        
        const pieceOnField = {
            [promotedField]: piece
        }

        app.setSquares(squares => ({
            ...squares,
            ...pieceOnField,
        }))

        setPromotedField(null)
    }
    
  return (
    <div className={`board__promotion ${promotedField ? 'active' : 'inactive'}`}>
        <p>Choose one type of piece</p>
        <div className='board__promotion-pieces-wrapper'>
            <div className='board__promotion-pieceBlock' onClick={() => transformPiece(queen)}>
                <img src={queen.img.toString()} alt='Queen'/>
            </div>
            <div className='board__promotion-pieceBlock' onClick={() => transformPiece(knight)}>
                <img src={knight.img.toString()} alt='Knight'/>
            </div>
            <div className='board__promotion-pieceBlock' onClick={() => transformPiece(bishop)}>
                <img src={bishop.img.toString()} alt='Bishop'/>
            </div>
            <div className='board__promotion-pieceBlock' onClick={() => transformPiece(rook)}>
                <img src={rook.img.toString()} alt='Rook'/>
            </div>
        </div>
    </div>
  )
}