export interface KeyableString {
    [key: string]: string | null
}

export interface KeyableStringOrBoolean {
    [key: string]: boolean | string
}

export interface KeyableNumbers {
    [key: string]: number
}

export interface KeyableSVGElement {
    [key: string]: React.FunctionComponent<React.SVGAttributes<SVGElement>>
}

export interface KeyableAudio {
    [key: string]: HTMLAudioElement
}

export function isKeyableString(value: any): value is KeyableString {
    return true
}
