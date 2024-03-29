import IPiece from './IPiece'

export interface keyableString {
    [key: string]: string | null
}

export interface keyableSquares {
    [key: string]: IPiece | null
}

export interface keyablePieceOnField {
    [key: string]: IPiece | null
}

export interface keyableStringOrBoolean {
    [key: string]: boolean | string
}

export interface keyableNumbers {
    [key: string]: number
}

export interface keyableSVGElement {
    [key: string]: React.FunctionComponent<React.SVGAttributes<SVGElement>>
}

export interface keyableAudio {
    [key: string]: HTMLAudioElement
}

export function isKeyableString(value: any): value is keyableString {
    return true
}
