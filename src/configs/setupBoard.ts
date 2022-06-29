import { keyableSquares } from './../interfaces/keyable';
import Rook from "../figures/rook";
import King from "../figures/king";
import Knight from "../figures/knight";
import Pawn from "../figures/pawn";
import Queen from "../figures/queen";
import Bishop from "../figures/bishop";
import getSquares from "../services/getSquares";

const nullSquares = getSquares(null)

export default function setupBoard() : keyableSquares {
    const squares = nullSquares
    
    squares.a8 = new Rook('Black')
    squares.b8 = new Knight('Black')
    squares.c8 = new Bishop('Black')
    squares.d8 = new Queen('Black')
    squares.e8 = new King('Black')
    squares.f8 = new Bishop('Black')
    squares.g8 = new Knight('Black')
    squares.h8 = new Rook('Black')

    squares.a7 = new Pawn('Black')
    squares.b7 = new Pawn('Black')
    squares.c7 = new Pawn('Black')
    squares.d7 = new Pawn('Black')
    squares.e7 = new Pawn('Black')
    squares.f7 = new Pawn('Black')
    squares.g7 = new Pawn('Black')
    squares.h7 = new Pawn('Black')

    squares.a2 = new Pawn('White')
    squares.b2 = new Pawn('White')
    squares.c2 = new Pawn('White')
    squares.d2 = new Pawn('White')
    squares.e2 = new Pawn('White')
    squares.f2 = new Pawn('White')
    squares.g2 = new Pawn('White')
    squares.h2 = new Pawn('White')

    squares.a1 = new Rook('White')
    squares.b1 = new Knight('White')
    squares.c1 = new Bishop('White')
    squares.d1 = new Queen('White')
    squares.e1 = new King('White')
    squares.f1 = new Bishop('White')
    squares.g1 = new Knight('White')
    squares.h1 = new Rook('White')

    return squares
}