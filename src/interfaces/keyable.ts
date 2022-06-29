import IPiece from "./IPiece"

export interface keyableString {
    [key: string]: string
}

export interface keyableSquares {
    [key: string]: IPiece | null
}

export interface keyableSVGElement {
    [key: string] : React.FunctionComponent<React.SVGAttributes<SVGElement>>
}

export interface keyableAudio {
    [key: string] : HTMLAudioElement
}