import { createContext, useState } from 'react'
import { CreateGame, Game, Header } from 'src/3.widgets/ui'

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
            {inGame ? (
                <div className="wrapper">
                    <Header />
                    <Game />
                </div>
            ) : (
                <div className="wrapper">
                    <Header />
                    <CreateGame setOfflineMode={setOfflineMode} />
                </div>
            )}
        </AppContext.Provider>
    )
}
