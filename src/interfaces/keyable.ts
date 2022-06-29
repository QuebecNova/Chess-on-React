export interface keyableString {
    [key: string]: string
}

interface piece {
    color: string,
    type: string,
    img: React.FunctionComponent<React.SVGAttributes<SVGElement>>
    lastMoves?: Array<string>
}

export interface keyableSquares {
    [key: string]: piece | null
}

export interface keyableBoolean {
    [key: string]: boolean
}

export interface keyableSVGElement {
    [key: string] : React.FunctionComponent<React.SVGAttributes<SVGElement>>
}

export interface keyableAudio {
    [key: string] : HTMLAudioElement
}