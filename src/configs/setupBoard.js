import Rook from "../figures/rook";
import King from "../figures/king";
import Knight from "../figures/knight";
import Pawn from "../figures/pawn";
import Queen from "../figures/queen";
import Bishop from "../figures/bishop";
import getSquares from "../services/getSquares";

export default function setupBoard() {
    const squares = getSquares(null)
    
    squares.a8 = new Rook('black')
    squares.b8 = new Knight('black')
    squares.c8 = new Bishop('black')
    squares.d8 = new Queen('black')
    squares.e8 = new King('black')
    squares.f8 = new Bishop('black')
    squares.g8 = new Knight('black')
    squares.h8 = new Rook('black')

    squares.a7 = new Pawn('black')
    squares.b7 = new Pawn('black')
    squares.c7 = new Pawn('black')
    squares.d7 = new Pawn('black')
    squares.e7 = new Pawn('black')
    squares.f7 = new Pawn('black')
    squares.g7 = new Pawn('black')
    squares.h7 = new Pawn('black')

    squares.a2 = new Pawn('white')
    squares.b2 = new Pawn('white')
    squares.c2 = new Pawn('white')
    squares.d2 = new Pawn('white')
    squares.e2 = new Pawn('white')
    squares.f2 = new Pawn('white')
    squares.g2 = new Pawn('white')
    squares.h2 = new Pawn('white')

    squares.a1 = new Rook('white')
    squares.b1 = new Knight('white')
    squares.c1 = new Bishop('white')
    squares.d1 = new Queen('white')
    squares.e1 = new King('white')
    squares.f1 = new Bishop('white')
    squares.g1 = new Knight('white')
    squares.h1 = new Rook('white')

    return squares
}