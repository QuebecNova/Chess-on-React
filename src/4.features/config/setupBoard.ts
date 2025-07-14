import { Bishop, King, Knight, Pawn, Queen, Rook } from 'src/5.entities/lib'
import { KeyableSquares } from 'src/5.entities/model'
import { Colors } from 'src/6.shared/model'
//TEST
import { getSquares } from './../lib/helpers/board/getSquares';

export function setupBoard(): KeyableSquares {
    const squares = getSquares(null)

    squares.a8 = new Rook(Colors.Black)
    squares.b8 = new Knight(Colors.Black)
    squares.c8 = new Bishop(Colors.Black)
    squares.d8 = new Queen(Colors.Black)
    squares.e8 = new King(Colors.Black)
    squares.f8 = new Bishop(Colors.Black)
    squares.g8 = new Knight(Colors.Black)
    squares.h8 = new Rook(Colors.Black)

    squares.a7 = new Pawn(Colors.Black)
    squares.b7 = new Pawn(Colors.Black)
    squares.c7 = new Pawn(Colors.Black)
    squares.d7 = new Pawn(Colors.Black)
    squares.e7 = new Pawn(Colors.Black)
    squares.f7 = new Pawn(Colors.Black)
    squares.g7 = new Pawn(Colors.Black)
    squares.h7 = new Pawn(Colors.Black)

    squares.a2 = new Pawn(Colors.White)
    squares.b2 = new Pawn(Colors.White)
    squares.c2 = new Pawn(Colors.White)
    squares.d2 = new Pawn(Colors.White)
    squares.e2 = new Pawn(Colors.White)
    squares.f2 = new Pawn(Colors.White)
    squares.g2 = new Pawn(Colors.White)
    squares.h2 = new Pawn(Colors.White)

    squares.a1 = new Rook(Colors.White)
    squares.b1 = new Knight(Colors.White)
    squares.c1 = new Bishop(Colors.White)
    squares.d1 = new Queen(Colors.White)
    squares.e1 = new King(Colors.White)
    squares.f1 = new Bishop(Colors.White)
    squares.g1 = new Knight(Colors.White)
    squares.h1 = new Rook(Colors.White)

    return squares
}
