import React from "react";
import piecesImages from "./models/piecesImages";
import initialPosition from "./configs/initialPosition";
import King from "./figures/King";
import Knight from "./figures/Knight";
import Queen from "./figures/Queen";
import Pawn from "./figures/Pawn";
import Bishop from "./figures/Bishop";
import Rook from "./figures/Rook";

export default function Piece({ field }) {
  const pieceType = initialPosition[field];
  const pieceImg = piecesImages[pieceType];

  function pieceDefiner() {
    if (!pieceType) return;
    const pieceFigure = pieceType.slice(5, 15);

    let piece;

    switch (pieceFigure) {
      case "Rook":
        piece = <Rook/>;
        break;
      case "Bishop":
        piece = <Bishop/>;
        break;
      case "Knight":
        piece = <Knight/>;
        break;
      case "Pawn":
        piece = <Pawn/>;
        break;
      case "Queen":
        piece = <Queen/>;
        break;
      case "King":
        piece = <King/>;
        break;
      default:
        break;
    }
    const pieceWithProps = React.cloneElement(piece, {
      pieceImg,
      field,
    });
    return pieceWithProps;
  }

  return <>{pieceDefiner()}</>;
}
