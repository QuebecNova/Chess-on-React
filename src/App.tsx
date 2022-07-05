import React, { createContext, ReactElement, useState } from "react";
import Header from "./components/Header";
import Board from "./components/Board"
import CreateGame from "./components/CreateGame";

export const AppContext = createContext(null)

function App() : ReactElement {

  const [inGame, setInGame] = useState(false)
  const [offlineMode, setOfflineMode] = useState(false)

  const contextValue = {
    setInGame,
  }

  console.log('Render');

  if (!inGame) return (
    <AppContext.Provider value={contextValue}>
      <div className="wrapper">
        <Header/>
        <CreateGame setOfflineMode={setOfflineMode}/>
      </div>
    </AppContext.Provider>
  );

  if (inGame) return (
    <div className="wrapper">
      <Header/>
      <Board offlineMode={offlineMode}/>
    </div>
  );
}

export default App;