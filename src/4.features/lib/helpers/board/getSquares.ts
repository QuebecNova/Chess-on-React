import { Keyable } from 'src/5.entities/model'

export function getSquares(value: null): Keyable<null> {
    //creating square state

    const squares: Keyable<null> = {}

    const rows = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const columns = [1, 2, 3, 4, 5, 6, 7, 8]

    let reveresed = 7

    columns.forEach(() => {
        rows.forEach((letter) => {
            const field = letter + columns[reveresed]
            squares[field] = value
        })
        reveresed--
    })

    return squares
}
