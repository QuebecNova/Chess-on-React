import React from "react";

import Board from "./Board";
import Header from './Header';

export const PieceFieldsContext = React.createContext(); 

function App() {

  console.log('Render');
  
  //creating an array of board fields
  const rows = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const columns = [1, 2, 3, 4, 5, 6, 7, 8]
  
  const pieceFields = [];
  
  let reveresed = 7;
  
  for (let i = 0; i < 8; i++) {
    pieceFields[i] = rows.map(letter => {
      return letter + columns[reveresed];
    })
    reveresed--;
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