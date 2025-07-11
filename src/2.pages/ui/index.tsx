import React, { createContext, useState } from 'react'
import Board from 'src/3.widgets/ui/Board'
import Header from 'src/3.widgets/ui/Header'
import CreateGame from 'src/4.features/ui/gameState/CreateGame'

export const AppContext = createContext(null)

export default function LandingPage() {
    const [inGame, setInGame] = useState(false)
    const [offlineMode, setOfflineMode] = useState(false)

    const contextValue = {
        setInGame,
        offlineMode,
    }

    return (
        <AppContext.Provider value={contextValue}>
                {inGame ?
                    <div className="wrapper">
                        <Header />
                        <Board />
                    </div>
                    :
                    <div className="wrapper">
                        <Header />
                        <CreateGame setOfflineMode={setOfflineMode} />
                    </div>
                }
        </AppContext.Provider>
    )
}