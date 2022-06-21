import React from "react";

import Board from "./Board";
import Header from './Header';

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
    <div className="wrapper">
      <Header/>
      <Board pieceFields={pieceFields}/>
    </div>
  );
}

export default App;