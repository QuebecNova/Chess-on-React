import React from "react";

import Board from "./Board";
import Header from './Header'

export const PieceFieldsContext = React.createContext(); 

function App() {
  
  
  //creating an array of board fields
  const rows = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const columns = [1, 2, 3, 4, 5, 6, 7, 8]
  
  const pieceFields = [];
  
  for (let i = 0; i < 8; i++) {
    pieceFields[i] = columns.map(index => {
      return rows[i] + index;
    })
  }

  console.log(pieceFields); //see that in action!


  return (
    <PieceFieldsContext.Provider value={pieceFields}>
      <div className="wrapper">
        <Header/>
        <Board/>
      </div>
    </PieceFieldsContext.Provider>
  );
}

export default App;