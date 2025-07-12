import React, { useContext } from 'react'
import { boardContext } from 'src/3.widgets/ui/Board'
import socket from 'src/6.shared/api/socket'
import settings from 'src/6.shared/config/settings'
import sounds from 'src/6.shared/lib/helpers/misc/playSounds'
import Player from 'src/6.shared/lib/helpers/player'
import { Colors } from 'src/6.shared/model/constants/board'
import Button from 'src/6.shared/ui/button'

type Props = {
    setIsSideSet: React.Dispatch<React.SetStateAction<boolean>>
}

let playerWhite = new Player(Colors.White, 60000, false, false)
let playerBlack = new Player(Colors.Black, 60000, false, false)

export default function DefineSide({ setIsSideSet }: Props) {
    const board = useContext(boardContext)

    if (!settings.offlineMode) {
        socket.on('player-choosen-color', (color) => {
            if (color === Colors.White) {
                playerBlack = new Player(Colors.Black, 60000, false, true)
            } else {
                playerWhite = new Player(Colors.White, 60000, false, true)
            }
            board.setVariant(
                color === Colors.White ? Colors.Black : Colors.White
            )
            setIsSideSet(true)
            sounds.newGame.play()
        })
    }

    function setSide(color = Colors.White): void {
        if (color === Colors.Black) {
            board.setVariant(color)
            if (!settings.offlineMode) socket.emit('choosen-side', color)
            playerBlack = new Player(Colors.Black, 60000, false, true)
        } else {
            board.setVariant(color)
            if (!settings.offlineMode) socket.emit('choosen-side', color)
            playerWhite = new Player(Colors.White, 60000, false, true)
        }
        setIsSideSet(true)
        sounds.newGame.play()
    }

    return (
        <div className={`board__define-side`}>
            <p>Choose your side</p>
            <Button onClick={() => setSide(Colors.White)}>White</Button>
            <Button onClick={() => setSide(Colors.Black)}>Black</Button>
        </div>
    )
}

export { playerBlack, playerWhite }
