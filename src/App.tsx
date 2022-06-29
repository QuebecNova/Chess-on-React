import React, { ReactElement } from "react";
import Header from "./components/Header";
import Board from "./components/Board"

function App() : ReactElement {

  console.log('Render');

  return (
    <div className="wrapper">
      <Header/>
      <Board/>
    </div>
  );
}

export default App;