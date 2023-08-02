import React, { createContext, ReactElement, useEffect, useState } from 'react'
import Header from '../components/Header'
import Board from '../components/Board'
import CreateGame from '../components/CreateGame'
import { buildClient } from '../api/buildClient'

export const AppContext = createContext(null)

export default function LandingPage() {
    const [inGame, setInGame] = useState(false)
    const [offlineMode, setOfflineMode] = useState(false)

    const contextValue = {
        setInGame,
        offlineMode,
    }

    if (!inGame)
        return (
            <AppContext.Provider value={contextValue}>
                <div className="wrapper">
                    <Header />
                    <CreateGame setOfflineMode={setOfflineMode} />
                </div>
            </AppContext.Provider>
        )

    if (inGame)
        return (
            <AppContext.Provider value={contextValue}>
                <div className="wrapper">
                    <Header />
                    <Board />
                </div>
            </AppContext.Provider>
        )
}

LandingPage.getInitialProps = async (ctx, client, user) => {
    // const { data } = await client.get('/api/v1/data')

    return { tickets: {} }
}
